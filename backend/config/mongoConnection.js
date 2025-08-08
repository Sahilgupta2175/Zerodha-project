const mongoose = require('mongoose');

const dbURL = process.env.ATLAS_DB_URL; 

// Connection options to handle timeouts and improve reliability
const connectionOptions = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
    maxPoolSize: 10,
    retryWrites: true,
    retryReads: true,
    connectTimeoutMS: 30000, // 30 seconds
};

main().then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.log('MongoDB connection error:', err);
    process.exit(1);
});

async function main() {
    try {
        await mongoose.connect(dbURL, connectionOptions);
        
        // Handle connection events
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB Atlas');
        });
        
        mongoose.connection.on('error', (err) => {
            console.log('Mongoose connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected from MongoDB Atlas');
        });
        
        // Handle app termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('Mongoose connection closed through app termination');
            process.exit(0);
        });
        
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

module.exports = main;