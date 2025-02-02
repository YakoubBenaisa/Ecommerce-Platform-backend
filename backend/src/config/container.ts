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
import RefreshTokenRepository from "../repositories/refreshToken.repository";
import IStoreService from "../services/Interfaces/IStoreService";
import StoreService from "../services/store.service";
import IStoreRepository from "../repositories/interfaces/IStoreRepository";
import StoreRepository from "../repositories/store.repository";
import IProductService from "../services/Interfaces/IProductService";
import ProductService from "../services/product.service";
import IProductRepository from "../repositories/interfaces/IProductRepository";
import ProductRepository from "../repositories/product.repository";
import ImageUtils from "../utils/images.utils";
import  GlobalErrorHandler  from "../middlewares/errors.middlware";



//________________utils_______________________

container.register("imageUtils", {
  useClass: ImageUtils,
});

container.register("responseUtils", {
  useClass: ResponseUtils,
});

container.register("jwt", {
  useClass: JwtUtils,
});

container.register("db", { useClass: db });


// Register services
container.register("errorsHandler",{useClass: GlobalErrorHandler } );




//_____________user module _______________________
container.register<IUserRepository>("IUserRepository", {
  useClass: UserRepository,
});

container.register<IRefreshTokenRepository>("IRefreshTokenRepository", {
  useClass: RefreshTokenRepository,
});
container.register<IUserService>("IUserService", {
  useClass: UserService,
});

// _______________store module ____________________

container.register<IStoreRepository>("IStoreRepository", {
  useClass: StoreRepository,
});

container.register<IStoreService>("IStoreService", {
  useClass: StoreService,
});

//________________product module _____________________
container.register<IProductRepository>("IProductRepository", {
  useClass: ProductRepository,
});

container.register<IProductService>("IProductService", {
  useClass: ProductService,
});



export { container };
