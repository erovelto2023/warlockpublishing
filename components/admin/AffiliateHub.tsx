"use client";

import { useState, useEffect } from "react";
import { 
    Plus, Search, Copy, ExternalLink, Trash2, 
    Star, StarOff, MoreVertical, Edit3, 
    TrendingUp, LayoutGrid, List, Filter,
    Check, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
    getAffiliateOffers, 
    createAffiliateOffer, 
    updateAffiliateOffer, 
    deleteAffiliateOffer,
    toggleFavorite
} from "@/lib/actions/affiliate.actions";
import { importFromPlatform6, importFromNexus } from "@/lib/actions/import.actions";

interface AffiliateHubProps {
    initialOffers: any[];
}

export default function AffiliateHub({ initialOffers }: AffiliateHubProps) {
    const [offers, setOffers] = useState<any[]>(initialOffers || []);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [view, setView] = useState<"grid" | "list">("list");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<any>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [importing, setImporting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        affiliateLink: "",
        destinationLink: "",
        productPrice: "",
        commissionLevel: "",
        payoutAmount: "",
        network: "",
        category: "General",
        notes: ""
    });

    useEffect(() => {
        loadOffers();
    }, []);

    const loadOffers = async () => {
        try {
            setLoading(true);
            const data = await getAffiliateOffers();
            console.log("Loaded offers:", data);
            setOffers(data);
        } catch (error) {
            console.error("Error loading offers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingOffer) {
            await updateAffiliateOffer(editingOffer._id, formData);
        } else {
            await createAffiliateOffer(formData);
        }
        setIsDialogOpen(false);
        setEditingOffer(null);
        setFormData({
            name: "",
            affiliateLink: "",
            destinationLink: "",
            productPrice: "",
            commissionLevel: "",
            payoutAmount: "",
            network: "",
            category: "General",
            notes: ""
        });
        loadOffers();
    };

    const handleEdit = (offer: any) => {
        setEditingOffer(offer);
        setFormData({
            name: offer.name,
            affiliateLink: offer.affiliateLink,
            destinationLink: offer.destinationLink || "",
            productPrice: offer.productPrice || "",
            commissionLevel: offer.commissionLevel || "",
            payoutAmount: offer.payoutAmount || "",
            network: offer.network || "",
            category: offer.category || "General",
            notes: offer.notes || ""
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this offer?")) {
            await deleteAffiliateOffer(id);
            loadOffers();
        }
    };

    const handleToggleFavorite = async (id: string) => {
        await toggleFavorite(id);
        loadOffers();
    };

    const handleImport = async () => {
        setImporting(true);
        const res = await importFromPlatform6();
        if (res.success) {
            alert(`Successfully imported ${res.count} offers from Platform6!`);
            loadOffers();
        } else {
            alert(`Import failed: ${res.error}`);
        }
        setImporting(false);
    };

    const handleImportNexus = async () => {
        setImporting(true);
        const res = await importFromNexus();
        if (res.success) {
            alert(`Successfully imported ${res.count} products from Marketplace Nexus!`);
            loadOffers();
        } else {
            alert(`Import failed: ${res.error}`);
        }
        setImporting(false);
    };

    const filteredOffers = offers.filter(o => 
        o.name.toLowerCase().includes(search.toLowerCase()) || 
        o.network?.toLowerCase().includes(search.toLowerCase()) ||
        o.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 bg-slate-900 border-slate-800 shadow-xl border-l-4 border-l-cyan-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-cyan-500/10 rounded-xl">
                            <LayoutGrid className="text-cyan-400" size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Hub Offers</p>
                            <p className="text-2xl font-bold text-white">{offers.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-slate-900 border-slate-800 shadow-xl border-l-4 border-l-emerald-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl">
                            <Star className="text-emerald-400" size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Favorites</p>
                            <p className="text-2xl font-bold text-white">{offers.filter(o => o.isFavorite).length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-slate-900 border-slate-800 shadow-xl border-l-4 border-l-indigo-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/10 rounded-xl">
                            <TrendingUp className="text-indigo-400" size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Clicks</p>
                            <p className="text-2xl font-bold text-white">{offers.reduce((acc, curr) => acc + (curr.clicks || 0), 0)}</p>
                        </div>
                    </div>
                </Card>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-full bg-cyan-600 hover:bg-cyan-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-cyan-900/20">
                            <Plus className="mr-2" size={20} /> Create New Master Offer
                        </Button>
                    </DialogTrigger>
                    <Button 
                        onClick={handleImport}
                        disabled={importing}
                        className="h-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-black uppercase tracking-widest text-[10px] rounded-2xl border border-slate-700"
                    >
                        {importing ? "Importing..." : "Sync from Platform6"}
                    </Button>
                    <Button 
                        onClick={handleImportNexus}
                        disabled={importing}
                        className="h-full bg-indigo-900 hover:bg-indigo-800 text-indigo-100 font-black uppercase tracking-widest text-[10px] rounded-2xl border border-indigo-700"
                    >
                        {importing ? "Importing..." : "Pull from Nexus"}
                    </Button>
                    <DialogContent className="max-w-2xl bg-slate-950 border-slate-800 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight">
                                {editingOffer ? "Edit Master Offer" : "Add New Master Offer"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 pt-4">
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Offer Name</label>
                                <Input 
                                    className="bg-slate-900 border-slate-700 h-12 font-bold"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Network</label>
                                <Input 
                                    className="bg-slate-900 border-slate-700 h-12"
                                    value={formData.network}
                                    onChange={(e) => setFormData({...formData, network: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Category</label>
                                <Input 
                                    className="bg-slate-900 border-slate-700 h-12"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Main Affiliate Link</label>
                                <Input 
                                    className="bg-slate-900 border-slate-700 h-12 text-emerald-400 font-mono text-xs"
                                    value={formData.affiliateLink}
                                    onChange={(e) => setFormData({...formData, affiliateLink: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-cyan-500">Internal Destination Link (Optional)</label>
                                <Input 
                                    className="bg-slate-900 border-slate-700 h-12 text-cyan-400 font-mono text-xs"
                                    value={formData.destinationLink}
                                    onChange={(e) => setFormData({...formData, destinationLink: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Price</label>
                                <Input 
                                    className="bg-slate-900 border-slate-700 h-12"
                                    value={formData.productPrice}
                                    onChange={(e) => setFormData({...formData, productPrice: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Commission</label>
                                <Input 
                                    className="bg-slate-900 border-slate-700 h-12"
                                    value={formData.commissionLevel}
                                    onChange={(e) => setFormData({...formData, commissionLevel: e.target.value})}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Notes</label>
                                <Input 
                                    className="bg-slate-900 border-slate-700 h-12"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                />
                            </div>
                            <Button type="submit" className="col-span-2 bg-cyan-600 hover:bg-cyan-700 h-14 font-black uppercase tracking-widest shadow-xl shadow-cyan-900/20">
                                {editingOffer ? "Save Changes" : "Save to Master Catalog"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <Input 
                        placeholder="Search master catalog..." 
                        className="pl-12 bg-slate-900 border-slate-800 h-12 focus:ring-cyan-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-inner">
                    <Button 
                        variant={view === 'list' ? 'secondary' : 'ghost'} 
                        size="icon" 
                        onClick={() => setView('list')}
                        className={view === 'list' ? 'bg-slate-800 text-white' : 'text-slate-500'}
                    >
                        <List size={18} />
                    </Button>
                    <Button 
                        variant={view === 'grid' ? 'secondary' : 'ghost'} 
                        size="icon" 
                        onClick={() => setView('grid')}
                        className={view === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-500'}
                    >
                        <LayoutGrid size={18} />
                    </Button>
                </div>
            </div>

            {/* List / Grid View */}
            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            ) : view === 'list' ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden shadow-2xl">
                    <Table>
                        <TableHeader className="bg-slate-900">
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="w-12 text-slate-500"></TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Offer Details</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Network & Category</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Payout</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Engagement</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Action Center</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOffers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center text-slate-500">No offers found matching your criteria.</TableCell>
                                </TableRow>
                            ) : (
                                filteredOffers.map((offer) => (
                                    <TableRow key={offer._id} className="border-slate-800 hover:bg-slate-800/30 transition-colors group">
                                        <TableCell>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => handleToggleFavorite(offer._id)}
                                                className={offer.isFavorite ? "text-emerald-400" : "text-slate-600 hover:text-emerald-400"}
                                            >
                                                {offer.isFavorite ? <Star size={18} fill="currentColor" /> : <StarOff size={18} />}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-bold text-white group-hover:text-cyan-400 transition-colors">{offer.name}</p>
                                                <p className="text-[10px] text-slate-500 font-mono mt-1 max-w-[200px] truncate">{offer.affiliateLink}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold w-fit">{offer.network || 'None'}</span>
                                                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold w-fit">{offer.category}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs">
                                                <p className="font-bold text-emerald-400">{offer.payoutAmount || 'N/A'}</p>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{offer.commissionLevel}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500" style={{ width: `${Math.min((offer.clicks || 0) / 10, 100)}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400">{offer.clicks || 0}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    className={`h-8 gap-2 transition-all ${copiedId === offer._id ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                                                    onClick={() => handleCopy(offer.affiliateLink, offer._id)}
                                                >
                                                    {copiedId === offer._id ? <Check size={14} /> : <Copy size={14} />}
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{copiedId === offer._id ? 'Copied' : 'Link'}</span>
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500"><MoreVertical size={16} /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-300">
                                                        <DropdownMenuItem onClick={() => handleEdit(offer)} className="gap-2 focus:bg-slate-800 focus:text-white cursor-pointer"><Edit3 size={14} /> Edit Offer</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => window.open(offer.affiliateLink, '_blank')} className="gap-2 focus:bg-slate-800 focus:text-white cursor-pointer"><ExternalLink size={14} /> Open Link</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(offer._id)} className="gap-2 text-rose-400 focus:bg-rose-950/30 focus:text-rose-400 cursor-pointer"><Trash2 size={14} /> Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOffers.map((offer) => (
                        <Card key={offer._id} className="p-6 bg-slate-900 border-slate-800 hover:border-cyan-500/50 transition-all shadow-xl group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleToggleFavorite(offer._id)}
                                    className={offer.isFavorite ? "text-emerald-400" : "text-slate-600 hover:text-emerald-400"}
                                >
                                    {offer.isFavorite ? <Star size={18} fill="currentColor" /> : <StarOff size={18} />}
                                </Button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-cyan-500/10 rounded-2xl group-hover:bg-cyan-500 group-hover:text-white transition-all">
                                        <ArrowUpRight size={24} className="text-cyan-400 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <p className="font-black uppercase tracking-tight text-lg leading-tight">{offer.name}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{offer.network || 'Independent'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800/50">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Payout</p>
                                        <p className="text-xl font-bold text-emerald-400">{offer.payoutAmount || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Engagement</p>
                                        <p className="text-xl font-bold text-white">{offer.clicks || 0} <span className="text-[10px] text-slate-500 ml-1">CLICKS</span></p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <Button 
                                        className={`flex-1 h-12 gap-2 font-black uppercase tracking-widest text-xs transition-all ${copiedId === offer._id ? 'bg-emerald-600' : 'bg-cyan-600 hover:bg-cyan-700'}`}
                                        onClick={() => handleCopy(offer.affiliateLink, offer._id)}
                                    >
                                        {copiedId === offer._id ? <Check size={16} /> : <Copy size={16} />}
                                        {copiedId === offer._id ? 'Copied' : 'Copy Hub Link'}
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-12 w-12 border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-white"
                                        onClick={() => handleEdit(offer)}
                                    >
                                        <Edit3 size={18} />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
