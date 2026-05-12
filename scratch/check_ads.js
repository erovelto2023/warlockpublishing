const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/warlock_publishing";
const Schema = new mongoose.Schema({ title: String, slug: String }, { strict: false });
const Advertorial = mongoose.models.Advertorial || mongoose.model('Advertorial', Schema);

async function run() {
    await mongoose.connect(MONGODB_URI);
    const ads = await Advertorial.find({ slug: 'graphics-infographics' });
    console.log("Advertorials Found:", ads);
    await mongoose.disconnect();
}
run();
