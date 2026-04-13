import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema({
    email: { type: String, required: true },
    penNameId: { type: mongoose.Schema.Types.ObjectId, ref: "PenName" },
    userId: { type: String }, // The admin user who owns the pen name
    ipAddress: { type: String },
    userAgent: { type: String },
    signupUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
});

// Forced re-registration to pick up schema changes in development
if (mongoose.models && mongoose.models.Subscriber) {
    delete mongoose.models.Subscriber;
}

export default mongoose.model("Subscriber", SubscriberSchema);
