const mongoose = require('mongoose');

// Define connection string - assuming it's in env or local default
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/warlockpublishing";

async function seed() {
    console.log('Connecting to DB...');
    await mongoose.connect(MONGODB_URI);

    const GlobalSettingsSchema = new mongoose.Schema({
        siteTitle: { type: String, default: 'Warlock Publishing' },
        siteDescription: { type: String, default: 'Premium digital assets and publishing mastery.' },
        homeHeroImageUrl: String,
        isMaintenanceMode: { type: Boolean, default: false }
    }, { timestamps: true });

    const GlobalSettings = mongoose.models.GlobalSettings || mongoose.model('GlobalSettings', GlobalSettingsSchema);

    const existing = await GlobalSettings.findOne();
    if (existing) {
        console.log('Settings exist. Updating...');
        existing.homeHeroImageUrl = '/uploads/gallery/hero.png';
        await existing.save();
    } else {
        console.log('Creating new settings...');
        await GlobalSettings.create({
            siteTitle: 'WARLOCK PUBLISHING',
            siteDescription: 'Enter the vault of elite digital assets and literary mastery. Built for creators who refuse to settle for the ordinary.',
            homeHeroImageUrl: '/uploads/gallery/hero.png'
        });
    }

    console.log('Seeding complete!');
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
