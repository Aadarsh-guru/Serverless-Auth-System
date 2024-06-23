import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name?: string;
    image?: string;
    email: string;
    isActivated: boolean;
    refreshToken?: string;
    createdAt: Date;
};

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isActivated: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
    },
}, { timestamps: true });

const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', userSchema, 'users');

export default User;