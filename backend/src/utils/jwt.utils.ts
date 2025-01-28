import jwt from "jsonwebtoken";
import { injectable, singleton } from "tsyringe";

@singleton()
@injectable()
export default class JwtUtils {
  private readonly JWT_SECRET: string = process.env.JWT_SECRET ?? "";
  private readonly JWT_EXPIRATION: string = process.env.JWT_EXPIRATION || "1d";
  private readonly REFRESH_TOKEN_SECRET: string =
    process.env.REFRESH_TOKEN_SECRET ?? "";
  private readonly REFRESH_TOKEN_EXPIRY: string =
    process.env.REFRESH_TOKEN_EXPIRY || "15d";

  generateAccessToken(
    userId: string,
    email: string,
    storeId: string | null,
    username: string
  ): string {
    return jwt.sign({ userId, email, storeId, username }, this.JWT_SECRET, {
      expiresIn: "1d",
    });
  }

  generateRefreshToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, this.REFRESH_TOKEN_SECRET, {
      expiresIn: "15d",
    });
  }

  verifyAccessToken(token: string): boolean {
    try {
      jwt.verify(token, this.JWT_SECRET);
      return true;
    } catch {
      return false;
    }
  }

  verifyRefreshToken(token: string): boolean {
    try {
      jwt.verify(token, this.REFRESH_TOKEN_SECRET);
      return true;
    } catch {
      return false;
    }
  }

  getUserIdFromToken(token: string): string {
    const decoded = jwt.verify(token, this.JWT_SECRET) as {
      userId: string;
      email: string;
      storeId: string | null;
      username: string;
    };
    return decoded.userId;
  }

  getUserFromToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as {
        userId: string;
        email: string;
        storeId: string | null;
        username: string;
      };
      return decoded;
    } catch {
      throw new Error("Invalid token");
    }
  }

  
  getUserFromRefreshToken(token: string): string {
    const decoded = jwt.verify(token, this.REFRESH_TOKEN_SECRET) as {
      userId: string;
      email: string;
    };
    return decoded.userId;
  }
}
