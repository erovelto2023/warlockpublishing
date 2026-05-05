import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { connectToDatabase } from '../lib/db';
import Product from '../lib/models/Product';
import SalesPage from '../lib/models/SalesPage';

async function run() {
    await connectToDatabase();
    
    const products = await Product.find({}, { title: 1 }).lean();
    console.log("Products:");
    products.forEach(p => console.log(p.title));
    
    const sales = await SalesPage.find({}, { title: 1 }).lean();
    console.log("Sales Pages:");
    sales.forEach(p => console.log(p.title));
    
    process.exit(0);
}

run().catch(console.error);
