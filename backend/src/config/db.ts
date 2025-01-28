import { PrismaClient } from "@prisma/client";
import { injectable, singleton } from "tsyringe";

@singleton()
@injectable()
export default class PrismaService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }
}
