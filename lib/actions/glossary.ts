'use server';

import { connectToDatabase } from '@/lib/db';
import GlossaryTerm from '@/lib/models/GlossaryTerm';
import { revalidatePath } from 'next/cache';

// Slugify helper
function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

async function makeUniqueSlug(baseSlug: string, existingSlugs: string[]) {
    let slug = baseSlug;
    let counter = 1;
    while (existingSlugs.includes(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    return slug;
}

// Helper to serialize Mongoose documents (handles the new ROBUST high-fidelity fields)
function serializeTerm(term: any) {
    if (!term) return null;
    // Using simple but effective JSON transition to strip Mongoose specific types
    return JSON.parse(JSON.stringify(term));
}

export async function createGlossaryTerm(data: any) {
    await connectToDatabase();
    
    let slug = data.slug || slugify(data.term);
    const existingTerms = await GlossaryTerm.find({}, { slug: 1 }).lean();
    const existingSlugs = existingTerms.map((t: any) => t.slug).filter(Boolean);
    slug = await makeUniqueSlug(slug, existingSlugs);

    const newTerm = await GlossaryTerm.create({
        ...data,
        slug,
    });
    revalidatePath('/glossary');
    revalidatePath('/admin/glossary');
    return serializeTerm(newTerm);
}

export async function updateGlossaryTerm(id: string, data: any) {
    await connectToDatabase();
    
    // If term changed, we might want to update slug, but usually better to keep it for SEO
    // unless explicitly changed in data.
    
    const updatedTerm = await GlossaryTerm.findByIdAndUpdate(id, {
        ...data,
        lastUpdated: new Date()
    }, { new: true });
    
    if (!updatedTerm) throw new Error('Term not found');
    
    revalidatePath('/glossary');
    revalidatePath(`/glossary/${updatedTerm.slug}`);
    revalidatePath('/admin/glossary');
    return serializeTerm(updatedTerm);
}

export async function deleteGlossaryTerm(id: string) {
    await connectToDatabase();
    await GlossaryTerm.findByIdAndDelete(id);
    revalidatePath('/glossary');
    revalidatePath('/admin/glossary');
    return { success: true };
}

export async function getGlossaryTerms(options: { 
    search?: string; 
    letter?: string; 
    category?: string;
    niche?: string;
    publishedOnly?: boolean;
    limit?: number;
    sortBy?: 'term' | 'views';
} = {}) {
    await connectToDatabase();
    const { search, letter, category, niche, publishedOnly = true, limit, sortBy = 'term' } = options;
    
    const query: any = {};
    if (publishedOnly) query.isPublished = { $ne: false };
    
    const finalCategory = category || niche;
    if (finalCategory) {
        query.$or = [
            { category: finalCategory },
            { niche: finalCategory }
        ];
    }
    
    if (letter) {
        query.term = { $regex: new RegExp(`^${letter}`, 'i') };
    }
    
    if (search) {
        query.$or = [
            { term: { $regex: new RegExp(search, 'i') } },
            { definition: { $regex: new RegExp(search, 'i') } },
            { genre: { $regex: new RegExp(search, 'i') } },
            { trope: { $regex: new RegExp(search, 'i') } },
            { niche: { $regex: new RegExp(search, 'i') } }
        ];
    }

    let sortConfig: any = { term: 1 };
    if (sortBy === 'views') sortConfig = { views: -1 };

    let dbQuery = GlossaryTerm.find(query).sort(sortConfig);
    if (limit) dbQuery = dbQuery.limit(limit);
    
    const terms = await dbQuery.exec();
    return terms.map(serializeTerm);
}

export async function getGlossaryTermBySlug(slug: string) {
    await connectToDatabase();
    const term = await GlossaryTerm.findOne({ slug });
    if (term) {
        // Increment views asynchronously
        GlossaryTerm.updateOne({ _id: term._id }, { $inc: { views: 1 } }).catch(console.error);
    }
    return serializeTerm(term);
}

export async function getGlossaryTermById(id: string) {
    await connectToDatabase();
    const term = await GlossaryTerm.findById(id);
    return serializeTerm(term);
}

export async function getGlossaryCategories() {
    await connectToDatabase();
    const categories = await GlossaryTerm.distinct('category');
    const niches = await GlossaryTerm.distinct('niche');
    return Array.from(new Set([...categories, ...niches])).filter(Boolean);
}

export async function getGlossaryStats() {
    await connectToDatabase();
    const totalCount = await GlossaryTerm.countDocuments();
    const publishedCount = await GlossaryTerm.countDocuments({ isPublished: true });
    
    const missingVideo = await GlossaryTerm.countDocuments({ 
        $or: [
            { "youtubeVideo.url": "" }, 
            { "youtubeVideo.url": { $exists: false } },
            { "videoUrl": "" },
            { "videoUrl": { $exists: false } }
        ] 
    });
    const missingArticle = await GlossaryTerm.countDocuments({ 
        $or: [{ "blogArticle.content": "" }, { "blogArticle.content": { $exists: false } }] 
    });
    
    const totalViews = await GlossaryTerm.aggregate([
        { $group: { _id: null, total: { $sum: "$views" } } }
    ]);

    return {
        total: totalCount,
        published: publishedCount,
        missingVideo,
        missingArticle,
        totalViews: totalViews[0]?.total || 0
    };
}

// --- Maintenance & Advanced Imports ---

/**
 * Robust JSON repair logic for malformed AI exports
 */
function extremeRepair(input: string): string {
    if (!input || typeof input !== 'string') return input;
    
    let s = input.trim();

    // 1. Remove Markdown & JS Variable junk
    s = s.replace(/```[a-z]*\n?|```/g, '');
    s = s.replace(/^(const|let|var|data|result|item|array)\s*[\w\d]*\s*=\s*/, '');
    s = s.replace(/;?\s*$/, '');
    s = s.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

    // 2. Global Concatenation & Quote Merger
    for (let i = 0; i < 5; i++) {
        s = s.replace(/(['"])\s*(?:\+)?\s*\\n\s*(['"])/g, ''); 
        s = s.replace(/(['"])\s*\+\s*(['"])/g, '');           
        s = s.replace(/(['"])\s*\n\s*(\+)?\s*\n?\s*(['"])/g, ''); 
    }

    // 3. Structural Normalization
    s = s.replace(/([\{,\[]\s*)([a-z_][a-z0-9_]*)(\s*):/gi, '$1"$2"$3:');
    s = s.replace(/([\{,\[]\s*)'([a-z_][a-z0-9_]*)'(\s*):/gi, '$1"$2"$3:');

    // 4. Content Value Normalization (Apostrophe-Safe)
    const fixContent = (text: string) => {
        return text.replace(/([:\[,]\s*)'([^]*?)'(\s*[,\]\}])/g, (match, pre, content, post) => {
            const escaped = content.replace(/"/g, '\\"');
            return (pre.startsWith(':') ? ': ' : pre) + '"' + escaped + '"' + post;
        });
    };
    s = fixContent(s);
    s = fixContent(s);

    // 5. Cleanup
    s = s.replace(/\\n/g, ' '); 
    s = s.replace(/,(\s*[\]\}])/g, '$1'); 
    
    return s;
}

function deepNormalize(val: any): any {
    if (typeof val === 'string') {
        const t = val.trim();
        if (t.startsWith('[') || t.startsWith('{') || (t.startsWith('"') && t.includes('['))) {
            try {
                return deepNormalize(JSON.parse(t));
            } catch (e) {
                try {
                    const repaired = extremeRepair(t);
                    return deepNormalize(JSON.parse(repaired));
                } catch (e2) {
                    if (t.startsWith('"') && t.endsWith('"')) {
                        try {
                            return deepNormalize(JSON.parse(t));
                        } catch (e3) { return val; }
                    }
                    return val;
                }
            }
        }
    }
    if (Array.isArray(val)) {
        if (val.length === 1 && typeof val[0] === 'string' && (val[0].trim().startsWith('[') || val[0].trim().startsWith('{'))) {
            const result = deepNormalize(val[0]);
            return Array.isArray(result) || (result && typeof result === 'object') ? result : [];
        }
        return val.map(item => deepNormalize(item));
    }
    if (val !== null && typeof val === 'object') {
        const obj: any = {};
        for (const key in val) {
            obj[key] = deepNormalize(val[key]);
        }
        return obj;
    }
    return val;
}

export async function bulkImportTerms(keywords: string[], category: string) {
    await connectToDatabase();
    const existingTerms = await GlossaryTerm.find({}, { term: 1 }).lean();
    const existingNames = existingTerms.map((t: any) => t.term.toLowerCase());
    
    const newKeywords = keywords.filter(k => !existingNames.includes(k.toLowerCase()));
    
    if (newKeywords.length === 0) {
        return { success: true, count: 0, upserted: 0, updated: 0 };
    }

    const operations = newKeywords.map(keyword => {
        const baseSlug = slugify(keyword);
        return {
            insertOne: {
                document: {
                    term: keyword,
                    slug: baseSlug,
                    category: category,
                    isPublished: true,
                    status: 'Seeded',
                    lastUpdated: new Date()
                }
            }
        };
    });

    const result = await GlossaryTerm.bulkWrite(operations);
    revalidatePath('/glossary');
    revalidatePath('/admin/glossary');
    return { 
        success: true, 
        count: result.insertedCount, 
        upserted: result.insertedCount, 
        updated: 0 
    };
}

export async function getRelatedGlossaryTerms(category: string, excludeSlug: string) {
    try {
        await connectToDatabase();
        return await GlossaryTerm.find({ 
            category, 
            slug: { $ne: excludeSlug },
            isPublished: true 
        })
        .limit(4)
        .select('term slug shortDefinition category')
        .lean();
    } catch (e) {
        return [];
    }
}

export async function importDetailedJson(data: any[]) {
    try {
        await connectToDatabase();
        const existingSlugs = (await GlossaryTerm.find({}, { slug: 1 }).lean()).map((t: any) => t.slug);
        
        const operations = data.map(rawItem => {
            const item = deepNormalize(rawItem);
            const term = item.term || item.keyword;
            if (!term) return null;
            
            const baseSlug = item.slug || slugify(term);
            const slug = existingSlugs.includes(baseSlug) ? `${baseSlug}-${Date.now()}` : baseSlug;
            existingSlugs.push(slug);

            // Schema Defense
            if (typeof item.relatedKeywords === 'string') item.relatedKeywords = [];
            if (typeof item.productIdeas === 'string') item.productIdeas = [];
            if (typeof item.competitorReferences === 'string') item.competitorReferences = [];
            if (typeof item.commonPitfalls === 'string') item.commonPitfalls = [];
            
            // Defend complex nested objects
            if (typeof item.targetAudience === 'string') item.targetAudience = { primaryDemographic: item.targetAudience };
            if (typeof item.marketDemand === 'string') item.marketDemand = { trendStatus: item.marketDemand };
            if (typeof item.marketingHooks === 'string') item.marketingHooks = { blogTitles: [item.marketingHooks] };
            if (typeof item.blogArticle === 'string') item.blogArticle = { content: item.blogArticle };
            if (typeof item.youtubeVideo === 'string') item.youtubeVideo = { url: item.youtubeVideo };
            if (typeof item.aiPromptCommandCenter === 'string') item.aiPromptCommandCenter = { contentStrategyPrompt: item.aiPromptCommandCenter };

            // Sync videoUrl if present in legacy field
            if (item.videoUrl && (!item.youtubeVideo || !item.youtubeVideo.url)) {
                item.youtubeVideo = { ...item.youtubeVideo, url: item.videoUrl };
            }

            return {
                updateOne: {
                    filter: { slug },
                    update: {
                        $set: {
                            ...item,
                            term,
                            slug,
                            lastUpdated: new Date(),
                            isPublished: true,
                            status: 'Published'
                        }
                    },
                    upsert: true
                }
            };
        }).filter(op => op !== null);
        
        if (operations.length === 0) return { success: false, message: "No valid terms found" };

        const result = await GlossaryTerm.bulkWrite(operations);
        revalidatePath('/glossary');
        revalidatePath('/admin/glossary');
        return { 
            success: true, 
            count: result.upsertedCount + result.modifiedCount,
            upserted: result.upsertedCount,
            updated: result.modifiedCount
        };
    } catch (error: any) {
        console.error('Detailed import error:', error);
        return { success: false, message: error.message || "An unknown database error occurred during hydrate" };
    }
}

export async function findDuplicateGlossaryTerms(category?: string) {
    await connectToDatabase();
    const matchStage = category ? { category: category } : {};
    const duplicates = await GlossaryTerm.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: { $toLower: "$term" },
                count: { $sum: 1 },
                terms: { $push: "$$ROOT" }
            }
        },
        { $match: { count: { $gt: 1 } } }
    ]);
    return JSON.parse(JSON.stringify(duplicates));
}

export async function removeDuplicateGlossaryTerms() {
    await connectToDatabase();
    const duplicates = await GlossaryTerm.aggregate([
        {
            $group: {
                _id: { $toLower: "$term" },
                count: { $sum: 1 },
                docs: { $push: { _id: "$_id", createdAt: "$createdAt" } }
            }
        },
        { $match: { count: { $gt: 1 } } }
    ]);

    if (duplicates.length === 0) return { success: true, removed: 0 };

    const idsToDelete: any[] = [];
    for (const group of duplicates) {
        const sorted = group.docs.sort((a: any, b: any) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        for (let i = 1; i < sorted.length; i++) {
            idsToDelete.push(sorted[i]._id);
        }
    }

    if (idsToDelete.length > 0) {
        await GlossaryTerm.deleteMany({ _id: { $in: idsToDelete } });
    }

    revalidatePath('/admin/glossary');
    return { success: true, removed: idsToDelete.length };
}

export async function scrubGlossaryUrls() {
    await connectToDatabase();
    const terms = await GlossaryTerm.find({});
    let updatedCount = 0;

    const cleanUrl = (url: any) => {
        if (!url || typeof url !== 'string') return "";
        const u = url.trim().toLowerCase();
        if (
            u === "" || u === "#" || u.includes("example.com") || u.includes("yoursite.com") || 
            u.includes("domain.com") || u.includes("insert_url") || u === "http://" || u === "https://"
        ) return "";
        return url.trim();
    };

    for (const term of terms) {
        let changed = false;
        
        // Scrub object array fields
        const objectFields = ['amazonProducts', 'websitesRanking', 'podcastsRanking', 'competitorReferences'];
        for (const field of objectFields) {
            const array = (term as any)[field];
            if (Array.isArray(array)) {
                (term as any)[field] = array.map((item: any) => {
                    const cleaned = cleanUrl(item.url);
                    if (item.url !== cleaned) { changed = true; return { ...item, url: cleaned }; }
                    return item;
                });
            }
        }
        
        // Scrub single fields
        const singleFields = ['videoUrl', 'youtubeVideo.url'];
        if (term.videoUrl !== cleanUrl(term.videoUrl)) { term.videoUrl = cleanUrl(term.videoUrl); changed = true; }
        if (term.youtubeVideo?.url !== cleanUrl(term.youtubeVideo?.url)) { 
            term.youtubeVideo.url = cleanUrl(term.youtubeVideo.url); 
            changed = true; 
        }

        if (changed) { await term.save(); updatedCount++; }
    }

    revalidatePath('/admin/glossary');
    return { success: true, updatedCount };
}

export async function backfillAffiliateTags(affiliateId: string = "weightlo0f57d-20") {
    await connectToDatabase();
    const terms = await GlossaryTerm.find({ 
        $or: [
            { amazonProducts: { $exists: true, $ne: [] } },
            { competitorReferences: { $exists: true, $ne: [] } }
        ]
    });

    let updatedCount = 0;
    for (const term of terms) {
        let changed = false;
        const updateLinks = (array: any[]) => {
            if (!Array.isArray(array)) return array;
            return array.map(item => {
                if (item.url && item.url.includes("amazon.com") && !item.url.includes(`tag=${affiliateId}`)) {
                    const sep = item.url.includes("?") ? "&" : "?";
                    item.url = `${item.url}${sep}tag=${affiliateId}`;
                    changed = true;
                }
                return item;
            });
        };

        term.amazonProducts = updateLinks(term.amazonProducts);
        term.competitorReferences = updateLinks(term.competitorReferences);

        if (changed) { await term.save(); updatedCount++; }
    }

    revalidatePath('/admin/glossary');
    return { success: true, updatedCount };
}

export async function verifyYouTubeLinksBatch() {
    await connectToDatabase();
    const terms = await GlossaryTerm.find({ 
        $or: [{ "youtubeVideo.url": { $ne: "" } }, { "videoUrl": { $ne: "" } }] 
    });
    
    const broken: any[] = [];
    for (const term of terms) {
        const url = term.youtubeVideo?.url || term.videoUrl;
        if (!url) continue;
        
        try {
            const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
            if (res.status === 404 || res.status === 400) {
                broken.push({ id: term._id.toString(), term: term.term, url });
            }
        } catch (e) {
            // Network error or timeout, skip for now
        }
    }
    
    return { success: true, broken };
}

export async function getGlossaryHealthData() {
    await connectToDatabase();
    const terms = await GlossaryTerm.find({}).lean();
    
    const categories = [...new Set(terms.map((t: any) => t.category).filter(Boolean))];
    const healthData = categories.map(cat => {
        const catTerms = terms.filter((t: any) => t.category === cat);
        const total = catTerms.length;
        
        const withVideo = catTerms.filter((t: any) => t.youtubeVideo?.url || t.videoUrl).length;
        const withProducts = catTerms.filter((t: any) => (t.amazonProducts && t.amazonProducts.length > 0) || (t.competitorReferences && t.competitorReferences.length > 0)).length;
        const withArticle = catTerms.filter((t: any) => t.blogArticle?.content && t.blogArticle.content.length > 500).length;
        const withAiPrompts = catTerms.filter((t: any) => t.aiPromptCommandCenter?.productIdeaPrompt).length;

        return {
            category: cat,
            count: total,
            videoProgress: Math.round((withVideo / total) * 100),
            productProgress: Math.round((withProducts / total) * 100),
            articleProgress: Math.round((withArticle / total) * 100),
            aiProgress: Math.round((withAiPrompts / total) * 100),
            overallCompletion: Math.round(((withVideo + withProducts + withArticle + withAiPrompts) / (total * 4)) * 100)
        };
    });

    return { 
        healthData: healthData.sort((a, b) => b.overallCompletion - a.overallCompletion),
        totalTerms: terms.length
    };
}
export async function runGlossaryAudit(type: 'video' | 'affiliate' | 'article') {
    await connectToDatabase();
    let query: any = {};
    if (type === 'video') {
        query = { 
            $or: [
                { "youtubeVideo.url": "" }, 
                { "youtubeVideo.url": { $exists: false } },
                { "videoUrl": "" },
                { "videoUrl": { $exists: false } }
            ] 
        };
    } else if (type === 'affiliate') {
        query = { 
            $or: [
                { amazonProducts: { $size: 0 } },
                { amazonProducts: { $exists: false } }
            ] 
        };
    } else if (type === 'article') {
        query = { 
            $or: [
                { "blogContent.body": "" },
                { "blogContent.body": { $exists: false } }
            ] 
        };
    }
    const results = await GlossaryTerm.find(query, { _id: 1 }).lean();
    return results.map((r: any) => ({ ...r, _id: r._id.toString() }));
}
