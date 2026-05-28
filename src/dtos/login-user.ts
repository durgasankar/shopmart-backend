import { UserAttributes } from "../models/User";

export interface LoginUserResponse extends Omit<UserAttributes, "password" | "id" | "updatedAt"> {
    token: string;
}