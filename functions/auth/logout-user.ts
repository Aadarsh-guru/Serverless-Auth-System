import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { authMiddleware } from '../../middlewares/auth.middleware';
import connectToDatabase from '../../config/db.config';
import User from '../../models/user.model';


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        await connectToDatabase();
        const response = await authMiddleware(event);
        if (!response.success) {
            return {
                statusCode: 401,
                body: JSON.stringify({
                    success: false,
                    message: response.message,
                }),
            }
        };
        const userId = response.user?.id;
        await User.findByIdAndUpdate(userId, {
            refreshToken: null,
        }, { new: true });
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Logged out successfully',
            }),
        }
    } catch (error: any) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error while logging out the user.',
                success: false,
                error: error.message,
            }),
        };
    }
};
