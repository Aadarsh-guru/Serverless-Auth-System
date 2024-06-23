import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import connectToDatabase from "../../config/db.config";
import authService from '../../services/auth.service';
import User from "../../models/user.model";


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        await connectToDatabase();
        const { refreshToken } = await JSON.parse(event.body || '{}');
        if (!refreshToken) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Feild `refreshToken` is required.',
                    success: false,
                }),
            };
        }
        const userData = await authService.verifyRefreshToken(refreshToken) as { id: string };
        const userId = userData.id;
        const user = await User.findById(userId);
        if (!user || user?.refreshToken !== refreshToken) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    success: false,
                    message: 'Invalid refresh token.',
                }),
            }
        };
        const { accessToken, refreshToken: newRefreshToken } = await authService.generateTokens({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            isActivated: user.isActivated,
            createdAt: user.createdAt,
        });
        await User.findByIdAndUpdate(userId, {
            refreshToken: newRefreshToken,
        }, { new: true });
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                user: {
                    id: user?.id,
                    email: user?.email,
                    name: user?.name,
                    image: user?.image,
                    isActivated: user?.isActivated,
                    createdAt: user?.createdAt,
                },
                accessToken,
                refreshToken: newRefreshToken,
                message: 'Token refreshed successfully',
            }),
        };
    } catch (error: any) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error while refreshing tokens.',
                success: false,
                error: error.message,
            }),
        };
    }
};