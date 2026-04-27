import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: false },
    category: { type: String, required: false },
    niche: { type: String, required: false },
    productType: { type: String, default: 'ebook' }, // ebook, software, amazon, course
    pageType: { type: String, default: 'sales' }, // sales, upsell, downsell, thankyou
    templateId: { type: String }, // ID of the selected template
    contentData: { type: mongoose.Schema.Types.Mixed }, // JSON data for the template blocks/content
    format: { type: String, required: false }, // PDF, DOCX, etc.
    grooveSellId: { type: String }, // For tracking code
    grooveSellEmbed: { type: String }, // Embed code
    amazonLink: { type: String },
    isAmazonProduct: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
    isFeaturedInRotation: { type: Boolean, default: true },
    externalUrl: { type: String },
    licenseType: { type: String }, // PLR, MRR, etc.
    htmlContent: { type: String }, // Custom HTML for the page
    penNameId: { type: mongoose.Schema.Types.ObjectId, ref: "PenName" },
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    userId: { type: String, required: true }, // Clerk User ID of the creator/admin
    slug: { type: String, unique: true, sparse: true },
}, { timestamps: true });

ProductSchema.index({ isHidden: 1 });
ProductSchema.index({ isFeaturedInRotation: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ penNameId: 1 });
ProductSchema.index({ productType: 1 });

// Force re-compilation of the model if it already exists to pick up schema changes
const Product = models.Product || model('Product', ProductSchema);

export default Product;
