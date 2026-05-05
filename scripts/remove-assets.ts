import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { connectToDatabase } from '../lib/db';
import Product from '../lib/models/Product';

async function run() {
    await connectToDatabase();
    
    console.log("Searching for products to delete...");
    
    const productsToDelete = await Product.find({
        title: { $in: [
            /Claimed By My Boss/i,
            /Special Dark/i
        ]}
    });
    
    console.log(`Found ${productsToDelete.length} products matching.`);
    
    for (const product of productsToDelete) {
        console.log(`Deleting: ${product.title}`);
        await Product.findByIdAndDelete(product._id);
    }
    
    console.log("Done");
    process.exit(0);
}

run().catch(console.error);
