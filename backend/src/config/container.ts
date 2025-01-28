import "reflect-metadata"; // Required for tsyringe to work
import { container } from "tsyringe";
import IUserService from "../services/Interfaces/IUserService";
import { UserService } from "../services/user.service";
import IUserRepository from "../repositories/interfaces/IUserRepository";
import UserRepository from "../repositories/user.repository";
import ResponseUtils from "../utils/response.utils";
import JwtUtils from "../utils/jwt.utils";
import db from "./db";
import IRefreshTokenRepository from "../repositories/interfaces/IRefreshTokenInterface";
import  RefreshTokenRepository  from "../repositories/refreshToken.repository";

container.register<IUserRepository>("IUserRepository", {
  useClass: UserRepository,
});

container.register<IRefreshTokenRepository>("IRefreshTokenRepository", {
  useClass: RefreshTokenRepository,
});
container.register<IUserService>("IUserService", {
  useClass: UserService,
});

container.register("responseUtils", {
  useClass: ResponseUtils,
});

container.register("jwt", {
  useClass: JwtUtils,
});

container.register("db", { useClass: db });

export { container };
