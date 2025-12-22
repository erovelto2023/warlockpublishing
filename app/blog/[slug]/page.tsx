import Link from "next/link";
import { getPostBySlug } from "@/lib/actions/blog";
import { ArrowLeft, Calendar, User, Tag, Edit } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ReactMarkdown from 'react-markdown';
import { isAdmin } from "@/lib/admin";
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} | Warlock Publishing Blog`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    const isUserAdmin = await isAdmin();

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 font-sans selection:bg-cyan-500 selection:text-white pt-32 pb-24">
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-8">
                        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors">
                            <ArrowLeft size={16} /> Back to Blog
                        </Link>
                        {isUserAdmin && (
                            <Link href={`/admin/blog/${post._id}/edit`}>
                                <Button variant="outline" size="sm" className="gap-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300">
                                    <Edit className="w-4 h-4" /> Edit Post
                                </Button>
                            </Link>
                        )}
                    </div>

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags.map((tag: string) => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-slate-800 text-cyan-400 text-xs font-bold uppercase tracking-wider border border-slate-700">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-6 text-sm text-slate-500 border-b border-slate-800 pb-8">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            {new Date(post.publishedAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            {post.author}
                        </div>
                    </div>
                </div>

                {post.coverImage && (
                    <div className="mb-12 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-auto"
                        />
                    </div>
                )}

                <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-cyan-400 prose-strong:text-white prose-code:text-cyan-300 prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </article>
        </div>
    );
}
