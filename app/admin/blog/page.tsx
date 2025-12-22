import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/actions/blog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, ArrowLeft } from "lucide-react";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        redirect("/");
    }

    const { page } = await searchParams;
    const currentPage = Number(page) || 1;
    const limit = 10;
    const { posts, totalPages } = await getPosts({ limit, page: currentPage });

    return (
        <div className="container py-10 px-4">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
                <div className="ml-auto">
                    <Link href="/admin/blog/new">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> New Post
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="rounded-md border mb-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Published At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <p>No posts found.</p>
                                        <Link href="/admin/blog/new">
                                            <Button variant="outline" className="gap-2">
                                                <Plus className="h-4 w-4" /> Create your first post
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            posts.map((post: any) => (
                                <TableRow key={post._id}>
                                    <TableCell className="font-medium">{post.title}</TableCell>
                                    <TableCell>{post.slug}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${post.isPublished
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                            }`}>
                                            {post.isPublished ? "Published" : "Draft"}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "-"}
                                    </TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-2">
                                        <Link href={`/blog/${post.slug}`} target="_blank">
                                            <Button variant="ghost" size="sm">View</Button>
                                        </Link>
                                        <Link href={`/admin/blog/${post._id}/edit`}>
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </Link>
                                        <DeletePostButton postId={post._id} postTitle={post.title} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Link href={`/admin/blog?page=${currentPage - 1}`}>
                        <Button variant="outline" disabled={currentPage <= 1}>
                            Previous
                        </Button>
                    </Link>
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Link href={`/admin/blog?page=${currentPage + 1}`}>
                        <Button variant="outline" disabled={currentPage >= totalPages}>
                            Next
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
