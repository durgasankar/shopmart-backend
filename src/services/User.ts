import bcrypt from 'bcrypt';
import User, { UserAttributes } from "../models/User";
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
            return fetchedUser;
        }
        return null;
    }

    public registerNewUser = async (userData: UserAttributes): Promise<Omit<UserAttributes, 'password'>> => {
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
        // return user infor without password
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }
}