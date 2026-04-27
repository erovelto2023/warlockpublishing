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
    const csvPath = path.join(process.cwd(), 'docs', 'billionairebooks.csv');
    
    if (!fs.existsSync(csvPath)) {
        console.warn('Amazon CSV not found at:', csvPath);
        return [];
    }

    try {
        const content = fs.readFileSync(csvPath, 'utf8');
        const lines = content.split('\n').filter(line => line.trim());
        
        // Skip header if it exists, but the user's sample looks like data
        // Let's check if the first line is header
        const isHeader = lines[0].includes('keyword') && lines[0].includes('url');
        const dataLines = isHeader ? lines.slice(1) : lines;

        return dataLines.map(line => {
            // Very basic CSV split (handle quotes)
            const parts = line.split('","').map(p => p.replace(/^"|"$/g, ''));
            
            const shortUrl = (parts[2] || '').trim();
            const fullUrl = (parts[3] || '').trim();
            
            // Intelligence: If fullUrl is broken (javascript:void), favor the shortUrl if it looks valid
            const preferredUrl = (fullUrl.includes('javascript:void') && shortUrl.startsWith('http')) ? shortUrl : (fullUrl || shortUrl);

            return {
                index: parts[0] || '',
                keyword: parts[1] || '',
                shortUrl: shortUrl,
                fullUrl: preferredUrl, // Store the fixed/preferred one here
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
        console.error('Error parsing Amazon CSV:', err);
        return [];
    }
}
