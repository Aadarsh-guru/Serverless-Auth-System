import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import connectToDatabase from "../../config/db.config";
import authService from "../../services/auth.service";
import otpService from "../../services/otp.service";
import User from "../../models/user.model";


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        await connectToDatabase();
        const { hash, otp, email } = await JSON.parse(event.body || '{}');
        if (!hash || !otp || !email) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'OTP hash and OTP and Email are required.',
                    success: false,
                }),
            };
        }
        const [hashedOtp, expires] = hash.split('.');
        if (Date.now() > parseInt(expires)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: 'OTP has expired.'
                }),
            };
        }
        const data = `${email}.${otp}.${expires}`
        const isValid = await otpService.verifyOTP(data, hashedOtp);
        if (!isValid) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: 'Invalid OTP.'
                }),
            };
        }
        let user = await User.findOne({ email: email });
        if (!user) {
            user = await User.create({ email: email });
        }
        const { accessToken, refreshToken } = await authService.generateTokens({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            isActivated: user.isActivated,
            createdAt: user.createdAt,
        });
        await User.findByIdAndUpdate(user._id, {
            refreshToken: refreshToken,
        }, { new: true });
        return {
            statusCode: 200,
            body: JSON.stringify({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    isActivated: user.isActivated,
                    createdAt: user.createdAt,
                },
                accessToken,
                refreshToken,
                success: true,
                message: 'OTP verified successfully',
            }),
        };
    } catch (error: any) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error while registering the user.',
                success: false,
                error: error.message,
            }),
        };
    }
};