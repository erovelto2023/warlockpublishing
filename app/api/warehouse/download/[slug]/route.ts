import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, existsSync, statSync } from 'fs';
import { join } from 'path';
import { connectToDatabase } from '@/lib/db';
import DigitalAsset from '@/lib/models/DigitalAsset';

export const runtime = 'nodejs';

const WAREHOUSE_DIR = join(process.cwd(), '_warehouse_storage_');

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        
        await connectToDatabase();
        const asset = await DigitalAsset.findOne({ accessSlug: slug });

        if (!asset) {
            return new NextResponse('Asset not found', { status: 404 });
        }

        const filePath = join(WAREHOUSE_DIR, asset.storedFilename);

        if (!existsSync(filePath)) {
            return new NextResponse('File missing on server', { status: 410 }); // Gone
        }

        // Get file stats for size
        const stats = statSync(filePath);
        
        // Create streaming response
        // In Next.js App Router, we return a Response with a ReadableStream
        const fileStream = createReadStream(filePath);
        
        // Convert Node.js ReadStream to WHATWG ReadableStream
        const stream = new ReadableStream({
            start(controller) {
                fileStream.on('data', (chunk) => controller.enqueue(chunk));
                fileStream.on('end', () => controller.close());
                fileStream.on('error', (err) => controller.error(err));
            },
            cancel() {
                fileStream.destroy();
            }
        });

        // Update download count (asynchronous, don't block the stream)
        DigitalAsset.updateOne({ _id: asset._id }, { $inc: { downloadCount: 1 } }).catch(console.error);

        return new Response(stream, {
            headers: {
                'Content-Type': asset.mimeType || 'application/octet-stream',
                'Content-Length': stats.size.toString(),
                'Content-Disposition': `attachment; filename="${asset.originalFilename}"`,
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
        });

    } catch (err: any) {
        console.error('[Download API Error]', err);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
