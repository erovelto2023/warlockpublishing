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
    const docsDir = path.join(process.cwd(), 'docs');
    const csvFiles = ['market_nexus.csv', 'b2.csv'];
    const allResults: AmazonProduct[] = [];

    for (const fileName of csvFiles) {
        const csvPath = path.join(docsDir, fileName);
        if (!fs.existsSync(csvPath)) continue;

        try {
            const content = fs.readFileSync(csvPath, 'utf8');
            const lines = content.split('\n').filter(line => line.trim());
            
            const isHeader = lines[0].toLowerCase().includes('keyword') || lines[0].toLowerCase().includes('phrase');
            const dataLines = isHeader ? lines.slice(1) : lines;

            const products = dataLines.map(line => {
                // Robust CSV splitting that handles quotes and preserves empty fields
                const parts: string[] = [];
                let current = '';
                let inQuotes = false;
                
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"') {
                        inQuotes = !inQuotes;
                    } else if (char === ',' && !inQuotes) {
                        parts.push(current.trim().replace(/^"|"$/g, ''));
                        current = '';
                    } else {
                        current += char;
                    }
                }
                parts.push(current.trim().replace(/^"|"$/g, ''));

                const shortUrl = (parts[2] || '').trim();
                const fullUrl = (parts[3] || '').trim();
                const preferredUrl = (fullUrl.includes('javascript:void') && shortUrl.startsWith('http')) ? shortUrl : (fullUrl || shortUrl);

                return {
                    index: parts[0] || '',
                    keyword: (parts[1] || '').trim(),
                    shortUrl: shortUrl,
                    fullUrl: preferredUrl,
                    imageUrl: parts[4] || '',
                    rank: parts[5] || '',
                    store: parts[6] || '',
                    category: (parts[6] && parts[7]) ? `${parts[6]} ${parts[7]}` : (parts[7] || parts[6] || ''),
                    asin: parts[8] || '',
                    title: parts[9] || '',
                    rating: parts[15] || '',
                    reviewCount: parts[16] || '',
                    price: (parts[11] && parts[11] !== 'not-given' && parts[11] !== '') ? parts[11] : (parts[10] && parts[10] !== 'not-given' && parts[10] !== '' ? parts[10] : '19.99')
                };
            });
            allResults.push(...products);
        } catch (err) {
            console.error(`Error parsing ${fileName}:`, err);
        }
    }
    
    return allResults;
}
