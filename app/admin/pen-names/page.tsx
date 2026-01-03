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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Pen Names</h1>
                <Link href="/admin/pen-names/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Create Pen Name
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {penNames.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                        <User className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No pen names found</p>
                        <p className="text-sm">Create your first pen name to get started.</p>
                        <div className="mt-6">
                            <Link href="/admin/pen-names/new">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" /> Create Pen Name
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    penNames.map((penName: any) => (
                        <div key={penName._id} className="bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-900 relative">
                                {penName.coverImage && (
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-50"
                                        style={{ backgroundImage: `url(${penName.coverImage})` }}
                                    />
                                )}
                                <div className="absolute -bottom-8 left-6">
                                    <div className="h-16 w-16 rounded-full border-4 border-card bg-slate-200 overflow-hidden flex items-center justify-center">
                                        {penName.avatarUrl ? (
                                            <img src={penName.avatarUrl} alt={penName.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-xl font-bold text-slate-500">{penName.name.charAt(0)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="pt-10 p-6">
                                <h3 className="text-xl font-bold mb-1">{penName.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {penName.bio || "No bio provided."}
                                </p>
                                <div className="flex gap-2 mt-4">
                                    <Link href={`/admin/pen-names/${penName._id}/dashboard`} className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/pen-names/${penName._id}/edit`}>
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href={`/author/${penName.slug || penName._id}`} target="_blank">
                                        <Button variant="ghost" size="icon" title="View Public Page">
                                            <User className="h-4 w-4" />
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
