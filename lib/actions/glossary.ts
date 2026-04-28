'use server';

import { connectToDatabase } from '@/lib/db';
import GlossaryTerm from '@/lib/models/GlossaryTerm';
import { revalidatePath } from 'next/cache';
import { GlossaryTerm as GlossaryTermType } from '@/lib/types';
import { AMAZON_AFFILIATE_ID, formatAmazonLink } from '@/lib/utils';
import { parseAmazonCsv, AmazonProduct } from '@/lib/csv-parser';
import MarketplaceProduct from '@/lib/models/MarketplaceProduct';

export async function getAmazonProductsFromCsv(query: string, limit: number = 20, preferredCategory: string = "", targetAsins: string[] = []): Promise<AmazonProduct[]> {
    try {
        await connectToDatabase();
        const queryClean = (query || "").replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape regex
        const queryLower = (query || "").toLowerCase();
        const categoryLower = (preferredCategory || "").toLowerCase();

        // NICHE DETECTION (Proactive Querying)
        const isColoringTerm = queryLower.includes('coloring') || categoryLower.includes('crafts') || categoryLower.includes('coloring') || queryLower.includes('aesthetic');
        const isRomanceTerm = queryLower.includes('romance') || queryLower.includes('billionaire') || categoryLower.includes('romance') || queryLower.includes('depravity') || queryLower.includes('mafia');

        const nicheQuery = isColoringTerm ? 'coloring' : (isRomanceTerm ? 'romance' : '');

        // 1. Primary Fetch: Strictly filter by niche first to prevent contamination
        let dbQuery: any = {
            $or: [
                { title: { $regex: queryClean, $options: 'i' } },
                { keyword: { $regex: queryClean, $options: 'i' } }
            ]
        };

        if (nicheQuery) {
            dbQuery = {
                $and: [
                    dbQuery,
                    { 
                        $or: [
                            { category: { $regex: nicheQuery, $options: 'i' } },
                            { keyword: { $regex: nicheQuery, $options: 'i' } },
                            { title: { $regex: nicheQuery, $options: 'i' } }
                        ]
                    }
                ]
            };
        }

        const totalCandidates = await MarketplaceProduct.countDocuments(dbQuery);
        const skip = totalCandidates > 20 ? Math.floor(Math.random() * Math.min(totalCandidates - 20, 100)) : 0;

        let products = await MarketplaceProduct.find(dbQuery)
            .skip(skip)
            .limit(100);

        // 2. Fallback: If no direct matches, pull by niche alone
        if (products.length === 0 && nicheQuery) {
            products = await MarketplaceProduct.find({
                $or: [
                    { category: { $regex: nicheQuery, $options: 'i' } },
                    { keyword: { $regex: nicheQuery, $options: 'i' } }
                ]
            })
            .skip(Math.floor(Math.random() * 20))
            .limit(100);
        }

        // 3. Final Fallback: Recent items
        if (products.length === 0) {
            products = await MarketplaceProduct.find().sort({ lastSynced: -1 }).limit(limit);
        }

        if (products.length === 0) return [];

        const scoredMatches = products.map(p => {
            const product = p.toObject();
            let score = 0;
            const titleLower = product.title.toLowerCase();
            const keywordLower = (product.keyword || "").toLowerCase();

            if (targetAsins.includes(product.asin)) score += 1000;
            score += 50;

            if (keywordLower === queryLower) score += 300;
            else if (keywordLower.includes(queryLower) || queryLower.includes(keywordLower)) score += 150;
            if (titleLower.includes(queryLower)) score += 100;
            
            return { ...product, score };
        });

        return scoredMatches
            .sort((a, b) => b.score - a.score)
            .sort(() => Math.random() - 0.5) // Shuffle for variety
            .slice(0, 100);

    } catch (err) {
        console.error("Marketplace DB query failed:", err);
        return [];
    }
}

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
function serializeTerm(term: any): GlossaryTermType | null {
    if (!term) return null;
    return JSON.parse(JSON.stringify(term));
}

