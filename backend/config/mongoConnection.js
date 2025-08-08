const mongoose = require('mongoose');

const dbURL = process.env.ATLAS_DB_URL; 

const connectionOptions = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 20000,
    maxPoolSize: 1,
    retryWrites: true,
    retryReads: true,
    connectTimeoutMS: 10000,
};

let cachedConnection = null;

async function connectDB() {
    if (!dbURL) {
        throw new Error('ATLAS_DB_URL environment variable is not set');
    }

    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    try {
        cachedConnection = await mongoose.connect(dbURL, connectionOptions);
        
        mongoose.connection.on('error', (err) => {
            cachedConnection = null;
        });
        
        mongoose.connection.on('disconnected', () => {
            cachedConnection = null;
        });

        return cachedConnection;
    } catch (error) {
        cachedConnection = null;
        throw error;
    }
}

module.exports = connectDB;