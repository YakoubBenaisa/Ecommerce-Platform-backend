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
import ICategoryService from "../services/Interfaces/ICategoryService";
import CategoryService from "../services/category.service";
import ICategoryRepository from "../repositories/interfaces/ICategoryRepository";
import CategoryRepository from "../repositories/category.repository";
import ChargiliAccountRepository from "../repositories/chargiliAccount.repository";
import ChargiliAccountService from "../services/chargiliAccount.service";
import IChargiliAccountService from "../services/Interfaces/IChargiliAccountService";
import IChargiliAccountRepository from "../repositories/interfaces/IChargiliAccountRepository";



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

//_________category module _____________
// Register the repository
container.register<ICategoryRepository>("ICategoryRepository", {
  useClass: CategoryRepository,
});

// Register the service
container.register<ICategoryService>("ICategoryService", {
  useClass: CategoryService,
});

//_________Chargili Account module _____________
container.register<IChargiliAccountRepository>("IChargiliAccountRepository", {
  useClass: ChargiliAccountRepository,
});
container.register<IChargiliAccountService>("IChargiliAccountService", {
  useClass: ChargiliAccountService,
});



export { container };
