import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { injectable, singleton , inject } from "tsyringe";
import ResponseUtils from "./response.utils"; // Adjust the import path as needed

@injectable()
@singleton()
export default class ImageHandler {
  private uploadDirectory = path.join(__dirname, "../../../", "uploads");

  constructor(@inject("responseUtils") private responseUtils: ResponseUtils) {
    console.log("ImageHandler");
    try {
      // Ensure the upload directory exists
      if (!fs.existsSync(this.uploadDirectory)) {
        fs.mkdirSync(this.uploadDirectory, { recursive: true });
      }
    } catch (error) {
      console.error("Error ensuring upload directory exists:", error);
      // Depending on your application's requirements, you can either throw the error or handle it gracefully.
      throw error;
    }
  }

  // Configure Multer for file uploads with error handling in storage and file filtering
   // Refactor the upload method to return the multer instance
   public upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDirectory);
      },
      filename: (req, file, cb) => {
        try {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const finalFilename = uniqueSuffix + path.extname(file.originalname);
          console.log(`File uploaded: ${finalFilename}`);
          cb(null, finalFilename);
        } catch (error) {
          cb(error as Error, "");
        }
      },
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, // Limit file size to 20 MB
    fileFilter: (req, file, cb) => {
      try {
        console.log(`Uploading file: ${file.originalname}, MIME type: ${file.mimetype}`);
        const allowedTypes = /jpeg|jpg|png|gif|bmp|tiff|webp|svg/;
        const mimeType = allowedTypes.test(file.mimetype);
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimeType && extName) {
          return cb(null, true);
        }
        cb(new Error("Accept images only"));
      } catch (error) {
        cb(new Error("Accept images only"));
      }
    },
  });

 
  // Retrieve an image by filename with error handling
  public getImage = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filename } = req.params;
      const filePath = path.join(this.uploadDirectory, filename);

      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      } else {
        // Use ResponseUtils to send a standardized not found response
        return this.responseUtils.sendNotFoundResponse(res, "Image not found");
      }
    } catch (error) {
      next(error);
    }
  };

  // Delete an image by filename with error handling
  public deleteImage = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filename } = req.params;
      const filePath = path.join(this.uploadDirectory, filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        // Use ResponseUtils to send a standardized success response without data
        return this.responseUtils.sendSuccessNoDataResponse(res, "Image deleted successfully");
      } else {
        return this.responseUtils.sendNotFoundResponse(res, "Image not found");
      }
    } catch (error) {
      next(error);
    }
  };
}
