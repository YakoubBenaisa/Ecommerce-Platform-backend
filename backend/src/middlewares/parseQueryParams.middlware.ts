import { Request, Response, NextFunction } from "express";
import { TFindInput } from "../types/types"; // Import the correct type

const parseQueryParams = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = "1", limit = "10", search, sortBy = "created_at", order = "desc" } = req.query;

    // ✅ Convert and sanitize query params
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    req.queryParams = {
      page: pageNum, // Ensure valid number, fallback to 1
      limit: limitNum, // Ensure valid number, fallback to 10
      skip, // ✅ Add skip for pagination
      search: search ? String(search) : undefined,
      sortBy: sortBy ? String(sortBy) : "created_at",
      order: order === "asc" || order === "desc" ? order : "desc", // Ensure valid sorting order
    } as TFindInput;

    next();
  } catch (error) {
    next(error);
  }
};

export default parseQueryParams;
