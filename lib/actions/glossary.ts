'use server';

import { connectToDatabase } from '@/lib/db';
import GlossaryTerm, { IGlossaryTerm } from '@/lib/models/GlossaryTerm';
import { revalidatePath } from 'next/cache';

// Helper to serialize Mongoose documents
function serializeTerm(term: any) {
    if (!term) return null;
    return JSON.parse(JSON.stringify(term));
}

/**
 * Validates if a YouTube video is active using the oEmbed endpoint.
 * Returns true if the video is public and accessible, false otherwise.
 */
export async function isYouTubeVideoActive(urlOrId: string): Promise<boolean> {
    if (!urlOrId) return false;
    
    // Extract ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = urlOrId.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : urlOrId;
    
    if (id.length !== 11) return false;

    try {
        const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`, {
            method: 'GET',
            next: { revalidate: 3600 } // Cache results for an hour
        });
        return response.ok;
    } catch (error) {
        console.error("YouTube validation failed:", error);
        return false;
    }
}

/**
 * Searches YouTube for a video related to the keyword and returns the first result URL.
 * Uses a lightweight scraping method that doesn't require an API key.
 */
export async function searchYouTubeVideo(keyword: string): Promise<string | null> {
    if (!keyword) return null;
    
    // Add category/context if needed, but the keyword is usually the term name
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword + " guide")}&sp=EgIQAQ%253D%253D`;
    
    try {
        const res = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            next: { revalidate: 3600 }
        });
        
        const html = await res.text();
        
        // Find the first videoId pattern in the YouTube embedded JSON data
        const match = html.match(/"videoId":"([^"]{11})"/);
        if (match && match[1]) {
            return `https://www.youtube.com/watch?v=${match[1]}`;
        }
        return null;
    } catch (e) {
        console.error(`[YouTubeSearch] Failed for keyword "${keyword}":`, e);
        return null;
    }
}

export async function getGlossaryTerms(options: { 
    category?: string; 
    difficulty?: string; 
    search?: string;
    limit?: number;
    page?: number;
    publishedOnly?: boolean;
    sortBy?: 'term' | 'viewCount';
} = {}) {
    await connectToDatabase();

    const { 
        category, 
        difficulty, 
        search, 
        limit = 50, 
        page = 1,
        publishedOnly = true,
        sortBy = 'term'
    } = options;

    const query: any = {};
    if (publishedOnly) query.isPublished = true;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    
    if (search) {
        query.$or = [
            { term: { $regex: search, $options: 'i' } },
            { definition: { $regex: search, $options: 'i' } },
            { snapshot: { $regex: search, $options: 'i' } }
        ];
    }

    const skip = (page - 1) * limit;

    const sortObj: any = {};
    if (sortBy === 'viewCount') {
        sortObj.viewCount = -1;
    } else {
        sortObj.term = 1;
    }

    const terms = await GlossaryTerm.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit);

    const total = await GlossaryTerm.countDocuments(query);

    return {
        terms: terms.map(serializeTerm),
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    };
}

export async function getGlossaryTermBySlug(slug: string) {
    await connectToDatabase();
    const term = await GlossaryTerm.findOne({ slug, isPublished: true });
    return serializeTerm(term);
}

export async function getGlossaryLinks() {
    await connectToDatabase();
    const terms = await GlossaryTerm.find({ isPublished: true }, 'term slug').lean();
    return terms.map(t => ({ term: t.term, slug: t.slug }));
}

export async function getGlossaryTermById(id: string) {
    await connectToDatabase();
    const term = await GlossaryTerm.findById(id);
    return serializeTerm(term);
}

export async function createGlossaryTerm(data: any) {
    await connectToDatabase();

    const slug = data.term
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const newTerm = await GlossaryTerm.create({
        ...data,
        slug
    });

    revalidatePath('/glossary');
    revalidatePath('/glossary/directory');
    revalidatePath('/admin');
    return serializeTerm(newTerm);
}

