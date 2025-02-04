import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { container } from "../config/container";
import ResponseUtils from "../utils/response.utils";

const responseUtils = container.resolve(ResponseUtils);


export const validateRequest =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
    
     
     

      schema.parse(req.body); 
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        // Map the Zod errors to a custom error structure with 'field' and 'message'
        const formattedErrors = error.errors.map((err: any) => ({
          field: err.path.join("."), // Join the path if it's a nested field
          message: err.message,
        }));

        // Send structured validation error response with custom format
        responseUtils.sendValidationError(
          res,
          "Validation failed",
          formattedErrors 
        );
      } else {
        next(error); 
      }
    }
  };
