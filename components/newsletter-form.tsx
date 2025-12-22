"use client";

import { useState } from "react";
import { subscribeToMailingList } from "@/lib/actions/subscriber.actions";
import { useToast } from "@/components/ui/use-toast";

interface NewsletterFormProps {
    penNameId: string;
}

export function NewsletterForm({ penNameId }: NewsletterFormProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const result = await subscribeToMailingList(email, penNameId);
            if (result.success) {
                toast({
                    title: "Success",
                    description: result.message,
                });
                setEmail("");
            } else {
                toast({
                    title: "Error",
                    description: result.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 justify-center max-w-md mx-auto pt-4">
            <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-stone-800 border border-stone-700 px-6 py-4 text-stone-200 focus:ring-1 focus:ring-stone-500 outline-none flex-1 placeholder-stone-600"
                required
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-stone-100 text-stone-900 px-8 py-4 font-bold font-sans tracking-wide hover:bg-white transition-colors disabled:opacity-70"
            >
                {loading ? "JOINING..." : "JOIN"}
            </button>
        </form>
    );
}
