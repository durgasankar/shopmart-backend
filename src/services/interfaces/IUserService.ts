import { LoginUserResponse } from "../../dtos/login-user";
import { RegistrationUserResponse } from "../../dtos/registration-user";
import { UserAttributes } from "../../models/User";

export interface IUserService {
    registerNewUser(userData: UserAttributes): Promise<RegistrationUserResponse>;

    loginUser(
        email: string,
        userPassword: string
    ): Promise<LoginUserResponse>;
}