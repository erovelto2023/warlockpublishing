"use client";

import { useState, useEffect } from "react";
import { 
    Plus, Search, Copy, ExternalLink, Trash2, 
    Star, StarOff, MoreVertical, Edit3, 
    TrendingUp, LayoutGrid, List, Filter,
    Check, ArrowUpRight, ArrowLeft, ArrowRight
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
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const pageSize = 12;

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

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

    const filteredOffers = offers.filter(o => {
        const matchesSearch = o.name.toLowerCase().includes(search.toLowerCase()) || 
                              o.network?.toLowerCase().includes(search.toLowerCase()) ||
                              o.category?.toLowerCase().includes(search.toLowerCase());
        const matchesLetter = !selectedLetter || o.name.charAt(0).toUpperCase() === selectedLetter;
        return matchesSearch && matchesLetter;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedLetter]);

    const totalPages = Math.ceil(filteredOffers.length / pageSize);
    const paginatedOffers = filteredOffers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 bg-white border-slate-200 shadow-sm border-l-4 border-l-cyan-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-cyan-50 rounded-xl">
                            <LayoutGrid className="text-cyan-600" size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Hub Offers</p>
                            <p className="text-2xl font-bold text-slate-900">{offers.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-white border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 rounded-xl">
                            <Star className="text-emerald-600" size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Favorites</p>
                            <p className="text-2xl font-bold text-slate-900">{offers.filter(o => o.isFavorite).length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-white border-slate-200 shadow-sm border-l-4 border-l-indigo-500">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-xl">
                            <TrendingUp className="text-indigo-600" size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Clicks</p>
                            <p className="text-2xl font-bold text-slate-900">{offers.reduce((acc, curr) => acc + (curr.clicks || 0), 0)}</p>
                        </div>
                    </div>
                </Card>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-md">
                            <Plus className="mr-2" size={20} /> Create New Master Offer
                        </Button>
                    </DialogTrigger>
                    <Button 
                        onClick={handleImport}
                        disabled={importing}
                        className="h-full bg-white hover:bg-slate-50 text-slate-700 font-black uppercase tracking-widest text-[10px] rounded-2xl border border-slate-200"
                    >
                        {importing ? "Importing..." : "Sync from Platform6"}
                    </Button>
                    <Button 
                        onClick={handleImportNexus}
                        disabled={importing}
                        className="h-full bg-white hover:bg-slate-50 text-slate-700 font-black uppercase tracking-widest text-[10px] rounded-2xl border border-slate-200"
                    >
                        {importing ? "Importing..." : "Pull from Nexus"}
                    </Button>
                    <DialogContent className="max-w-2xl bg-white border-slate-200 text-slate-900">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tight">
                                {editingOffer ? "Edit Master Offer" : "Add New Master Offer"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 pt-4">
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Offer Name</label>
                                <Input 
                                    className="bg-white border-slate-200 h-12 font-bold text-slate-900"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Network</label>
                                <Input 
                                    className="bg-white border-slate-200 h-12 text-slate-900"
                                    value={formData.network}
                                    onChange={(e) => setFormData({...formData, network: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Category</label>
                                <Input 
                                    className="bg-white border-slate-200 h-12 text-slate-900"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Main Affiliate Link</label>
                                <Input 
                                    className="bg-white border-slate-200 h-12 text-emerald-600 font-mono text-xs"
                                    value={formData.affiliateLink}
                                    onChange={(e) => setFormData({...formData, affiliateLink: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-cyan-600">Internal Destination Link (Optional)</label>
                                <Input 
                                    className="bg-white border-slate-200 h-12 text-cyan-600 font-mono text-xs"
                                    value={formData.destinationLink}
                                    onChange={(e) => setFormData({...formData, destinationLink: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Price</label>
                                <Input 
                                    className="bg-white border-slate-200 h-12 text-slate-900"
                                    value={formData.productPrice}
                                    onChange={(e) => setFormData({...formData, productPrice: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Commission</label>
                                <Input 
                                    className="bg-white border-slate-200 h-12 text-slate-900"
                                    value={formData.commissionLevel}
                                    onChange={(e) => setFormData({...formData, commissionLevel: e.target.value})}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Notes</label>
                                <Input 
                                    className="bg-white border-slate-200 h-12 text-slate-900"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                />
                            </div>
                            <Button type="submit" className="col-span-2 bg-slate-900 hover:bg-slate-800 text-white h-14 font-black uppercase tracking-widest shadow-md">
                                {editingOffer ? "Save Changes" : "Save to Master Catalog"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col items-start gap-4">
                <div className="flex flex-col md:flex-row w-full items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input 
                            placeholder="Search master catalog..." 
                            className="pl-12 bg-white border-slate-200 h-12 focus:ring-slate-900 text-slate-900"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                        <Button 
                            variant={view === 'list' ? 'secondary' : 'ghost'} 
                            size="icon" 
                            onClick={() => setView('list')}
                            className={view === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}
                        >
                            <List size={18} />
                        </Button>
                        <Button 
                            variant={view === 'grid' ? 'secondary' : 'ghost'} 
                            size="icon" 
                            onClick={() => setView('grid')}
                            className={view === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}
                        >
                            <LayoutGrid size={18} />
                        </Button>
                    </div>
                </div>

                {/* A-Z Filter */}
                <div className="flex flex-wrap items-center gap-1 w-full bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <Button
                        variant={selectedLetter === null ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedLetter(null)}
                        className={`h-8 px-3 text-xs font-bold ${selectedLetter === null ? "bg-slate-900 text-white hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}
                    >
                        All
                    </Button>
                    <div className="w-[1px] h-4 bg-slate-200 mx-2"></div>
                    {alphabet.map(letter => (
                        <Button
                            key={letter}
                            variant={selectedLetter === letter ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setSelectedLetter(letter)}
                            className={`h-8 w-8 p-0 text-xs font-bold ${selectedLetter === letter ? "bg-slate-900 text-white hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}
                        >
                            {letter}
                        </Button>
                    ))}
                </div>
            </div>

            {/* List / Grid View */}
            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            ) : view === 'list' ? (
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-50 border-b border-slate-200">
                            <TableRow className="border-slate-200 hover:bg-transparent">
                                <TableHead className="w-12 text-slate-500"></TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Offer Details</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Network & Category</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Payout</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Engagement</TableHead>
                                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Action Center</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedOffers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center text-slate-500">No offers found matching your criteria.</TableCell>
                                </TableRow>
                            ) : (
                                paginatedOffers.map((offer) => (
                                    <TableRow key={offer._id} className="border-slate-200 hover:bg-slate-50 transition-colors group">
                                        <TableCell>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => handleToggleFavorite(offer._id)}
                                                className={offer.isFavorite ? "text-emerald-500" : "text-slate-400 hover:text-emerald-500"}
                                            >
                                                {offer.isFavorite ? <Star size={18} fill="currentColor" /> : <StarOff size={18} />}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-bold text-slate-900 transition-colors">{offer.name}</p>
                                                <p className="text-[10px] text-slate-500 font-mono mt-1 max-w-[200px] truncate">{offer.affiliateLink}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold w-fit">{offer.network || 'None'}</span>
                                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold w-fit">{offer.category}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs">
                                                <p className="font-bold text-emerald-600">{offer.payoutAmount || 'N/A'}</p>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{offer.commissionLevel}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-slate-900" style={{ width: `${Math.min((offer.clicks || 0) / 10, 100)}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-600">{offer.clicks || 0}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    className={`h-8 gap-2 transition-all ${copiedId === offer._id ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                                                    onClick={() => handleCopy(offer.affiliateLink, offer._id)}
                                                >
                                                    {copiedId === offer._id ? <Check size={14} /> : <Copy size={14} />}
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">{copiedId === offer._id ? 'Copied' : 'Link'}</span>
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><MoreVertical size={16} /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-white border-slate-200 text-slate-700 shadow-xl">
                                                        <DropdownMenuItem onClick={() => handleEdit(offer)} className="gap-2 focus:bg-slate-100 focus:text-slate-900 cursor-pointer"><Edit3 size={14} /> Edit Offer</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => window.open(offer.affiliateLink, '_blank')} className="gap-2 focus:bg-slate-100 focus:text-slate-900 cursor-pointer"><ExternalLink size={14} /> Open Link</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(offer._id)} className="gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-700 cursor-pointer"><Trash2 size={14} /> Delete</DropdownMenuItem>
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
                    {paginatedOffers.map((offer) => (
                        <Card key={offer._id} className="p-6 bg-white border-slate-200 hover:border-slate-300 transition-all shadow-sm group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleToggleFavorite(offer._id)}
                                    className={offer.isFavorite ? "text-emerald-500" : "text-slate-400 hover:text-emerald-500"}
                                >
                                    {offer.isFavorite ? <Star size={18} fill="currentColor" /> : <StarOff size={18} />}
                                </Button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-slate-100 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                                        <ArrowUpRight size={24} className="text-slate-900 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <p className="font-black uppercase tracking-tight text-lg leading-tight text-slate-900">{offer.name}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{offer.network || 'Independent'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Payout</p>
                                        <p className="text-xl font-bold text-emerald-600">{offer.payoutAmount || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Engagement</p>
                                        <p className="text-xl font-bold text-slate-900">{offer.clicks || 0} <span className="text-[10px] text-slate-500 ml-1">CLICKS</span></p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <Button 
                                        className={`flex-1 h-12 gap-2 font-black uppercase tracking-widest text-xs transition-all ${copiedId === offer._id ? 'bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                                        onClick={() => handleCopy(offer.affiliateLink, offer._id)}
                                    >
                                        {copiedId === offer._id ? <Check size={16} /> : <Copy size={16} />}
                                        {copiedId === offer._id ? 'Copied' : 'Copy Hub Link'}
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-12 w-12 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-8 border-t border-slate-200">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={currentPage === 1}
                        onClick={() => {
                            setCurrentPage(p => Math.max(1, p - 1));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Previous
                    </Button>
                    
                    <div className="text-xs font-black uppercase tracking-widest text-slate-500">
                        Page <span className="text-slate-900">{currentPage}</span> of {totalPages}
                    </div>

                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={currentPage === totalPages}
                        onClick={() => {
                            setCurrentPage(p => Math.min(totalPages, p + 1));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                        Next <ArrowRight size={16} className="ml-2" />
                    </Button>
                </div>
            )}

            {/* Results Count */}
            <div className="text-sm text-slate-500 text-center pt-4">
                Showing {paginatedOffers.length} of {filteredOffers.length} offers
            </div>
        </div>
    );
}
