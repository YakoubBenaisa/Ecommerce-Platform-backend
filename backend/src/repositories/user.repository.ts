import IUserRepository from "./interfaces/IUserRepository";
import { container, inject, injectable } from "tsyringe";
import db from "../config/db";
import { PrismaClient } from "@prisma/client";
import { NotFoundError } from "../types/errors";

@injectable()
export default class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor(@inject("db") private prismaService: db) {
    this.prisma = prismaService.getClient();
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        store: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async createUser(userData: {
    email: string;
    password_hash: string;
    username: string;
  }) {
    return this.prisma.user.create({
      data: userData,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        store: {
          select: {
            id: true,
          },
        },
      },
    });
  }
}
