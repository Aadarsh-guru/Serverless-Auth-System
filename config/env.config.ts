

const envConfig = {
    MONGODB_URL: process.env.MONGODB_URL as string,
    HASH_SECRET: process.env.HASH_SECRET as string,
    AWS_REGION: process.env.AWS_REGION as string,
    JWT_SECRET_ACCESS_TOKEN: process.env.JWT_SECRET_ACCESS_TOKEN as string,
    JWT_SECRET_REFRESH_TOKEN: process.env.JWT_SECRET_REFRESH_TOKEN as string,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as string,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as string,
    ADMIN_EMAIL_ID: process.env.ADMIN_EMAIL_ID as string,
    AWS_ACCESS_KEY: process.env.ACCESS_KEY as string,
    AWS_SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY as string,
};

export default Object.freeze(envConfig);