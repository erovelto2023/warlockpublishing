import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Product from '@/lib/models/Product';
import GlossaryTerm from '@/lib/models/GlossaryTerm';
import BlogPost from '@/lib/models/BlogPost';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q');

        if (!q) {
            return NextResponse.json({ products: [], glossary: [], blog: [] });
        }

        await connectToDatabase();

        const searchRegex = new RegExp(q, 'i');

        const [products, glossary, blog] = await Promise.all([
            Product.find({ 
                $or: [
                    { title: searchRegex },
                    { description: searchRegex },
                    { tags: searchRegex }
                ] 
            }).limit(5).select('title slug price').lean(),
            
            GlossaryTerm.find({ 
                $or: [
                    { term: searchRegex },
                    { definition: searchRegex },
                    { category: searchRegex }
                ] 
            }).limit(8).select('term slug category').lean(),

            BlogPost.find({ 
                $or: [
                    { title: searchRegex },
                    { content: searchRegex }
                ] 
            }).limit(5).select('title slug createdAt').lean()
        ]);

        return NextResponse.json({ products, glossary, blog });
    } catch (error: any) {
        console.error('Search API error:', error);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
