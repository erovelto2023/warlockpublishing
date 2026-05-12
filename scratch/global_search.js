const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/warlock_publishing";

async function run() {
    await mongoose.connect(MONGODB_URI);
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const col of collections) {
        const results = await mongoose.connection.db.collection(col.name).find({ 
            $or: [
                { slug: /infographics/i },
                { term: /infographics/i },
                { title: /infographics/i }
            ]
        }).toArray();
        if (results.length > 0) {
            console.log(`Collection: ${col.name}`, results.map(r => ({ id: r._id, slug: r.slug, term: r.term, title: r.title })));
        }
    }
    await mongoose.disconnect();
}
run();
