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
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        store: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundError("User");

    return user;
  }

  async createUser(userData: {
    email: string;
    password_hash: string;
    username: string;
  }) {
    const user = await this.prisma.user.create({
      data: userData,
    });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        store: {
          select: {
            id: true,
          },
        },
      },
    });

   
    return user;
  }
}
