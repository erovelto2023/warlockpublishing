'use server';

import { connectToDatabase } from '@/lib/db';
import CallToAction from '@/lib/models/CallToAction';
import { revalidatePath } from 'next/cache';

function serialize(data: any) {
    return JSON.parse(JSON.stringify(data));
}

export async function getCallToActions() {
    try {
        await connectToDatabase();
        const ctas = await CallToAction.find().sort({ createdAt: -1 });
        return serialize(ctas);
    } catch (error) {
        console.error("Error fetching CTAs:", error);
        return [];
    }
}

export async function getCallToActionById(id: string) {
    try {
        await connectToDatabase();
        const cta = await CallToAction.findById(id);
        return cta ? serialize(cta) : null;
    } catch (error) {
        console.error("Error fetching CTA by ID:", error);
        return null;
    }
}

export async function createCallToAction(data: any) {
    try {
        await connectToDatabase();
        const cta = await CallToAction.create(data);
        revalidatePath('/admin/cta-builder');
        revalidatePath('/admin');
        revalidatePath('/glossary');
        return serialize(cta);
    } catch (error) {
        console.error("Error creating CTA:", error);
        throw error;
    }
}

export async function updateCallToAction(id: string, data: any) {
    try {
        await connectToDatabase();
        const cta = await CallToAction.findByIdAndUpdate(id, data, { new: true });
        revalidatePath('/admin/cta-builder');
        revalidatePath('/admin');
        revalidatePath('/glossary');
        return serialize(cta);
    } catch (error) {
        console.error("Error updating CTA:", error);
        throw error;
    }
}

export async function deleteCallToAction(id: string) {
    try {
        await connectToDatabase();
        await CallToAction.findByIdAndDelete(id);
        revalidatePath('/admin/cta-builder');
        revalidatePath('/admin');
        revalidatePath('/glossary');
        return { success: true };
    } catch (error) {
        console.error("Error deleting CTA:", error);
        throw error;
    }
}
