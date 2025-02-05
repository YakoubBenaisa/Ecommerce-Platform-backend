import { TAuthToken } from "../../types/types";

export default interface IUserService {
  register(
    email: string,
    password: string,
    username: string,
  ): Promise<TAuthToken | null>;
  login(email: string, password: string): Promise<TAuthToken | null>;
  refreshTokens(refreshToken: string): Promise<TAuthToken | null>;
  logout(refreshToken: string): Promise<void>;
}
