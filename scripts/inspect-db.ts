import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { connectToDatabase } from '../lib/db';
import mongoose from 'mongoose';

async function inspectDb() {
    await connectToDatabase();
    
    // Note the exclamation marks added to fix the "possibly 'undefined'" error:
    const db = mongoose.connection.db!;
    
    console.log("Connected to:", db.databaseName);
    
    const collections = await mongoose.connection.db!.collections();
    console.log("Collections:", collections.map(c => c.collectionName));
    
    process.exit(0);
}

inspectDb();
