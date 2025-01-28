
import IUserRepository from "./interfaces/IUserRepository";
import { container, injectable } from "tsyringe";
import db from "../config/db";

const prismaInstance = container.resolve(db);
const prisma = prismaInstance.getClient();

@injectable()
export default class UserRepository implements IUserRepository {
  async findById(id: string) {
    const user = await prisma.user.findUnique({
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
    const user = await prisma.user.create({
      data: userData,
    });
    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
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
