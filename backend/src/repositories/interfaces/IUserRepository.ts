import { PrismaClient, User } from "@prisma/client";
import { UserWithStore } from "../../types/types";

export default interface IUserRepository {


  findById(id:string):Promise<UserWithStore | null>;
  
  createUser(user: {
    email: string;
    password_hash: string;
    username: string;
  }): Promise<User>;

  findByEmail(
    email: string
  ): Promise<UserWithStore | null>;
}
