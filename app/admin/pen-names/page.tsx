import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, User } from "lucide-react";
import { getPenNames } from "@/lib/actions/pen-name.actions";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function PenNamesPage() {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        redirect("/");
    }

    const penNames = await getPenNames();

    return (
        <div className="container py-10 px-4">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Pen Names</h1>
                    <p className="text-slate-400">Manage your author identities.</p>
                </div>
                <Link href="/admin/pen-names/new">
                    <Button className="gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold shadow-lg shadow-cyan-500/20">
                        <Plus className="h-5 w-5" /> Create Pen Name
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {penNames.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center text-center py-20 px-4 rounded-3xl border-2 border-dashed border-slate-700 bg-slate-800/50">
                        <div className="w-20 h-20 rounded-full bg-slate-700/50 flex items-center justify-center mb-6">
                            <User className="h-10 w-10 text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Pen Names Yet</h3>
                        <p className="text-slate-400 max-w-md mx-auto mb-8">
                            Create your first pen name to start publishing products and building your audience.
                        </p>
                        <Link href="/admin/pen-names/new">
                            <Button size="lg" className="gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold h-12 px-8 rounded-full shadow-xl shadow-cyan-500/20 transition-all hover:scale-105">
                                <Plus className="h-5 w-5" /> Create Your First Pen Name
                            </Button>
                        </Link>
                    </div>
                ) : (
                    penNames.map((penName: any) => (
                        <div key={penName._id} className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden hover:shadow-2xl hover:border-cyan-500/30 transition-all group">
                            <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900 relative">
                                {penName.coverImage && (
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-100 transition-opacity"
                                        style={{ backgroundImage: `url(${penName.coverImage})` }}
                                    />
                                )}
                                <div className="absolute -bottom-10 left-6">
                                    <div className="h-20 w-20 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden flex items-center justify-center shadow-lg">
                                        {penName.avatarUrl ? (
                                            <img src={penName.avatarUrl} alt={penName.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-2xl font-bold text-slate-400">{penName.name.charAt(0)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12 p-6">
                                <h3 className="text-xl font-bold text-white mb-1">{penName.name}</h3>
                                <p className="text-sm text-slate-400 line-clamp-2 mb-6 h-10">
                                    {penName.bio || "No bio provided."}
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link href={`/admin/pen-names/${penName._id}/dashboard`} className="col-span-2">
                                        <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700">
                                            Manage Dashboard
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/pen-names/${penName._id}/edit`} className="w-full">
                                        <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                                            <Edit className="h-4 w-4 mr-2" /> Edit
                                        </Button>
                                    </Link>
                                    <Link href={`/author/${penName.slug || penName._id}`} target="_blank" className="w-full">
                                        <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                                            <User className="h-4 w-4 mr-2" /> View
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
