import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { getPostById } from "@/lib/actions/blog";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        redirect("/");
    }

    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div className="container py-10 px-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/blog">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Edit Post</h1>
            </div>

            <div className="rounded-md border p-6 bg-card">
                <BlogPostForm post={post} />
            </div>
        </div>
    );
}
