import Link from "next/link";
import { getPosts } from "@/lib/actions/blog";
import { ArrowRight, Calendar, User, Edit, Plus } from "lucide-react";
import { isAdmin } from "@/lib/admin";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function BlogIndexPage() {
    const { posts } = await getPosts({ publishedOnly: true, limit: 20 });
    const isUserAdmin = await isAdmin();

    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 font-sans selection:bg-cyan-500 selection:text-white pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                        Warlock <span className="text-cyan-400">Blog</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-6">
                        Insights, updates, and resources for digital creators.
                    </p>
                    {isUserAdmin && (
                        <div className="flex justify-center gap-4">
                            <Link href="/admin/blog">
                                <Button variant="outline" className="gap-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300">
                                    <Edit className="w-4 h-4" /> Manage Blog
                                </Button>
                            </Link>
                            <Link href="/admin/blog/new">
                                <Button variant="outline" className="gap-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300">
                                    <Plus className="w-4 h-4" /> New Post
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800 rounded-2xl border border-slate-700">
                        <p className="text-xl text-slate-400">No posts published yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post: any) => (
                            <article key={post._id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden hover:border-cyan-500/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10 flex flex-col h-full">
                                {post.coverImage && (
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={post.coverImage}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(post.publishedAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User size={12} />
                                            {post.author}
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">
                                        <Link href={`/blog/${post.slug}`} className="hover:text-cyan-400 transition-colors">
                                            {post.title}
                                        </Link>
                                    </h2>

                                    <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-1">
                                        {post.excerpt}
                                    </p>

                                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-cyan-400 font-bold text-sm hover:text-cyan-300 transition-colors mt-auto">
                                        Read Article <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
