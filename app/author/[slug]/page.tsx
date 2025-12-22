import { getPenNameBySlug, getPenNameById } from "@/lib/actions/pen-name.actions";
import { getProductsByPenName } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Twitter, Instagram, Mail } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";

export const dynamic = 'force-dynamic';

interface AuthorPageProps {
    params: Promise<{ slug: string }>;
}

export default async function AuthorPage({ params }: AuthorPageProps) {
    const { slug } = await params;
    let penName = await getPenNameBySlug(slug);

    if (!penName && /^[0-9a-fA-F]{24}$/.test(slug)) {
        penName = await getPenNameById(slug);
    }

    if (!penName) {
        notFound();
    }

    const products = await getProductsByPenName(penName._id);
    const publishedProducts = products.filter((p: any) => !p.isHidden);
    const featuredBook = publishedProducts[0]; // Just take the first one as featured for now

    return (
        <div className="min-h-screen bg-stone-50 font-serif text-stone-800">
            {/* Navigation */}
            <nav className="px-6 py-8 md:px-12 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto border-b border-stone-200 bg-stone-50">
                <div className="text-3xl font-bold tracking-tight mb-4 md:mb-0 uppercase">{penName.name}</div>
                <div className="flex gap-8 font-sans text-xs font-bold tracking-widest text-stone-500">
                    <Link href="#" className="hover:text-stone-900 transition-colors">BOOKS</Link>
                    <Link href="#" className="hover:text-stone-900 transition-colors">ABOUT</Link>
                    <Link href="#" className="hover:text-stone-900 transition-colors">EVENTS</Link>
                    <Link href="#" className="hover:text-stone-900 transition-colors">CONTACT</Link>
                </div>
            </nav>

            {/* Hero Section */}
            {featuredBook && (
                <header className="relative py-20 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="space-y-8 text-center md:text-left">
                            <span className="inline-block font-sans text-xs font-bold tracking-widest text-white bg-stone-900 px-3 py-1 uppercase">New Release</span>
                            <h1 className="text-5xl md:text-7xl font-bold leading-[0.9]">
                                {featuredBook.title}
                            </h1>
                            <p className="text-lg text-stone-600 md:max-w-md leading-relaxed font-sans font-light line-clamp-3">
                                {featuredBook.description}
                            </p>
                            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <Link href={`/products/${featuredBook._id}`}>
                                    <button
                                        className="bg-stone-900 text-white px-8 py-4 font-sans text-xs font-bold tracking-widest hover:bg-stone-700 transition-all shadow-xl shadow-stone-200"
                                    >
                                        READ THE BOOK
                                    </button>
                                </Link>
                                <button className="border border-stone-300 px-8 py-4 font-sans text-xs font-bold tracking-widest hover:border-stone-900 hover:bg-stone-100 transition-all">
                                    LISTEN TO SAMPLE
                                </button>
                            </div>
                        </div>

                        <div className="relative h-[400px] md:h-[600px] flex items-center justify-center">
                            {/* Abstract Shapes */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-stone-200 rounded-full blur-3xl opacity-60"></div>

                            <Link href={`/products/${featuredBook._id}`}>
                                <div
                                    className="w-64 md:w-80 aspect-[2/3] shadow-2xl bg-slate-800 flex items-center justify-center p-6 text-center text-white relative z-10 transform md:rotate-6 cursor-pointer hover:rotate-0 hover:scale-105 transition-all duration-500"
                                >
                                    {featuredBook.imageUrl ? (
                                        <img src={featuredBook.imageUrl} alt={featuredBook.title} className="w-full h-full object-cover shadow-inner" />
                                    ) : (
                                        <div className="border border-white/30 p-4 w-full h-full flex flex-col justify-center bg-black/10 backdrop-blur-sm">
                                            <h2 className="font-serif text-3xl font-bold">{featuredBook.title}</h2>
                                            <p className="text-xs mt-4 opacity-80 uppercase tracking-widest">{penName.name}</p>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>
            )}

            {/* Book Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex justify-between items-end mb-16 border-b border-stone-100 pb-8">
                        <h2 className="text-4xl font-bold">The Collection</h2>
                        <button className="font-sans text-xs font-bold underline decoration-stone-300 underline-offset-4 hover:text-stone-500">VIEW COMPLETE LIST</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                        {publishedProducts.map((book: any) => (
                            <Link key={book._id} href={`/products/${book._id}`}>
                                <div className="group cursor-pointer">
                                    <div className="relative mb-8">
                                        <div className="aspect-[2/3] bg-slate-100 shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 flex items-center justify-center text-center z-10 relative overflow-hidden">
                                            {book.imageUrl ? (
                                                <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="p-8 w-full h-full flex flex-col justify-center bg-slate-800 text-white">
                                                    <h3 className="font-serif font-bold text-xl">{book.title}</h3>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-full h-full border border-stone-200 -z-0"></div>
                                    </div>

                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold group-hover:text-stone-600 transition-colors mb-2">{book.title}</h3>
                                        <p className="text-stone-500 font-sans text-xs tracking-widest uppercase">{book.category || "Book"}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* About / Newsletter */}
            <section className="py-24 bg-stone-900 text-stone-200 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center space-y-10 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-serif italic">"{penName.tagline || "Stories that linger long after the last page is turned."}"</h2>
                    <div className="w-16 h-1 bg-stone-700 mx-auto"></div>
                    <p className="font-sans text-stone-400 max-w-xl mx-auto leading-relaxed text-lg font-light">
                        {penName.newsletterDescription || `Join readers receiving early access to chapters, exclusive short stories, and updates on ${penName.name}'s upcoming releases.`}
                    </p>
                    <NewsletterForm penNameId={penName._id} />
                </div>
            </section>

            <footer className="py-12 bg-stone-950 text-stone-600 font-sans text-xs tracking-widest border-t border-stone-900">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <span className="uppercase">© {new Date().getFullYear()} {penName.name}. ALL RIGHTS RESERVED.</span>
                    <div className="flex gap-6">
                        {penName.socialLinks?.twitter && <Link href={penName.socialLinks.twitter}><Twitter size={16} className="hover:text-stone-400 cursor-pointer" /></Link>}
                        {penName.socialLinks?.instagram && <Link href={penName.socialLinks.instagram}><Instagram size={16} className="hover:text-stone-400 cursor-pointer" /></Link>}
                        {penName.socialLinks?.email && <Link href={`mailto:${penName.socialLinks.email}`}><Mail size={16} className="hover:text-stone-400 cursor-pointer" /></Link>}
                    </div>
                </div>
            </footer>
        </div>
    );
}
