import { User } from "@prisma/client";



// Auth types

export interface UserWithStore extends User {
  store: { id: string } | null;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

