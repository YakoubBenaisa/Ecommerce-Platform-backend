import bcrypt from "bcryptjs";
import IUserService from "./Interfaces/IUserService";
import IUserRepository from "../repositories/interfaces/IUserRepository";
import IRefreshTokenRepository from "../repositories/interfaces/IRefreshTokenInterface"; // Add a repository for the RefreshToken
import { inject, injectable } from "tsyringe";
import JwtUtils from "../utils/jwt.utils";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IRefreshTokenRepository")
    private refreshTokenRepository: IRefreshTokenRepository,
    @inject("jwt") private jwt: JwtUtils
  ) { }

  async register(email: string, password: string, username: string) {

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new Error("User already exists");

    const password_hash = await bcrypt.hash(password, 10);

    const user = await this.userRepository.createUser({
      email,
      password_hash,
      username,
    });

    console.log(user);

    const accessToken = this.jwt.generateAccessToken(
      user.id,
      user.email,
      null,
      user.username
    );
    const refreshToken = this.jwt.generateRefreshToken(user.id, user.email);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 15);

     await this.refreshTokenRepository.create(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) throw new Error("Invalid Credentials");

    const storeId = user.store?.id || null;
    const accessToken = this.jwt.generateAccessToken(
      user.id,
      user.email,
      storeId,
      user.username
    );
    const refreshToken = this.jwt.generateRefreshToken(user.id, user.email);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 15);

    await this.refreshTokenRepository.create(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const userId = this.jwt.getUserFromRefreshToken(refreshToken);

      const storedRefreshToken = await this.refreshTokenRepository.findByUserId(
        userId
      );

      if (
        !storedRefreshToken ||
        storedRefreshToken.token !== refreshToken ||
        storedRefreshToken.expires_at < new Date()
      ) {
        throw new Error("Invalid refresh token ");
      }

      const user = await this.userRepository.findById(userId);
      if (!user) throw new Error("User not found");

      const storeId = user.store?.id || null;
      const newAccessToken = this.jwt.generateAccessToken(
        user.id,
        user.email,
        storeId,
        user.username
      );
      const newRefreshToken = this.jwt.generateRefreshToken(
        user.id,
        user.email
      );

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 15);

      await this.refreshTokenRepository.updateByUserId(
        user.id,
        newRefreshToken,
        expiresAt
      );

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.log(error);
      throw new Error("Invalid refresh token ");
    }
  }

  async logout(token: string) {
    try {
      const userId = this.jwt.getUserIdFromToken(token);

      await this.refreshTokenRepository.deleteByUserId(userId);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
