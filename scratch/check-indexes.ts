import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
if (fs.existsSync('.env.local')) {
    const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const MONGODB_URI = process.env.MONGODB_URI;

async function run() {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    const indexes = await mongoose.connection.db.collection('glossaryterms').indexes();
    console.log('Indexes for glossaryterms:', JSON.stringify(indexes, null, 2));

    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
