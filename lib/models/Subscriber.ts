import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema({
    email: { type: String, required: true },
    penNameId: { type: mongoose.Schema.Types.ObjectId, ref: "PenName", required: true },
    userId: { type: String, required: true }, // The admin user who owns the pen name
    createdAt: { type: Date, default: Date.now },
});

// Compound index to ensure unique email per pen name
SubscriberSchema.index({ email: 1, penNameId: 1 }, { unique: true });

export default mongoose.models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);
