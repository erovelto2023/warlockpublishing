import { connectToDatabase } from "./lib/db";
import Product from "./lib/models/Product";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function checkProducts() {
    try {
        await connectToDatabase();
        const count = await Product.countDocuments();
        const featuredCount = await Product.countDocuments({ isFeaturedInRotation: true, isHidden: { $ne: true } });
        const hiddenCount = await Product.countDocuments({ isHidden: true });
        
        console.log(`Total Products: ${count}`);
        console.log(`Featured/Visible Products: ${featuredCount}`);
        console.log(`Hidden Products: ${hiddenCount}`);
        
        if (count > 0) {
            const sample = await Product.findOne().lean();
            console.log("Sample Product:", JSON.stringify(sample, null, 2));
        }
        
        process.exit(0);
    } catch (err) {
        console.error("Error checking products:", err);
        process.exit(1);
    }
}

checkProducts();
