'use client'

import { 
    ShoppingBag, Megaphone, Users, BookOpen, MessageSquare, 
    Image, Package, Settings, PenTool, LayoutDashboard,
    ArrowUpRight, BarChart3, PlusCircle
} from 'lucide-react';

interface ModuleCardProps {
    title: string;
    description: string;
    icon: any;
    metric?: string;
    color: string;
    onClick: () => void;
    onAddClick?: (e: React.MouseEvent) => void;
}

const ModuleCard = ({ title, description, icon: Icon, metric, color, onClick, onAddClick }: ModuleCardProps) => (
    <button 
        onClick={onClick}
        className="group relative flex flex-col p-6 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 text-left"
    >
        <div className={`p-3 rounded-xl ${color} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-neutral-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                {title}
            </h3>
            {metric && (
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full border border-emerald-500/20">
                    {metric}
                </span>
            )}
        </div>
        
        <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
            {description}
        </p>

        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            {onAddClick && (
                <div 
                    onClick={(e) => { e.stopPropagation(); onAddClick(e); }}
                    className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors"
                >
                    <PlusCircle className="w-5 h-5" />
                </div>
            )}
            <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <ArrowUpRight className="w-5 h-5" />
            </div>
        </div>
    </button>
);

interface AdminModuleGridProps {
    stats: {
        products: number;
        offers: number;
        subscribers: number;
        messages: number;
        posts: number;
        glossary: number;
    };
    setActiveTab: (tab: any) => void;
}

export default function AdminModuleGrid({ stats, setActiveTab }: AdminModuleGridProps) {
    const modules = [
        {
            id: 'offers',
            title: 'The Emporium',
            description: 'Sales pages, bundles, and time-limited offers.',
            icon: Megaphone,
            metric: `${stats.offers} Live`,
            color: 'bg-indigo-500',
        },
        {
            id: 'products',
            title: 'Product Vault',
            description: 'Inventory management and digital asset delivery.',
            icon: ShoppingBag,
            metric: stats.products.toString(),
            color: 'bg-blue-500',
        },
        {
            id: 'subscribers',
            title: 'Inner Circle',
            description: 'User relationships, sub lists, and segmenting.',
            icon: Users,
            metric: stats.subscribers.toString(),
            color: 'bg-rose-500',
        },
        {
            id: 'messages',
            title: 'Inbox',
            description: 'Direct inquiries and customer support requests.',
            icon: MessageSquare,
            metric: stats.messages > 0 ? `${stats.messages} New` : 'Clear',
            color: 'bg-amber-500',
        },
        {
            id: 'blog',
            title: 'Editorial',
            description: 'Content strategy, blog posts, and mastery guides.',
            icon: PenTool,
            metric: stats.posts.toString(),
            color: 'bg-emerald-500',
        },
        {
            id: 'glossary',
            title: 'Intelligence',
            description: 'Encyclopedic knowledge base and SEO glossary terms.',
            icon: BookOpen,
            metric: stats.glossary.toString(),
            color: 'bg-purple-500',
        },
        {
            id: 'warehouse',
            title: 'Warehouse',
            description: 'Bulk file management and download packages.',
            icon: Package,
            color: 'bg-slate-600',
        },
        {
            id: 'media',
            title: 'Media Library',
            description: 'Visual assets, product shots, and marketing imagery.',
            icon: Image,
            color: 'bg-cyan-500',
        },
        {
            id: 'settings',
            title: 'Command Settings',
            description: 'Global configurations, themes, and identity rules.',
            icon: Settings,
            color: 'bg-neutral-500',
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {modules.map((mod) => (
                <ModuleCard
                    key={mod.id}
                    title={mod.title}
                    description={mod.description}
                    icon={mod.icon}
                    metric={mod.metric}
                    color={mod.color}
                    onClick={() => setActiveTab(mod.id as any)}
                />
            ))}
        </div>
    );
}
