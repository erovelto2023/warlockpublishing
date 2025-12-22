import { getSubscribers } from "@/lib/actions/subscriber.actions";
import { getPenNameById } from "@/lib/actions/pen-name.actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { notFound } from "next/navigation";

interface SubscribersPageProps {
    params: Promise<{ id: string }>;
}

export default async function SubscribersPage({ params }: SubscribersPageProps) {
    const { id } = await params;
    const penName = await getPenNameById(id);

    if (!penName) {
        notFound();
    }

    const subscribers = await getSubscribers(id);

    return (
        <div className="container py-10 px-4 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Subscribers</h1>
                <p className="text-slate-500">Manage your mailing list for {penName.name}.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900">All Subscribers ({subscribers.length})</h2>
                    {/* Future: Add export button or other actions */}
                </div>

                {subscribers.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        No subscribers yet. Share your author page to get started!
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Date Joined</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subscribers.map((sub: any) => (
                                <TableRow key={sub._id}>
                                    <TableCell className="font-medium">{sub.email}</TableCell>
                                    <TableCell>
                                        {new Date(sub.createdAt).toLocaleDateString()} {new Date(sub.createdAt).toLocaleTimeString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
