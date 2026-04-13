const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function check() {
    try {
        console.log("Connecting to:", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await mongoose.connection.db.collection('glossaryterms').countDocuments();
        console.log("Total terms in 'glossaryterms' collection:", count);
        
        // Let's also check if the collection name is different
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Found collections:", collections.map(c => c.name));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
