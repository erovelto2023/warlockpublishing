const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/warlock_publishing";
const Schema = new mongoose.Schema({ term: String, slug: String }, { strict: false });
const GlossaryTerm = mongoose.models.GlossaryTerm || mongoose.model('GlossaryTerm', Schema);

async function run() {
    await mongoose.connect(MONGODB_URI);
    const terms = await GlossaryTerm.find({}, 'term slug').sort({ createdAt: -1 });
    console.log("Recent Terms:", terms.slice(0, 100).map(t => t.slug));
    await mongoose.disconnect();
}
run();