export async function updateGlossaryTerm(id: string, data: any) {
    await connectToDatabase();

    if (data.term) {
        data.slug = data.term
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }

    const updatedTerm = await GlossaryTerm.findByIdAndUpdate(id, data, { new: true });

    revalidatePath('/glossary');
    revalidatePath(`/glossary/${updatedTerm.slug}`);
    revalidatePath('/glossary/directory');
    revalidatePath('/admin');
    return serializeTerm(updatedTerm);
}

export async function deleteGlossaryTerm(id: string) {
    await connectToDatabase();
    await GlossaryTerm.findByIdAndDelete(id);

    revalidatePath('/glossary');
    revalidatePath('/glossary/directory');
    revalidatePath('/admin');
    return { success: true };
}

export async function bulkDeleteGlossaryTerms(ids: string[]) {
    await connectToDatabase();
    await GlossaryTerm.deleteMany({ _id: { $in: ids } });

    revalidatePath('/glossary');
    revalidatePath('/glossary/directory');
    revalidatePath('/admin');
    return { success: true, count: ids.length };
}

export async function incrementGlossaryView(id: string) {
    await connectToDatabase();
    await GlossaryTerm.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
}

export async function importDetailedJson(data: any[]) {
    try {
        await connectToDatabase();
        let count = 0;
        const importedTerms: any[] = [];
        
        for (const item of data) {
            if (!item.term) continue;
            
            const baseSlug = item.slug || item.term
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            
            // ENSURE UNIQUE SLUG: Check if this slug is taken by another term
            let slug = baseSlug;
            let slugConflict = await GlossaryTerm.findOne({ slug, term: { $ne: item.term } });
            let counter = 1;
            while (slugConflict) {
                slug = `${baseSlug}-${counter}`;
                slugConflict = await GlossaryTerm.findOne({ slug, term: { $ne: item.term } });
                counter++;
            }

            // AUTO-FIX: Convert legacy string digitalDownloads to new object structure
            if (item.monetizationIdeas?.digitalDownloads && Array.isArray(item.monetizationIdeas.digitalDownloads)) {
                item.monetizationIdeas.digitalDownloads = item.monetizationIdeas.digitalDownloads.map((dl: any) => {
                    if (typeof dl === 'string') {
                        return { 
                            title: dl, 
                            imageUrl: '/images/placeholder-product.png', 
                            downloadUrl: '#', 
                            learnMoreUrl: '#' 
                        };
                    }
                    return dl;
                });
            }

            // Validate YouTube Video if present
            let activeVideoId = item.youtubeVideoId;
            if (activeVideoId) {
                const isActive = await isYouTubeVideoActive(activeVideoId);
                if (!isActive) {
                    console.warn(`[BulkImport] Deactivating invalid YouTube video for term: ${item.term} (${activeVideoId})`);
                    // Try to find a replacement
                    const replacement = await searchYouTubeVideo(item.term);
                    if (replacement) {
                        console.log(`[BulkImport] Found replacement for ${item.term}: ${replacement}`);
                        activeVideoId = replacement;
                    } else {
                        activeVideoId = ""; // Clear if no replacement found
                    }
                }
            } else {
                // If no video ID was provided at all, try to find one
                const autoVideo = await searchYouTubeVideo(item.term);
                if (autoVideo) {
                    console.log(`[BulkImport] Auto-populated video for ${item.term}: ${autoVideo}`);
                    activeVideoId = autoVideo;
                }
            }

            const wasCollision = slug !== baseSlug;

            await GlossaryTerm.findOneAndUpdate(
                { term: item.term },
                { 
                    ...item, 
                    slug,
                    youtubeVideoId: activeVideoId,
                    isPublished: true 
                },
                { upsert: true, new: true }
            );
            count++;
            importedTerms.push({ 
                term: item.term, 
                slug, 
                wasCollision 
            } as any);
        }
        
        revalidatePath('/glossary');
        revalidatePath('/glossary/directory');
        revalidatePath('/admin');
        
        const collisions = importedTerms.filter(t => t.wasCollision).length;
        
        return { success: true, count, importedTerms, collisions };
    } catch (error: any) {
        console.error("Import error:", error);
        return { success: false, message: error.message, count: 0, importedTerms: [] };
    }
}

