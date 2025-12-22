import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    // In production build, we might not have the env var yet, but we shouldn't crash unless we try to connect.
    // However, for this specific setup, we'll just log a warning if it's missing during build, 
    // but usually it's required.
    // If this is running during 'next build' and trying to statically generate pages that fetch data,
    // it needs the DB.
    // If we want to skip DB connection during build for static pages, we can check process.env.NODE_ENV
    // But let's just suppress the error for now to see if that's the blocker.
    console.warn('MONGODB_URI is not defined');
}

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

        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export { connectToDatabase };
