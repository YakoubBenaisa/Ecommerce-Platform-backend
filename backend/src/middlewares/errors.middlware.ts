import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { injectable, inject, singleton } from 'tsyringe';
import ResponseUtils from '../utils/response.utils';
import HttpStatusCode from '../utils/HttpStatusCode';
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  AppError
} from '../types/errors';

@singleton()
@injectable()
export default class GlobalErrorHandler {
  constructor(@inject(ResponseUtils) private responseUtils: ResponseUtils) {}

  handle(error: Error, req: Request, res: Response, next: NextFunction) {
    console.error(`[${new Date().toISOString()}] Error:`, error);
    if (res.headersSent) return next(error);

    

    
   

    // Handle custom error classes
    switch (true) {
      case error instanceof InternalServerError:
        return this.responseUtils.sendErrorResponse(res, error.message);
      
      case error instanceof BadRequestError:
        return this.responseUtils.sendBadRequestResponse(res, error.message);
      
      case error instanceof UnauthorizedError:
        return this.responseUtils.sendUnauthorizedResponse(res, error.message);
      
      case error instanceof ForbiddenError:
        return this.responseUtils.sendForbiddenResponse(res, error.message);
      
      case error instanceof ConflictError:
        return this.responseUtils.sendErrorResponse(
          res, 
          error.message, 
          HttpStatusCode.CONFLICT
        );
      
      case error instanceof NotFoundError:
        return this.responseUtils.sendNotFoundResponse(res, error.message);
      
      case error instanceof AppError:
        return this.handleAppError(error, res);
      
      default:
        return this.responseUtils.sendErrorResponse(
          res,
          'Internal server error',
          HttpStatusCode.INTERNAL_SERVER_ERROR
        );
    }
  }



 

  private handleAppError(error: AppError, res: Response): void {
    this.responseUtils.sendErrorResponse(
      res,
      error.message,
      error.statusCode
    );
  }
}