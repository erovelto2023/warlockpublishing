import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export default async function NewBlogPostPage() {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        redirect("/");
    }

    return (
        <div className="container py-10 px-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/blog">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Create New Post</h1>
            </div>

            <div className="rounded-md border p-6 bg-card">
                <BlogPostForm />
            </div>
        </div>
    );
}
