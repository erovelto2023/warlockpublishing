import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
    try {
        const slug = params.slug; // Could be ['thumbs', 'uuid.png'] or ['uuid.png']
        const filePath = join(process.cwd(), 'public', 'uploads', 'gallery', ...slug);

        // Basic security to avoid directory traversal
        if (!filePath.startsWith(join(process.cwd(), 'public', 'uploads', 'gallery'))) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const buffer = await readFile(filePath);

        // Determine content type
        const ext = filePath.split('.').pop()?.toLowerCase();
        const mimeTypes: Record<string, string> = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            webp: 'image/webp',
        };
        const mimeType = mimeTypes[ext || ''] || 'application/octet-stream';

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': mimeType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (err) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
}