// Normalize any YouTube URL format to a standard watch URL
function normalizeYouTubeUrl(url: string): string | null {
    if (!url || typeof url !== 'string') return null;
    const u = url.trim();
    // Already a full watch URL
    if (u.includes('youtube.com/watch')) return u;
    // youtu.be short link
    const shortMatch = u.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return `https://www.youtube.com/watch?v=${shortMatch[1]}`;
    // youtube.com/embed/ID
    const embedMatch = u.match(/youtube\.com\/embed\/([^?&]+)/);
    if (embedMatch) return `https://www.youtube.com/watch?v=${embedMatch[1]}`;
    // Raw video ID (11 alphanumeric chars)
    if (/^[a-zA-Z0-9_-]{11}$/.test(u)) return `https://www.youtube.com/watch?v=${u}`;
    // Unknown format – return as-is
    return u;
}

export async function trackGlossaryView(slug: string) {
    try {
        await connectToDatabase();
        await GlossaryTerm.findOneAndUpdate({ slug }, { $inc: { viewCount: 1 } });
    } catch {
        // Non-critical – don't surface tracking errors to the user
    }
}

export async function createGlossaryTerm(data: Partial<GlossaryTermType>) {
    await connectToDatabase();
    
    if (!data.term) throw new Error("Term is required");
    let slug = data.slug || slugify(data.term);
    const existingTerms = await GlossaryTerm.find({}, { slug: 1 }).lean();
    const existingSlugs = existingTerms.map((t: any) => t.slug).filter(Boolean);
    slug = await makeUniqueSlug(slug, existingSlugs);

    // Auto-format Amazon links
    const termData = { ...data };
    if (termData.amazonProducts) termData.amazonProducts = termData.amazonProducts.map((p: any) => ({ ...p, url: formatAmazonLink(p.url) }));
    if (termData.competitorReferences) termData.competitorReferences = termData.competitorReferences.map((p: any) => ({ ...p, url: formatAmazonLink(p.url) }));
    if (termData.referenceWebsites) termData.referenceWebsites = termData.referenceWebsites.map((p: any) => ({ ...p, url: formatAmazonLink(p.url) }));
    if (termData.videoUrl) termData.videoUrl = normalizeYouTubeUrl(termData.videoUrl) || termData.videoUrl;

    const newTerm = await GlossaryTerm.create({
        ...termData,
        slug,
    });
    revalidatePath('/glossary');
    revalidatePath('/admin/glossary');
    return serializeTerm(newTerm);
}

