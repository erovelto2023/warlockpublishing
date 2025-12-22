"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPenName, updatePenName } from "@/lib/actions/pen-name.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    bio: z.string().optional(),
    avatarUrl: z.string().url().optional().or(z.literal("")),
    coverImage: z.string().url().optional().or(z.literal("")),
    tagline: z.string().optional(),
    newsletterDescription: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
    email: z.string().email().optional().or(z.literal("")),
});

interface PenNameFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export function PenNameForm({ initialData, isEditing = false }: PenNameFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            bio: initialData?.bio || "",
            avatarUrl: initialData?.avatarUrl || "",
            coverImage: initialData?.coverImage || "",
            tagline: initialData?.tagline || "",
            newsletterDescription: initialData?.newsletterDescription || "",
            twitter: initialData?.socialLinks?.twitter || "",
            instagram: initialData?.socialLinks?.instagram || "",
            website: initialData?.socialLinks?.website || "",
            email: initialData?.socialLinks?.email || "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
            const data = {
                name: values.name,
                bio: values.bio,
                avatarUrl: values.avatarUrl,
                coverImage: values.coverImage,
                tagline: values.tagline,
                newsletterDescription: values.newsletterDescription,
                socialLinks: {
                    twitter: values.twitter,
                    instagram: values.instagram,
                    website: values.website,
                    email: values.email,
                },
            };

            if (isEditing && initialData?._id) {
                await updatePenName(initialData._id, data);
                toast({
                    title: "Success",
                    description: "Pen name updated successfully.",
                });
            } else {
                await createPenName(data);
                toast({
                    title: "Success",
                    description: "Pen name created successfully.",
                });
            }
            router.push("/admin/pen-names");
            router.refresh();
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
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pen Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Elara Vance" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Short biography..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="avatarUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Avatar URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="coverImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cover Image URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Author Page Settings</h3>
                    <FormField
                        control={form.control}
                        name="tagline"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tagline</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Stories that linger long after the last page is turned." {...field} />
                                </FormControl>
                                <FormDescription>Displayed prominently on your author page.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newsletterDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Newsletter Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Join readers receiving early access..." {...field} />
                                </FormControl>
                                <FormDescription>Text inviting readers to join your mailing list.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="contact@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="twitter"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Twitter Handle</FormLabel>
                                    <FormControl>
                                        <Input placeholder="@handle" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="instagram"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instagram Handle</FormLabel>
                                    <FormControl>
                                        <Input placeholder="@handle" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Pen Name" : "Create Pen Name")}
                </Button>
            </form>
        </Form>
    );
}
