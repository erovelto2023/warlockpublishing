import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { connectToDatabase } from '@/lib/db';
import DigitalAsset from '@/lib/models/DigitalAsset';

import { isAdmin } from '@/lib/admin';

export const runtime = 'nodejs';

const WAREHOUSE_DIR = join(process.cwd(), '_warehouse_storage_');

// List all assets
export async function GET(req: NextRequest) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        await connectToDatabase();
        const assets = await DigitalAsset.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, assets });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// Delete an asset
export async function DELETE(req: NextRequest) {
    try {
        if (!await isAdmin()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        const { id } = await req.json();
        
        await connectToDatabase();
        const asset = await DigitalAsset.findById(id);

        if (!asset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }

        // Delete from disk
        const filePath = join(WAREHOUSE_DIR, asset.storedFilename);
        try {
            await unlink(filePath);
        } catch (e) {
            console.error('[File Delete Error] File might already be gone', e);
        }

        // Delete from DB
        await DigitalAsset.findByIdAndDelete(id);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
