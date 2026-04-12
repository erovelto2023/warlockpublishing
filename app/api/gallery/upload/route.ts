import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '@/lib/db';
import GalleryImage from '@/lib/models/GalleryImage';

const ALLOWED_TYPES: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
};
const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const GALLERY_DIR = join(process.cwd(), 'public', 'uploads', 'gallery');
const THUMB_DIR = join(GALLERY_DIR, 'thumbs');

export async function POST(req: NextRequest) {
    try {
        // Parse multipart form
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];
        const title = (formData.get('title') as string) || 'Untitled';
        const altText = (formData.get('altText') as string) || 'Image';
        const description = (formData.get('description') as string) || '';
        const tags = (formData.get('tags') as string || '').split(',').map(t => t.trim()).filter(Boolean);

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files provided' }, { status: 400 });
        }

        await connectToDatabase();

        // Dynamically import sharp (native module — works on Hostinger Node.js)
        const sharp = (await import('sharp')).default;

        const results = [];

        for (const file of files) {
            // Validate type
            if (!ALLOWED_TYPES[file.type]) {
                return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
            }
            // Validate size
            if (file.size > MAX_BYTES) {
                return NextResponse.json({ error: `File too large: ${file.name} (max 10MB)` }, { status: 400 });
            }

            const ext = ALLOWED_TYPES[file.type];
            const uuid = uuidv4();
            const storedFilename = `${uuid}${ext}`;
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Save original
            await writeFile(join(GALLERY_DIR, storedFilename), buffer);

            // Generate thumbnail (400x400 cover crop)
            const thumbBuffer = await sharp(buffer)
                .resize(400, 400, { fit: 'cover', position: 'centre' })
                .toBuffer();
            await writeFile(join(THUMB_DIR, storedFilename), thumbBuffer);

            // Save to DB
            const image = await GalleryImage.create({
                title: files.length === 1 ? title : file.name.replace(/\.[^/.]+$/, ''),
                altText: files.length === 1 ? altText : file.name.replace(/\.[^/.]+$/, ''),
                description,
                tags,
                originalFilename: file.name,
                storedFilename,
                fileUrl: `/uploads/gallery/${storedFilename}`,
                thumbnailUrl: `/uploads/gallery/thumbs/${storedFilename}`,
                mimeType: file.type,
                fileSizeBytes: file.size,
                status: 'draft',
            });

            results.push({
                id: image._id.toString(),
                fileUrl: image.fileUrl,
                thumbnailUrl: image.thumbnailUrl,
                title: image.title,
            });
        }

        return NextResponse.json({ success: true, images: results });
    } catch (err: any) {
        console.error('[Gallery Upload Error]', err);
        return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
    }
}
