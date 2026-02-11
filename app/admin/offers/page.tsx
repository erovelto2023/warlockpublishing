import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSalesPages } from "@/lib/actions/sales-page.actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Eye, Edit } from "lucide-react";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function OffersListPage() {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) redirect('/');

    const offers = await getSalesPages();

    return (
        <div className="container py-10 px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <h1 className="text-3xl font-bold text-white">Manage Offers</h1>
                <Link href="/admin/offers/new">
                    <Button className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white border-none">
                        <Plus className="h-4 w-4" /> Create Offer
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-slate-900 border-slate-800">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-slate-800/50 border-slate-800">
                            <TableHead className="text-slate-400">Title</TableHead>
                            <TableHead className="text-slate-400">Slug</TableHead>
                            <TableHead className="text-slate-400">Views</TableHead>
                            <TableHead className="text-slate-400">Status</TableHead>
                            <TableHead className="text-right text-slate-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {offers.length === 0 ? (
                            <TableRow className="hover:bg-slate-800/50 border-slate-800">
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    <div className="flex flex-col items-center gap-4">
                                        <p>No offers found. Create one to get started.</p>
                                        <Link href="/admin/offers/new">
                                            <Button className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white border-none">
                                                <Plus className="h-4 w-4" /> Create Offer
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            offers.map((offer: any) => (
                                <TableRow key={offer._id} className="hover:bg-slate-800/50 border-slate-800">
                                    <TableCell className="font-medium text-slate-200">{offer.title}</TableCell>
                                    <TableCell className="text-slate-400">/offers/{offer.slug}</TableCell>
                                    <TableCell className="text-slate-400">{offer.views}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${offer.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {offer.isPublished ? 'Live' : 'Draft'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-2">
                                        <Link href={`/offers/${offer.slug}`} target="_blank">
                                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800"><Eye className="w-4 h-4" /></Button>
                                        </Link>
                                        <Link href={`/admin/offers/${offer._id}/edit`}>
                                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800"><Edit className="w-4 h-4" /></Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
