import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { authMiddleware } from '../../middlewares/auth.middleware';
import connectToDatabase from "../../config/db.config";
import User from "../../models/user.model";


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        await connectToDatabase();
        const { name, image } = await JSON.parse(event.body || '{}');
        if (!name) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Name is required.',
                    success: false,
                }),
            };
        }
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
        const user = await User.findByIdAndUpdate(userId, {
            name: name,
            image: image,
            isActivated: true,
        }, { new: true });
        return {
            statusCode: 200,
            body: JSON.stringify({
                user: {
                    id: user?.id,
                    email: user?.email,
                    name: user?.name,
                    image: user?.image,
                    isActivated: user?.isActivated,
                    createdAt: user?.createdAt,
                },
                success: true,
                message: 'Account activated successfully',
            }),
        };
    } catch (error: any) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error while activating account.',
                success: false,
                error: error.message,
            }),
        };
    }
};