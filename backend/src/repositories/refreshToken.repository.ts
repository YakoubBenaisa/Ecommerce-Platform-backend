import { PrismaClient } from "@prisma/client";
import IRefreshTokenRepository from "./interfaces/IRefreshTokenInterface";
import { inject, injectable } from "tsyringe";
import { container } from "tsyringe";
import db from "../config/db";


@injectable()
export default class RefreshTokenRepository implements IRefreshTokenRepository {

  private prisma: PrismaClient;

  constructor(@inject("db") private prismaService: db) {
    this.prisma = prismaService.getClient();
  }
  async create(user_id: string, token: string, expires_at: Date) {
    return  this.prisma.refreshToken.upsert({
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
    return  this.prisma.refreshToken.findUnique({
      where: { user_id },
    });
  }

  async deleteByUserId(user_id: string) {
    return  this.prisma.refreshToken.delete({
      where: { user_id },
    });
  }

  async updateByUserId(user_id: string, newToken: string, newExpiresAt: Date) {
    return  this.prisma.refreshToken.update({
      where: { user_id },
      data: {
        token: newToken,
        expires_at: newExpiresAt,
      },
    });
  }
}
