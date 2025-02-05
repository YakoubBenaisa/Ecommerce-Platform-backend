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
  ConflictError,
} from "../types/errors"; // Adjust import path
import { JsonArray, JsonValue } from "@prisma/client/runtime/library";

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
        // In this example, the destination is set synchronously.
        // If you needed async work here, you could also wrap it in an IIFE.
        cb(null, this.uploadDirectory);
      },
      filename: (req, file, cb) => {
        // Wrap your async code in an IIFE so you can use await if needed.
        (async () => {
          try {
            // Example async code: in this case, it's synchronous logic,
            // but you could await other asynchronous operations here.
            const uniqueSuffix =
              Date.now() + "-" + Math.round(Math.random() * 1e9);
            const finalFilename =
              uniqueSuffix + path.extname(file.originalname);
            cb(null, finalFilename);
          } catch (error) {
            cb(new InternalServerError("Failed to process file name"), "");
          }
        })();
      },
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      // Wrap file filtering logic in an IIFE to use async/await if necessary.
      (async () => {
        try {
          const allowedTypes = /jpeg|jpg|png|gif|bmp|tiff|webp|svg/;
          const isValidType =
            allowedTypes.test(file.mimetype) &&
            allowedTypes.test(path.extname(file.originalname).toLowerCase());

          isValidType
            ? cb(null, true)
            : cb(new BadRequestError("Invalid image type"));
        } catch (error) {
          cb(new BadRequestError("Invalid image upload attempt"));
        }
      })();
    },
  });

  public getImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const imageName: string = req.params.imageName;
      if (!imageName) throw new BadRequestError("No image provided");

      const filePath = path.join(this.uploadDirectory, imageName);

      try {
        await fs.promises.access(filePath);
      } catch (err: any) {
        throw new NotFoundError("Image not found");
      }

      // Send the image file as response
      res.sendFile(filePath, (err) => {
        if (err) next(new InternalServerError("Failed to serve image file"));
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteImage = async (images: JsonValue | null) => {
    if (!Array.isArray(images) || images.length === 0) return; // Skip if images is null or empty

    // Filter the images to only include string values
    const imageStrings = images.filter(
      (image): image is string => typeof image === "string",
    );

    try {
      await Promise.all(
        imageStrings.map(async (image) => {
          const filePath = path.join(this.uploadDirectory, image);

          try {
            await fs.promises.access(filePath); // Check if file exists asynchronously
            await fs.promises.unlink(filePath); // Delete file asynchronously
          } catch (err: any) {
            if (err.code !== "ENOENT") {
              // ENOENT means file doesn't exist, ignore that case
              throw new InternalServerError(`Failed to delete image: ${image}`);
            }
          }
        }),
      );
    } catch (error) {
      throw new InternalServerError("Image deletion failed");
    }
  };
}
