import bcrypt from 'bcrypt';
import User, { UserAttributes } from "../models/User";
import { RegistrationUserResponse } from '../dtos/registration-user';
import { LoginUserResponse } from '../dtos/login-user';
import { generateToken } from '../configs/jwt';
import { logger } from '../configs/winston-logger';
export class UserServices {
    HASH_SALT_ROUND: number = 10;

    private getUserEmailByMobileNumber = async (mobileNumber: string): Promise<string | null> => {
        const fetchedUser = await User.findOne({ where: { mobileNumber } });
        if (fetchedUser) {
            return fetchedUser.get('email');
        }
        return null;
    }

    private getUserInfo = async (email: string): Promise<User | null> => {
        const fetchedUser = await User.findOne({ where: { email } });
        if (fetchedUser) {
            return fetchedUser.toJSON();
        }
        return null;
    }

    private isValidPassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    public registerNewUser = async (userData: UserAttributes): Promise<RegistrationUserResponse> => {
        // duplicate user entry check
        const fetchedUser = await this.getUserInfo(userData.email);
        if (fetchedUser) {
            throw new Error('User with this email already exist.');
        }
        // duplicate mobile number entry
        const mappedEmail = await this.getUserEmailByMobileNumber(userData.mobileNumber);
        if (mappedEmail) {
            throw new Error(`Duplicate number. Entry found for ${mappedEmail}`);
        }
        // new User
        const hashedPassword: string = await bcrypt.hash(userData.password, this.HASH_SALT_ROUND);
        const newUser = await User.create({
            ...userData,
            password: hashedPassword
        })
        const { firstName, lastName, email } = newUser.toJSON();
        return { fullname: `${firstName} ${lastName}`, email };
    }

    public loginUser = async (email: string, userPassword: string): Promise<LoginUserResponse> => {
        const fetchedUser = await this.getUserInfo(email);
        // chk user exist
        if (!fetchedUser) {
            throw new Error('User doesnot exist.');
        }
        // check password match
        const hasMatched = await this.isValidPassword(userPassword, fetchedUser.password);
        if (!hasMatched) {
            throw new Error('Invalid credentials');
        }
        // create desired user response
        const { password, id, createdAt, updatedAt, ...user } = fetchedUser;
        const token: string = generateToken({ userId: fetchedUser.id, email: fetchedUser.email });
        return { ...user, token };
    }
}