import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    firstName: string,
    lastName: string,
    email: string,
    mobileNumber: number,
    password: string,
    gender: boolean,
    createdAt: Date,
    updatedAt: Date,
}

const userSchema: Schema<IUser> = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        mobileNumber: { type: Number, unique: true },
        password: { type: String, required: true },
        gender: { type: Boolean },
    },
    {
        timestamps: true
    }
)

const User = mongoose.model<IUser>('user', userSchema);

export default User;