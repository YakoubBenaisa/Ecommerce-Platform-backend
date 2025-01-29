
import IUserRepository from "./interfaces/IUserRepository";
import { container, inject, injectable } from "tsyringe";
import db from "../config/db";
import { PrismaClient } from "@prisma/client";


@injectable()
export default class UserRepository implements IUserRepository {

  constructor(@inject("db") private prisma:PrismaClient){}
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
