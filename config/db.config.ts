import mongoose from 'mongoose';
import envConfig from './env.config';

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function connectToDatabase(): Promise<void> {
    if (connection.isConnected) {
        console.log('Already connected to the database');
        return;
    }
    try {
        const db = await mongoose.connect(envConfig.MONGODB_URL);
        connection.isConnected = db.connections[0].readyState;
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

export default connectToDatabase;