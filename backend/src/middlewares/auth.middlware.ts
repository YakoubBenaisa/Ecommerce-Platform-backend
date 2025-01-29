import { Request, Response, NextFunction } from "express";
import { container } from "../config/container";
import ResponseUtils from "../utils/response.utils";
import JwtUtils from "../utils/jwt.utils";
import { RequestWithUser } from "../types/types";

const jwt = container.resolve(JwtUtils);
const responseUtils = container.resolve(ResponseUtils);

export default async function authMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      responseUtils.sendUnauthorizedResponse(res);
      return;
    }

    const user = await jwt.getUserFromToken(token);

    

    req.user = user; 
    next(); 
  } catch (error: any) {
    responseUtils.sendErrorResponse(res, error.message); // Handle the error
  }
}
