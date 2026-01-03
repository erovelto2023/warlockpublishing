import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, User } from "lucide-react";
import { getPenNames } from "@/lib/actions/pen-name.actions";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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
                <h1 className="text-3xl font-bold text-white">Pen Names</h1>
                <Link href="/admin/pen-names/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Create Pen Name
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border border-slate-800 bg-slate-900/50 mb-4 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-900">
                        <TableRow className="border-b-slate-800 hover:bg-slate-900/50">
                            <TableHead className="text-slate-300">Name</TableHead>
                            <TableHead className="text-slate-300">Slug</TableHead>
                            <TableHead className="text-slate-300">Bio</TableHead>
                            <TableHead className="text-right text-slate-300">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {penNames.length === 0 ? (
                            <TableRow className="border-b-slate-800 hover:bg-slate-900/50">
                                <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                                    <div className="flex flex-col items-center gap-4">
                                        <p className="text-lg font-medium text-slate-300">No pen names found.</p>
                                        <Link href="/admin/pen-names/new">
                                            <Button variant="outline" className="gap-2 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white">
                                                <Plus className="h-4 w-4" /> Create your first pen name
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            penNames.map((penName: any) => (
                                <TableRow key={penName._id} className="border-b-slate-800 hover:bg-slate-800/50">
                                    <TableCell className="font-medium text-white">
                                        <div className="flex items-center gap-3">
                                            {penName.avatarUrl ? (
                                                <img src={penName.avatarUrl} alt={penName.name} className="w-8 h-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-slate-400">{penName.name.charAt(0)}</span>
                                                </div>
                                            )}
                                            {penName.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-400">{penName.slug || '-'}</TableCell>
                                    <TableCell className="max-w-[300px] truncate text-slate-400">
                                        {penName.bio || '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/pen-names/${penName._id}/dashboard`}>
                                                <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-slate-800">
                                                    Dashboard
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/pen-names/${penName._id}/edit`}>
                                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Link href={`/author/${penName.slug || penName._id}`} target="_blank">
                                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
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