export async function updateGlossaryTerm(id: string, data: Partial<GlossaryTermType>) {
    await connectToDatabase();
    
    // If term changed, we might want to update slug, but usually better to keep it for SEO
    // unless explicitly changed in data.
    
    // Auto-format Amazon links
    const termData = { ...data };
    if (termData.amazonProducts) termData.amazonProducts = termData.amazonProducts.map((p: any) => ({ ...p, url: formatAmazonLink(p.url) }));
    if (termData.competitorReferences) termData.competitorReferences = termData.competitorReferences.map((p: any) => ({ ...p, url: formatAmazonLink(p.url) }));
    if (termData.referenceWebsites) termData.referenceWebsites = termData.referenceWebsites.map((p: any) => ({ ...p, url: formatAmazonLink(p.url) }));
    if (termData.videoUrl) termData.videoUrl = normalizeYouTubeUrl(termData.videoUrl) || termData.videoUrl;

    const updatedTerm = await GlossaryTerm.findByIdAndUpdate(id, {
        ...termData,
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

export async function bulkDeleteGlossaryTerms(ids: string[]) {
    await connectToDatabase();
    await GlossaryTerm.deleteMany({ _id: { $in: ids } });
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
            
            // Masterclass Defense
            if (item.masterclass && typeof item.masterclass === 'object') {
                if (typeof item.masterclass.threeActStructure === 'string') {
                    item.masterclass.threeActStructure = { act1: item.masterclass.threeActStructure };
                }
                if (!Array.isArray(item.masterclass.profitBeats)) item.masterclass.profitBeats = [];
                if (!Array.isArray(item.masterclass.characterArchetypes)) item.masterclass.characterArchetypes = [];
                if (!Array.isArray(item.masterclass.profitabilityChecklist)) item.masterclass.profitabilityChecklist = [];
            }
            
            // --- STREAMLINED SCHEMA MAPPING (Choice A/B) ---
            if (item.marketIntel) {
                item.opportunityScore = item.marketIntel.opportunityScore ?? item.opportunityScore;
                item.geoTagging = item.marketIntel.geoTrends || item.geoTagging;
                item.modernUsage = item.marketIntel.modernUsage || item.modernUsage;
            }
            if (item.genreAnatomy) {
                item.writingAspect = item.genreAnatomy.writingAspect || item.writingAspect;
                item.anatomy = {
                    ...item.anatomy,
                    specialistPerspective: item.genreAnatomy.specialistPerspective || item.anatomy?.specialistPerspective
                };
                if (item.genreAnatomy.pitfalls && Array.isArray(item.genreAnatomy.pitfalls)) {
                    item.commonPitfalls = item.genreAnatomy.pitfalls.map((p: any) => ({
                        pitfall: p.challenge,
                        whyItHappens: "",
                        howToAvoid: p.solution
                    }));
                }
            }
            if (item.masterclass && typeof item.masterclass === 'object') {
                if (item.masterclass.structure) {
                    item.masterclass.threeActStructure = item.masterclass.structure;
                }
                if (item.masterclass.archetypes && typeof item.masterclass.archetypes === 'object') {
                    item.masterclass.characterArchetypes = [
                        { role: "The Alpha / Specialist", description: item.masterclass.archetypes.alpha || "" },
                        { role: "The Relatable Proxy", description: item.masterclass.archetypes.proxy || "" },
                        { role: "The Foil", description: item.masterclass.archetypes.foil || "" }
                    ];
                }
            }
            if (item.publishingTech) {
                item.masterclass = {
                    ...(item.masterclass || {}),
                    technicalComponents: {
                        powerTitle: item.publishingTech.powerTitle,
                        tropes: item.publishingTech.essentialTropes,
                        hook: item.publishingTech.blurbHook
                    }
                };
            }
            if (item.aiCommandCenter) {
                item.aiPromptCommandCenter = {
                    ...(item.aiPromptCommandCenter || {}),
                    productIdeaPrompt: item.aiCommandCenter.scenePrompt,
                    contentStrategyPrompt: item.aiCommandCenter.marketingPrompt,
                    aiImagePrompt: item.aiCommandCenter.visualPrompt
                };
            }
            // ----------------------------------------------

            if (typeof item.aiPromptCommandCenter === 'string') item.aiPromptCommandCenter = { contentStrategyPrompt: item.aiPromptCommandCenter };

            // Defend Array-to-String Cast Errors (for fields defined as String but sometimes output as Array by GPT)
            const stringFields = [
                'affirmations', 'visualizations', 'guidedPractice', 'beginnerExplanation', 
                'advancedPerspective', 'misconceptions', 'warningsOrNotes', 'audioOrVideoResources',
                'whyItMatters', 'expertOpinion', 'historicalContext', 'originalUsage', 
                'currentUsage', 'expandedDefinition', 'simpleDefinition', 'technicalDefinition'
            ];
            stringFields.forEach(field => {
                if (Array.isArray(item[field])) {
                    item[field] = item[field].join('\n');
                }
            });

            // Sync videoUrl if present in legacy field
            if (item.videoUrl && (!item.youtubeVideo || !item.youtubeVideo.url)) {
                item.youtubeVideo = { ...item.youtubeVideo, url: item.videoUrl };
            }

            // Normalize Links for Optimization
            if (item.youtubeVideo?.url) {
                item.youtubeVideo.url = normalizeYouTubeUrl(item.youtubeVideo.url) || item.youtubeVideo.url;
            }
            if (item.videoUrl) {
                item.videoUrl = normalizeYouTubeUrl(item.videoUrl) || item.videoUrl;
            }
            if (Array.isArray(item.amazonProducts)) {
                item.amazonProducts = item.amazonProducts.map((p: any) => ({
                    ...p,
                    url: formatAmazonLink(p.url || '')
                }));
            }
            if (Array.isArray(item.competitorReferences)) {
                item.competitorReferences = item.competitorReferences.map((p: any) => ({
                    ...p,
                    url: formatAmazonLink(p.url || '')
                }));
            }

            // --- Phase-Specific Schema Defense & Normalization ---
            if (typeof item.anatomy === 'string') item.anatomy = { structuralBreakdown: item.anatomy };
            if (typeof item.directoryCategories === 'string') item.directoryCategories = [];
            if (typeof item.buyersChecklist === 'string') item.buyersChecklist = [item.buyersChecklist];
            
            // Normalize commonMyths (force to array of objects)
            if (Array.isArray(item.commonMyths)) {
                item.commonMyths = item.commonMyths.map((m: any) => {
                    if (typeof m === 'string') return { myth: m, fact: "Refer to the guide for details." };
                    return m;
                });
            } else if (typeof item.commonMyths === 'string') {
                item.commonMyths = [{ myth: item.commonMyths, fact: "Refer to the guide for details." }];
            }

            // Normalize directoryCategories and map asins -> productIds
            if (Array.isArray(item.directoryCategories)) {
                item.directoryCategories = item.directoryCategories.map((cat: any) => ({
                    ...cat,
                    productIds: cat.productIds || cat.asins || []
                }));
            }
            
            // Auto-group products into directory categories if not present
            if (!item.directoryCategories || item.directoryCategories.length === 0) {
                const asinList = (item.amazonProducts || []).map((p: any) => p.asin).filter(Boolean).sort(() => Math.random() - 0.5);
                if (asinList.length > 0) {
                    item.directoryCategories = [{
                        name: "Recommended Resources",
                        description: `Curated assets for ${term}`,
                        productIds: asinList
                    }];
                }
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

export async function backfillAffiliateTags(affiliateId: string = AMAZON_AFFILIATE_ID) {
    await connectToDatabase();
    const terms = await GlossaryTerm.find({ 
        $or: [
            { amazonProducts: { $exists: true, $ne: [] } },
            { competitorReferences: { $exists: true, $ne: [] } },
            { referenceWebsites: { $exists: true, $ne: [] } }
        ]
    });

    let updatedCount = 0;
    for (const term of terms) {
        let changed = false;
        const updateLinks = (array: any[]) => {
            if (!Array.isArray(array)) return array;
            return array.map(item => {
                const cleaned = formatAmazonLink(item.url, affiliateId);
                if (item.url !== cleaned) {
                    item.url = cleaned;
                    changed = true;
                }
                return item;
            });
        };

        term.amazonProducts = updateLinks(term.amazonProducts);
        term.competitorReferences = updateLinks(term.competitorReferences);
        term.referenceWebsites = updateLinks(term.referenceWebsites);

        if (changed) { await term.save(); updatedCount++; }
    }

    revalidatePath('/admin/glossary');
    return { success: true, updatedCount };
}

// Helper to find high-quality YouTube videos
export async function searchYouTubeForTerm(term: string, category: string = ""): Promise<{ url: string, title: string, channel: string } | null> {
    try {
        // High-intent tutorial/masterclass query
        const query = `${term} ${category} masterclass strategy tutorial explained`.trim();
        const searchRes = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });
        const html = await searchRes.text();
        
        const match = html.match(/ytInitialData\s*=\s*({.+?})(?:;|<\/script)/) || 
                      html.match(/window\["ytInitialData"\]\s*=\s*({.+?});/);
        
        if (!match) return null;

        const data = JSON.parse(match[1]);
        const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
        
        // Try top 10 results to find a valid one
        let checkedCount = 0;
        for (const item of contents) {
            if (item.videoRenderer && checkedCount < 10) {
                checkedCount++;
                const video = item.videoRenderer;
                const videoId = video.videoId;
                const title = video.title?.runs?.[0]?.text || '';
                const channel = video.ownerText?.runs?.[0]?.text || '';
                const lengthText = video.lengthText?.simpleText || "";

                // CRITICAL FILTER: Absolutely avoid Shorts
                if (title.toLowerCase().includes('#shorts') || title.toLowerCase().includes('short')) continue;
                
                // FILTER: Duration check (prefer 3+ minutes for "Mastery" feel)
                if (lengthText.includes(':')) {
                    const parts = lengthText.split(':');
                    if (parts.length === 2) {
                        const minutes = parseInt(parts[0]);
                        if (minutes < 2) continue; // Too short for a deep dive
                    }
                    if (parts.length < 2) continue; // Invalid format
                } else {
                    continue; 
                }

                const newUrl = `https://www.youtube.com/watch?v=${videoId}`;
                
                // VALIDATION: Check if video is embeddable and public
                try {
                    const verifyRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(newUrl)}&format=json`);
                    if (verifyRes.status === 200) {
                        const oembedData = await verifyRes.json();
                        // oembed title check for "Deleted" or "Private"
                        if (oembedData.title === "Deleted video" || oembedData.title === "Private video") continue;
                        
                        return { url: newUrl, title, channel };
                    }
                } catch (vErr) {
                    continue;
                }
            }
        }
    } catch (e) {
        console.error('YouTube robust search failed:', e);
    }
    return null;
}

export async function verifyYouTubeLinksBatch(autoFix: boolean = false) {
    await connectToDatabase();
    const terms = await GlossaryTerm.find({ 
        $or: [{ "youtubeVideo.url": { $ne: "" } }, { "videoUrl": { $ne: "" } }] 
    });
    
    const broken: any[] = [];
    let updatedCount = 0;

    for (const term of terms) {
        const rawUrl = term.youtubeVideo?.url || term.videoUrl;
        if (!rawUrl) continue;
        
        const url = normalizeYouTubeUrl(rawUrl);
        if (!url) continue;

        try {
            const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
            if (res.status !== 200) {
                let fixed = false;
                
                if (autoFix) {
                    const bestVideo = await searchYouTubeForTerm(term.term, term.category);
                    if (bestVideo) {
                        term.videoUrl = bestVideo.url;
                        term.youtubeVideo = {
                            ...(term.youtubeVideo?.toObject?.() || term.youtubeVideo || {}),
                            url: bestVideo.url,
                            title: bestVideo.title,
                            channel: bestVideo.channel
                        };
                        term.markModified('youtubeVideo');
                        await term.save();
                        fixed = true;
                        updatedCount++;
                    }
                }
                
                if (!fixed) {
                    broken.push({ id: term._id.toString(), term: term.term, url: rawUrl, status: res.status });
                }
            }
        } catch (e) { }
    }
    
    if (autoFix && updatedCount > 0) {
        revalidatePath('/admin/glossary');
        revalidatePath('/glossary');
    }
    
    return { success: true, updatedCount, broken: broken.length > 0 ? broken : undefined };
}

export async function seedSampleGlossaryData() {
    await connectToDatabase();
    
    // Sample terms from the seed script to allow quick hydration on live
    const sampleTerms = [
        {
            term: "Billionaire Revenge",
            shortDefinition: "A high-stakes romance trope where a wealthy protagonist uses their resources to avenge a past wrong, only to find love in the process.",
            definition: "The Billionaire Revenge trope centers on a protagonist who has been marginalized, betrayed, or ruined in the past. Having built an empire, they return to systematically dismantle their enemies. The emotional core of the story is the conflict between their cold mission for justice and the warmth of a new, unexpected relationship—often with someone connected to their past or their enemy.",
            category: "Writing & Tropes",
            isPublished: true,
            status: 'Seeded'
        },
        {
            term: "Craved by the Billionaire",
            shortDefinition: "The 'Obsession' trope where a powerful figure focuses their entire attention on a single, often unsuspecting, individual.",
            definition: "This niche focuses on the 'Insta-Love' or 'Deep Obsession' dynamics. The billionaire uses their influence to protect, provide for, and ultimately win over the object of their affection. It often borders on the 'Stalker' or 'Dark' romance sub-genres but remains firmly in the 'Protector' fantasy.",
            category: "Writing & Tropes",
            isPublished: true,
            status: 'Seeded'
        },
        {
            term: "Billionaire Husband Chapter 1",
            shortDefinition: "Specific hook strategy for viral billionaire romance series, optimized for cliffhangers and immediate reader retention.",
            definition: "A 'Chapter 1' strategy specifically engineered for platforms like Wattpad, Radish, or Kindle Vella. It requires an immediate world-building establishment where the billionaire's power is demonstrated through an interaction with the protagonist—usually involving a contract, a debt, or a chance encounter in a high-status location.",
            category: "Writing & Tropes",
            isPublished: true,
            status: 'Seeded'
        }
    ];

    let seededCount = 0;
    for (const term of sampleTerms) {
        const baseSlug = term.term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        await GlossaryTerm.findOneAndUpdate(
            { slug: baseSlug },
            { ...term, slug: baseSlug, lastUpdated: new Date() },
            { upsert: true, new: true }
        );
        seededCount++;
    }
    
    revalidatePath('/glossary');
    revalidatePath('/admin/glossary');
    return { success: true, seededCount };
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
    
    if (type === 'video') {
        const missingVideoTerms = await GlossaryTerm.find({ 
            $or: [
                { "youtubeVideo.url": "" }, 
                { "youtubeVideo.url": { $exists: false } },
                { "videoUrl": "" },
                { "videoUrl": { $exists: false } }
            ] 
        });

        const unwatchableTerms = await verifyYouTubeLinksBatch(false).then(res => res.broken || []);
        const totalTermsToFix = [...missingVideoTerms, ...unwatchableTerms];
        
        const stillMissing = [];
        
        for (const termObj of totalTermsToFix) {
            const term = typeof termObj.term === 'string' ? await GlossaryTerm.findById(termObj.id || termObj._id) : termObj;
            if (!term) continue;

            const bestVideo = await searchYouTubeForTerm(term.term, term.category);
            if (bestVideo) {
                term.videoUrl = bestVideo.url;
                term.youtubeVideo = {
                    ...(term.youtubeVideo || {}),
                    url: bestVideo.url,
                    title: bestVideo.title,
                    channel: bestVideo.channel
                };
                
                term.markModified('youtubeVideo');
                await term.save();
            } else {
                stillMissing.push({ _id: term._id.toString(), term: term.term });
            }
        }
        
        if (missingVideoTerms.length > stillMissing.length) {
            revalidatePath('/admin/glossary');
            revalidatePath('/glossary');
        }
        
        return stillMissing;
    }
    
    let query: any = {};
    if (type === 'affiliate') {
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

/**
 * PERSISTENT MARKETPLACE SYNC
 * Call this to hydrate MongoDB from the CSV files
 */
export async function syncMarketplaceData() {
    try {
        await connectToDatabase();
        console.log("Starting Marketplace Sync...");
        const csvProducts = await parseAmazonCsv();
        
        if (csvProducts.length === 0) {
            console.warn("No products found in CSVs to sync.");
            return { success: false, count: 0 };
        }

        let syncedCount = 0;
        for (const p of csvProducts) {
            if (!p.asin) continue;
            
            await MarketplaceProduct.findOneAndUpdate(
                { asin: p.asin },
                {
                    title: p.title,
                    keyword: p.keyword,
                    shortUrl: p.shortUrl,
                    fullUrl: p.fullUrl,
                    imageUrl: p.imageUrl,
                    rank: p.rank,
                    store: p.store,
                    category: p.category,
                    rating: p.rating,
                    reviewCount: p.reviewCount,
                    price: p.price,
                    lastSynced: new Date()
                },
                { upsert: true, new: true }
            );
            syncedCount++;
        }

        console.log(`Successfully synced ${syncedCount} marketplace products.`);
        return { success: true, count: syncedCount };
    } catch (err) {
        console.error("Marketplace sync failed:", err);
        return { success: false, error: String(err) };
    }
}
