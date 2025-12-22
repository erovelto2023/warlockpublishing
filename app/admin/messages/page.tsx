import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllMessagesForAdmin, markMessageAsRead, deleteMessage } from "@/lib/actions/message";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Trash2, MailOpen, Mail, Send, Inbox, User } from "lucide-react";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage({
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
    const limit = 50;
    const { messages, totalPages, total } = await getAllMessagesForAdmin({ limit, page: currentPage });

    // Separate messages into inbox and sent
    const inboxMessages = messages.filter((msg: any) => !msg.recipientId || msg.recipientId === null);
    const sentMessages = messages.filter((msg: any) => msg.recipientId && msg.recipientId !== null);

    return (
        <div className="container py-10 px-4">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Message Center</h1>
                    <p className="text-slate-400 text-sm mt-1">Total: {total} messages</p>
                </div>
            </div>

            {/* Inbox Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Inbox className="h-5 w-5 text-cyan-400" />
                    <h2 className="text-xl font-bold text-white">Inbox</h2>
                    <span className="text-sm text-slate-400">({inboxMessages.length} messages)</span>
                </div>

                <div className="rounded-md border mb-4 bg-slate-800/50">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">Status</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inboxMessages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No inbox messages found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                inboxMessages.map((msg: any) => (
                                    <TableRow key={msg._id} className={msg.isRead ? "opacity-60" : "font-medium bg-slate-900/50"}>
                                        <TableCell>
                                            {msg.isRead ? <MailOpen className="h-4 w-4 text-slate-500" /> : <Mail className="h-4 w-4 text-cyan-500" />}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-slate-400" />
                                                <div>
                                                    <div className="font-medium text-white">{msg.senderName}</div>
                                                    <div className="text-xs text-slate-400">{msg.senderEmail}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-md">
                                                <div className="font-medium text-white truncate">{msg.subject}</div>
                                                <div className="text-xs text-slate-400 truncate">{msg.content}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-300">
                                            {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!msg.isRead && (
                                                    <form action={async () => {
                                                        "use server"
                                                        await markMessageAsRead(msg._id)
                                                    }}>
                                                        <Button variant="ghost" size="sm" title="Mark as Read" className="text-cyan-500 hover:text-cyan-400">
                                                            <MailOpen className="h-4 w-4" />
                                                        </Button>
                                                    </form>
                                                )}
                                                <form action={async () => {
                                                    "use server"
                                                    await deleteMessage(msg._id)
                                                }}>
                                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" title="Delete">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Sent Messages Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Send className="h-5 w-5 text-purple-400" />
                    <h2 className="text-xl font-bold text-white">Sent Messages</h2>
                    <span className="text-sm text-slate-400">({sentMessages.length} messages)</span>
                </div>

                <div className="rounded-md border bg-slate-800/50">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>To</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sentMessages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                        No sent messages found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sentMessages.map((msg: any) => (
                                    <TableRow key={msg._id} className="opacity-80">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-slate-400" />
                                                <div className="text-slate-300">User ID: {msg.recipientId}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-md">
                                                <div className="font-medium text-white truncate">{msg.subject}</div>
                                                <div className="text-xs text-slate-400 truncate">{msg.content}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-300">
                                            {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <form action={async () => {
                                                "use server"
                                                await deleteMessage(msg._id)
                                            }}>
                                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" title="Delete">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Link href={`/admin/messages?page=${currentPage - 1}`}>
                        <Button variant="outline" disabled={currentPage <= 1}>
                            Previous
                        </Button>
                    </Link>
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Link href={`/admin/messages?page=${currentPage + 1}`}>
                        <Button variant="outline" disabled={currentPage >= totalPages}>
                            Next
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
