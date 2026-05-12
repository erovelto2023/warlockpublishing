const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/warlock_publishing";

async function run() {
    await mongoose.connect(MONGODB_URI);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    await mongoose.disconnect();
}
run();
