import fs from 'fs';
import path from 'path';

export interface AmazonProduct {
    index: string;
    keyword: string;
    shortUrl: string;
    fullUrl: string;
    imageUrl: string;
    rank: string;
    store: string;
    category: string;
    asin: string;
    title: string;
    rating: string;
    reviewCount: string;
    price: string;
}

export async function parseAmazonCsv(): Promise<AmazonProduct[]> {
    const csvPath = path.join(process.cwd(), 'docs', 'market_nexus.csv');
    
    if (!fs.existsSync(csvPath)) {
        console.warn('Market Nexus CSV not found at:', csvPath);
        return [];
    }

    try {
        const content = fs.readFileSync(csvPath, 'utf8');
        const lines = content.split('\n').filter(line => line.trim());
        
        // Skip header if it exists
        const isHeader = lines[0].includes('keyword') && lines[0].includes('url');
        const dataLines = isHeader ? lines.slice(1) : lines;

        return dataLines.map(line => {
            // Better CSV split that handles quoted commas
            const matches = line.match(/"[^"]*"|[^,]+/g);
            let parts = matches ? Array.from(matches) : [];
            parts = parts.map(p => p.replace(/^"|"$/g, '').trim());
            
            const shortUrl = (parts[2] || '').trim();
            const fullUrl = (parts[3] || '').trim();
            
            // Intelligence: If fullUrl is broken (javascript:void), favor the shortUrl
            const preferredUrl = (fullUrl.includes('javascript:void') && shortUrl.startsWith('http')) ? shortUrl : (fullUrl || shortUrl);

            return {
                index: parts[0] || '',
                keyword: (parts[1] || '').trim(),
                shortUrl: shortUrl,
                fullUrl: preferredUrl,
                imageUrl: parts[4] || '',
                rank: parts[5] || '',
                store: parts[6] || '',
                category: parts[7] || '',
                asin: parts[8] || '',
                title: parts[9] || '',
                rating: parts[15] || '',
                reviewCount: parts[16] || '',
                price: parts[26] || '0.00'
            };
        });
    } catch (err) {
        console.error('Error parsing Market Nexus:', err);
        return [];
    }
}
