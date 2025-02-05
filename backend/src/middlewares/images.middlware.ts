import { container } from "../config/container";
import ImageUtils from "../utils/images.utils";
import { Request, Response, NextFunction } from "express";

const imagesMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const imageHandler = container.resolve(ImageUtils);
  try {
    // Use Multer's middleware to process the file uploads.
    imageHandler.upload.array("images", 5)(req, res, (err: any) => {
      if (err) {
        throw new Error("failed to upload images");
      }

      // Check if files were uploaded
      if (req.files) {
        // Type assertion: req.files is an array of Multer File objects.
        const files = req.files as Express.Multer.File[];

        // Map the uploaded file objects to their filenames and attach to req.body.images.
        req.body.images = files.map((file) => file.filename);
      }

      // Proceed to the next middleware or route handler.
      next();
    });
  } catch (err) {
    throw new Error("failed to upload images");
  }
};

export default imagesMiddleware;
