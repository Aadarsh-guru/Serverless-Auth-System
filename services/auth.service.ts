import jwt from "jsonwebtoken";
import envConfig from "../config/env.config";

class AuthService {

    public async generateTokens(payload: any) {
        try {
            const accessToken = await jwt.sign(payload, envConfig.JWT_SECRET_ACCESS_TOKEN, {
                expiresIn: envConfig.ACCESS_TOKEN_EXPIRY,
            });
            const refreshToken = await jwt.sign(payload, envConfig.JWT_SECRET_REFRESH_TOKEN, {
                expiresIn: envConfig.REFRESH_TOKEN_EXPIRY,
            });
            return { accessToken, refreshToken };
        } catch (error) {
            throw error;
        }
    };

    public async verifyAccessToken(token: string) {
        try {
            return await jwt.verify(token, envConfig.JWT_SECRET_ACCESS_TOKEN);
        } catch (error) {
            throw error;
        }
    };

    public async verifyRefreshToken(token: string) {
        try {
            return await jwt.verify(token, envConfig.JWT_SECRET_REFRESH_TOKEN);
        } catch (error) {
            throw error;
        }
    };

};

export default new AuthService();