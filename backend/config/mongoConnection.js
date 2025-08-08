const mongoose = require('mongoose');

const dbURL = process.env.ATLAS_DB_URL; 

console.log('Database URL check:', dbURL ? 'URL provided' : 'URL missing');

// Connection options optimized for serverless
const connectionOptions = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000, // Reduced to 10 seconds for serverless
    socketTimeoutMS: 20000, // Reduced to 20 seconds
    maxPoolSize: 1, // Reduced for serverless
    retryWrites: true,
    retryReads: true,
    connectTimeoutMS: 10000, // Reduced to 10 seconds
};

// Global connection promise to reuse connections
let cachedConnection = null;

async function connectDB() {
    if (!dbURL) {
        throw new Error('ATLAS_DB_URL environment variable is not set');
    }

    // If we have a cached connection and it's connected, return it
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('Using existing database connection');
        return cachedConnection;
    }

    try {
        console.log('Creating new database connection...');
        cachedConnection = await mongoose.connect(dbURL, connectionOptions);
        
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB Atlas');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected from MongoDB Atlas');
            cachedConnection = null;
        });

        return cachedConnection;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        cachedConnection = null;
        throw error;
    }
}

module.exports = connectDB;