import {  RefreshToken } from "@prisma/client";

export default interface IRefreshTokenRepository {
  
  create(user_id: string, token: string, expires_at: Date): Promise<RefreshToken>;

  
  findByUserId(user_id: string): Promise<RefreshToken | null>;

  
  deleteByUserId(user_id: string): Promise<RefreshToken>;

  
  updateByUserId(user_id: string, newToken: string, newExpiresAt: Date): Promise<RefreshToken>;
}
