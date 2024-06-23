import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import otpService from '../../services/otp.service';


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { email } = await JSON.parse(event.body || '{}');
        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Email is required.',
                    success: false,
                }),
            };
        }
        const otp = otpService.generateOTP();
        const expires = Date.now() + 1000 * 60 * 5; // 5 min expiration
        const data = `${email}.${otp}.${expires}`
        const hashedOtp = await otpService.hashOTP(data);
        await otpService.sendOTP(email, otp);
        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'OTP sent successfully',
                success: true,
                hash: `${hashedOtp}.${expires}`,
                email,
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
