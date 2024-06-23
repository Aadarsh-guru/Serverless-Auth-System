import { APIGatewayProxyEvent } from 'aws-lambda';
import { IUser } from '../models/user.model';
import authService from '../services/auth.service';


const authMiddleware = async (event: APIGatewayProxyEvent) => {
    const token = event.headers.Authorization?.replace('Bearer ', '') || "";
    try {
        const user = await authService.verifyAccessToken(token) as IUser;
        return {
            success: true,
            user,
        };
    } catch (error: any) {
        console.log("Failed to verify access token");
        return {
            success: false,
            message: error.message,
        }
    }
};


export {
    authMiddleware,
};

