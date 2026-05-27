import mongoose from 'mongoose';

async function run() {
    // Connect to warlockpublishing
    const conn1 = await mongoose.createConnection('mongodb://localhost:27017/warlockpublishing').asPromise();
    console.log('Connected to warlockpublishing');
    const cols1 = await conn1.db.listCollections().toArray();
    console.log('warlockpublishing collections:', cols1.map(c => c.name));
    
    if (cols1.some(c => c.name === 'glossaryterms')) {
        const count = await conn1.db.collection('glossaryterms').countDocuments({});
        console.log('warlockpublishing glossaryterms count:', count);
        const terms = await conn1.db.collection('glossaryterms').find({}, { projection: { term: 1, slug: 1 } }).toArray();
        console.log('warlockpublishing terms:', terms);
    }
    await conn1.close();

    // Connect to wedding-planner
    const conn2 = await mongoose.createConnection('mongodb://localhost:27017/wedding-planner').asPromise();
    console.log('Connected to wedding-planner');
    const cols2 = await conn2.db.listCollections().toArray();
    console.log('wedding-planner collections:', cols2.map(c => c.name));
    if (cols2.some(c => c.name === 'glossaryterms')) {
        const count = await conn2.db.collection('glossaryterms').countDocuments({});
        console.log('wedding-planner glossaryterms count:', count);
    }
    await conn2.close();

    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
