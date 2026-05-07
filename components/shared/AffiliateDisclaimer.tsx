export default function AffiliateDisclaimer() {
    return (
        <div className="mt-24 pt-12 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-3xl mx-auto text-center px-4">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-relaxed">
                    Affiliate Disclosure: Some of the links on this page are affiliate links. 
                    If you click through and make a purchase, Warlock Publishing may receive a small commission at no additional cost to you. 
                    We only recommend products and services that we believe add value to our community of creators.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                    <div className="w-8 h-px bg-slate-200 dark:bg-slate-800"></div>
                    <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                    <div className="w-8 h-px bg-slate-200 dark:bg-slate-800"></div>
                </div>
            </div>
        </div>
    );
}
