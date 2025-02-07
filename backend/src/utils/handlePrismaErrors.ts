// src/utils/handlePrismaError.ts
import { Prisma } from "@prisma/client";
import { NotFoundError, InternalServerError, ConflictError } from "../types/errors";

export  function handlePrismaError(
  error: any,
  context?: { resource?: string; id?: string },
) {
 
    // Prisma error code P2025 indicates that a record was not found.
    if (error.code === "P2002") {
      throw new ConflictError(
        `${context?.resource || "Record"} already exists`
      );
    }

    // Handle record not found (P2025)
    if (error.code === "P2025") {
      throw new NotFoundError(context?.resource || "Record", context?.id);
    }
  
    console.error(`Unexpected error: ${error}`);
    throw new InternalServerError("Unexpected error");
  }


export default handlePrismaError;
