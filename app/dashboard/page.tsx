import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUserMessages, getUserSentMessages } from "@/lib/actions/message";
import { Mail, BookOpen, Send, Inbox } from "lucide-react";

export default async function DashboardPage() {
    const { userId } = await auth();
    if (!userId) redirect("/");

    const receivedMessages = await getUserMessages(userId);
    const sentMessages = await getUserSentMessages(userId);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 font-sans selection:bg-cyan-500 selection:text-white pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
                    <Link href="/contact">
                        <Button>Contact Support</Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        {/* Received Messages */}
                        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-8">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Inbox className="w-5 h-5 text-cyan-400" /> Received Messages
                            </h2>

                            {receivedMessages.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">No messages received yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {receivedMessages.map((msg: any) => (
                                        <div key={msg._id} className="p-4 rounded-lg bg-slate-900 border border-slate-700">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-white">{msg.subject}</h3>
                                                <span className="text-xs text-slate-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-slate-400">{msg.content}</p>
                                            <div className="mt-2 text-xs text-cyan-500">From: {msg.senderName}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sent Messages */}
                        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-8">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Send className="w-5 h-5 text-purple-400" /> Sent Messages
                            </h2>

                            {sentMessages.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">No messages sent yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {sentMessages.map((msg: any) => (
                                        <div key={msg._id} className="p-4 rounded-lg bg-slate-900 border border-slate-700">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-white">{msg.subject}</h3>
                                                <span className="text-xs text-slate-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-slate-400">{msg.content}</p>
                                            <div className="mt-2 text-xs text-green-500">To: Admin</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-purple-400" /> My Library
                            </h2>
                            <p className="text-slate-400 text-center py-8">
                                You haven't purchased any products yet.
                                <Link href="/products" className="text-cyan-400 hover:underline ml-1">Browse the store</Link>
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
                            <ul className="space-y-2">
                                <li><Link href="/products" className="text-cyan-400 hover:underline">Browse Products</Link></li>
                                <li><Link href="/contact" className="text-cyan-400 hover:underline">Support</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
