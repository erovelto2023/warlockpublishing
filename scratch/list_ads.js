
const mongoose = require('mongoose');

async function run() {
    await mongoose.connect('mongodb+srv://erove:Warlock2024!@cluster0.p0qjt.mongodb.net/warlock_publishing?retryWrites=true&w=majority');
    const Advertorial = mongoose.models.Advertorial || mongoose.model('Advertorial', new mongoose.Schema({}));
    const ads = await Advertorial.find({}, { _id: 1, title: 1, slug: 1 });
    console.log(JSON.stringify(ads, null, 2));
    process.exit(0);
}

run();
