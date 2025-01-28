import { AuthToken } from "../../types/types";

export default interface IUserService {
  register(email: string, password: string , username:string): Promise<AuthToken | null>;
  login(email: string, password: string):  Promise<AuthToken | null>;
  refreshTokens(refreshToken: string): Promise<AuthToken | null>;
  logout(refreshToken: string): Promise<void>;
}


