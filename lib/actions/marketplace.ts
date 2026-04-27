'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const CSV_PATH = path.join(process.cwd(), 'docs', 'billionairebooks.csv');

export async function getAmazonCsvContent() {
    try {
        if (!fs.existsSync(CSV_PATH)) return "";
        return fs.readFileSync(CSV_PATH, 'utf8');
    } catch (err) {
        console.error("Failed to read CSV:", err);
        return "";
    }
}

export async function updateAmazonCsvContent(content: string) {
    try {
        const docsDir = path.join(process.cwd(), 'docs');
        if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, { recursive: true });
        }
        
        // Basic validation: ensure it's not empty and looks like CSV
        if (!content || content.length < 10) {
            return { success: false, error: "Content is too short or empty" };
        }

        fs.writeFileSync(CSV_PATH, content, 'utf8');
        
        // Revalidate relevant paths
        revalidatePath('/glossary');
        revalidatePath('/admin');
        
        return { success: true };
    } catch (err) {
        console.error("Failed to update CSV:", err);
        return { success: false, error: "Failed to save file. Ensure the directory is writable." };
    }
}
