import mongoose from 'mongoose';

// Environment variable will be EVALUATED inside the function to ensure 
// that scripts using dotenv have a chance to load it before use.

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        const MONGODB_URI = process.env.MONGODB_URI;

        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('=> New MongoDB connection established');
            return mongoose;
        });
    }
    
    try {
        cached.conn = await cached.promise;
        if (mongoose.connection.readyState === 1) {
            console.log('=> MongoDB is connected');
        }
    } catch (e) {
        cached.promise = null;
        console.error('=> MongoDB connection error:', e);
        throw e;
    }
    
    return cached.conn;
}

export { connectToDatabase };
