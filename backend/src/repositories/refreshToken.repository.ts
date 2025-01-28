import { PrismaClient } from "@prisma/client";
import IRefreshTokenRepository from "./interfaces/IRefreshTokenInterface";
import { inject, injectable } from "tsyringe";
import { container } from "tsyringe";
import db from "../config/db";

const prismaInstance = container.resolve(db);
const prisma = prismaInstance.getClient();

@injectable()
export default class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(user_id: string, token: string, expires_at: Date) {
    return await prisma.refreshToken.upsert({
      where: {
        user_id, // Unique identifier to check for existing record
      },
      update: {
        // Fields to update if record exists
        token,
        expires_at,
      },
      create: {
        // Fields to create if record doesn't exist
        user_id,
        token,
        expires_at,
      },
    });
  }

  async findByUserId(user_id: string) {
    return await prisma.refreshToken.findUnique({
      where: { user_id },
    });
  }

  async deleteByUserId(user_id: string) {
    return await prisma.refreshToken.delete({
      where: { user_id },
    });
  }

  async updateByUserId(user_id: string, newToken: string, newExpiresAt: Date) {
    return await prisma.refreshToken.update({
      where: { user_id },
      data: {
        token: newToken,
        expires_at: newExpiresAt,
      },
    });
  }
}
