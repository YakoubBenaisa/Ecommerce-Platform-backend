import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { injectable , singleton } from "tsyringe";

@injectable()
@singleton()
export default class ImageHandler {
    
  private uploadDirectory = path.join(__dirname, "..", "uploads");

  constructor() {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDirectory)) {
      fs.mkdirSync(this.uploadDirectory, { recursive: true });
    }
  }

  // Configure Multer for file uploads
  public upload = multer({

    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDirectory);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|bmp|tiff|webp|svg/;
      const mimeType = allowedTypes.test(file.mimetype);
      const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

      if (mimeType && extName) {
        return cb(null, true);
      }
      cb(new Error("Only images (JPG, PNG) are allowed"));
    },
  });

  // Retrieve an image by filename
  public getImage = (req: Request, res: Response) => {
    const { filename } = req.params;
    const filePath = path.join(this.uploadDirectory, filename);

    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    } else {
      return res.status(404).json({ message: "Image not found" });
    }
  };

  // Delete an image by filename
  public deleteImage = (req: Request, res: Response) => {
    const { filename } = req.params;
    const filePath = path.join(this.uploadDirectory, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ message: "Image deleted successfully" });
    } else {
      return res.status(404).json({ message: "Image not found" });
    }
  };
}

