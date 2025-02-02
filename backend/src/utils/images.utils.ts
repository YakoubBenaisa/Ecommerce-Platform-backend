import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { injectable, singleton, inject } from "tsyringe";
import ResponseUtils from "./response.utils";
import { 
  BadRequestError, 
  NotFoundError, 
  InternalServerError, 
  ConflictError 
} from "../types/errors"; // Adjust import path

@injectable()
@singleton()
export default class ImageHandler {
  private uploadDirectory = path.join(__dirname, "../../../", "uploads");

  constructor(@inject("responseUtils") private responseUtils: ResponseUtils) {
    try {
      if (!fs.existsSync(this.uploadDirectory)) {
        fs.mkdirSync(this.uploadDirectory, { recursive: true });
      }
    } catch (error) {
      
      throw new InternalServerError("Failed to initialize image storage");
    }
  }

  public upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDirectory);
      },
      filename: (req, file, cb) => {
        try {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const finalFilename = uniqueSuffix + path.extname(file.originalname);
          cb(null, finalFilename);
        } catch (error) {
          cb(new InternalServerError("Failed to process file name"), "");
        }
      },
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      try {
        const allowedTypes = /jpeg|jpg|png|gif|bmp|tiff|webp|svg/;
        const isValidType = allowedTypes.test(file.mimetype) && 
                          allowedTypes.test(path.extname(file.originalname).toLowerCase());
        
        isValidType ? cb(null, true) : cb(new BadRequestError("Invalid image type"));
      } catch (error) {
        cb(new BadRequestError("Invalid image upload attempt"));
      }
    },
  });

  public getImage = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filename } = req.params;
      const filePath = path.join(this.uploadDirectory, filename);

      if (!fs.existsSync(filePath)) {
        return this.responseUtils.sendNotFoundResponse(res, "Image not found");
      }

      res.sendFile(filePath, (err) => {
        if (err) next(new InternalServerError("Failed to serve image file"));
      });
    } catch (error) {
      next(new InternalServerError("Image retrieval failed"));
    }
  };

  public deleteImage = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filename } = req.params;
      const filePath = path.join(this.uploadDirectory, filename);

      if (!fs.existsSync(filePath)) {
        return this.responseUtils.sendNotFoundResponse(res, "Image not found");
      }

      fs.unlink(filePath, (err) => {
        if (err) {
          next(new InternalServerError("Failed to delete image file"));
          return;
        }
        this.responseUtils.sendSuccessNoDataResponse(res, "Image deleted successfully");
      });
    } catch (error) {
      next(new InternalServerError("Image deletion failed"));
    }
  };
}