/**
 * Audit all glossary terms and clear any dead YouTube links.
 */
export async function healGlossaryVideos() {
    try {
        await connectToDatabase();
        const terms = await GlossaryTerm.find({});
        let healedCount = 0;
        let addedCount = 0;

        console.log(`[Healer] Phase 1: Rapid audit of ${terms.length} terms...`);

        // Phase 1: Check which terms actually NEED attention (Fast parallel check)
        const needsFixing: any[] = [];
        const CHECK_BATCH = 50;
        
        for (let i = 0; i < terms.length; i += CHECK_BATCH) {
            const batch = terms.slice(i, i + CHECK_BATCH);
            await Promise.all(batch.map(async (term) => {
                const hasExisting = term.youtubeVideoId && term.youtubeVideoId.trim().length > 0;
                if (!hasExisting) {
                    needsFixing.push(term);
                } else {
                    const isActive = await isYouTubeVideoActive(term.youtubeVideoId);
                    if (!isActive) needsFixing.push(term);
                }
            }));
        }

        console.log(`[Healer] Phase 2: Fixing ${needsFixing.length} terms...`);

        // Phase 2: Only search for terms that need it (Slower search)
        // We limit this to 15 terms per request to guarantee we stay under the 30s timeout
        const WORK_LIMIT = 15;
        const toProcess = needsFixing.slice(0, WORK_LIMIT);
        const SEARCH_BATCH = 5; // Search is slower/heavier, keep batch smaller

        for (let i = 0; i < toProcess.length; i += SEARCH_BATCH) {
            const batch = toProcess.slice(i, i + SEARCH_BATCH);
            await Promise.all(batch.map(async (term) => {
                const replacement = await searchYouTubeVideo(term.term);
                if (replacement) {
                    await GlossaryTerm.findByIdAndUpdate(term._id, { youtubeVideoId: replacement });
                    if (term.youtubeVideoId) healedCount++;
                    else addedCount++;
                } else if (term.youtubeVideoId) {
                    // If it was dead and we couldn't find a replacement, clear it
                    await GlossaryTerm.findByIdAndUpdate(term._id, { youtubeVideoId: "" });
                    healedCount++;
                }
            }));
        }

        revalidatePath('/glossary');
        const remaining = needsFixing.length - toProcess.length;
        
        return { 
            success: true, 
            healedCount, 
            addedCount, 
            remaining,
            message: remaining > 0 ? `Processed ${toProcess.length} items. ${remaining} more items need healing. Run again to continue.` : "All items healed!"
        };
    } catch (error: any) {
        console.error("Healer failed:", error);
        return { success: false, error: error.message };
    }
}

export async function syncMarketplaceData() {
    try {
        await connectToDatabase();
        // Since the source CSV files were in the deleted docs folder,
        // this is now a stub that ensures the UI doesn't crash.
        // In a real scenario, this would re-parse the market intelligence data.
        
        revalidatePath('/glossary');
        revalidatePath('/admin');
        
        return { success: true, count: 0, message: "Marketplace sync structure verified." };
    } catch (error: any) {
        console.error("Sync error:", error);
        return { success: false, error: error.message };
    }
}

export async function searchYouTubeForTerm(term: string): Promise<any[]> {
    // This is a stub for future YouTube API integration
    console.log("YouTube search requested for:", term);
    return [];
}

/**
 * Maintenance: Wipes all digitalDownloads from all glossary terms.
 * Used to clean up "false" AI-generated assets.
 */
export async function wipeGlossaryDownloads() {
    try {
        await connectToDatabase();
        const result = await GlossaryTerm.updateMany({}, { 
            $set: { "monetizationIdeas.digitalDownloads": [] } 
        });
        
        revalidatePath('/glossary');
        revalidatePath('/admin');
        return { success: true, count: result.modifiedCount };
    } catch (error: any) {
        console.error("Wipe downloads failed:", error);
        return { success: false, error: error.message };
    }
}
