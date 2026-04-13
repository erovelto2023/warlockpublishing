import { NextRequest, NextResponse } from 'next/server';
import { mkdir } from 'fs/promises';
import { createWriteStream } from 'fs';
import { join } from 'path';
import crypto from 'crypto';
import busboy from 'busboy';
import { Readable } from 'stream';
import { connectToDatabase } from '@/lib/db';
import DigitalAsset from '@/lib/models/DigitalAsset';

// Disabling standard body parser is not required/possible exactly like this in App Router 
// but we consume the stream directly via req.body.

export const runtime = 'nodejs'; // Required for fs and streaming

const WAREHOUSE_DIR = join(process.cwd(), '_warehouse_storage_');

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        
        // Ensure warehouse directory exists
        await mkdir(WAREHOUSE_DIR, { recursive: true });

        // Convert Web Request body to Node.js Readable stream
        // Need to cast to any because Next's ReadableStream vs Node's Readable type mismatch
        const nodeStream = Readable.fromWeb(req.body as any);
        
        // Parse headers for busboy
        const headers = Object.fromEntries(req.headers);
        const bb = busboy({ 
            headers,
            limits: { fileSize: 1024 * 1024 * 1024 } // 1GB
        });

        return new Promise((resolve, reject) => {
            let fileWritten = false;
            let assetData: any = {};

            bb.on('file', (name, file, info) => {
                const { filename, mimeType } = info;
                const uuid = crypto.randomUUID();
                const storedFilename = `${uuid}`; // No extension for better obfuscation in folder
                const savePath = join(WAREHOUSE_DIR, storedFilename);
                const writeStream = createWriteStream(savePath);

                let bytesRead = 0;
                
                file.on('data', (data) => {
                    bytesRead += data.length;
                    writeStream.write(data);
                });

                file.on('end', () => {
                    writeStream.end();
                    fileWritten = true;
                    assetData = {
                        originalFilename: filename,
                        storedFilename,
                        mimeType,
                        fileSizeBytes: bytesRead
                    };
                });
            });

            bb.on('field', (name, value) => {
                if (name === 'title') assetData.title = value;
                if (name === 'description') assetData.description = value;
            });

            bb.on('finish', async () => {
                if (!fileWritten) {
                    resolve(NextResponse.json({ error: 'No file uploaded' }, { status: 400 }));
                    return;
                }

                try {
                    const accessSlug = crypto.randomBytes(16).toString('hex');
                    const asset = await DigitalAsset.create({
                        title: assetData.title || assetData.originalFilename,
                        description: assetData.description || '',
                        originalFilename: assetData.originalFilename,
                        storedFilename: assetData.storedFilename,
                        fileSizeBytes: assetData.fileSizeBytes,
                        mimeType: assetData.mimeType,
                        accessSlug
                    });

                    resolve(NextResponse.json({ 
                        success: true, 
                        asset: {
                            id: asset._id,
                            title: asset.title,
                            downloadUrl: `/api/warehouse/download/${accessSlug}`
                        }
                    }));
                } catch (err: any) {
                    resolve(NextResponse.json({ error: err.message }, { status: 500 }));
                }
            });

            bb.on('error', (err) => {
                console.error('[Busboy Error]', err);
                resolve(NextResponse.json({ error: 'Upload failed' }, { status: 500 }));
            });

            nodeStream.pipe(bb);
        });

    } catch (err: any) {
        console.error('[Warehouse Upload API Error]', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
