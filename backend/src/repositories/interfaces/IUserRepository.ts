import { PrismaClient, User } from "@prisma/client";
import { TUserWithStore } from "../../types/types";

export default interface IUserRepository {


  findById(id:string):Promise<TUserWithStore | null>;
  
  createUser(user: {
    email: string;
    password_hash: string;
    username: string;
  }): Promise<User>;

  findByEmail(
    email: string
  ): Promise<TUserWithStore | null>;
}
