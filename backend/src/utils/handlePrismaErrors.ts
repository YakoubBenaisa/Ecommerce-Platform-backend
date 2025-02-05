// src/utils/handlePrismaError.ts
import { Prisma } from "@prisma/client";
import { NotFoundError, InternalServerError } from "../types/errors";

export async function handlePrismaError(
  error: unknown,
  context?: { resource?: string; id?: string },
): Promise<never> {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Prisma error code P2025 indicates that a record was not found.
    if (error.code === "P2025") {
      throw new NotFoundError(context?.resource || "Record", context?.id);
    } else {
      console.error(`Prisma error: ${error.message}`);
      throw new InternalServerError(error.message);
    }
  } else {
    console.error(`Unexpected error: ${error}`);
    throw new InternalServerError("Unexpected error");
  }
}

export default handlePrismaError;
