import { Card } from "@/components/ui/card";

export default function AuthorityArticle({ content }: { content: string }) {
    if (!content) return null;

    return (
        <section className="mt-12">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 mb-8 px-4">
                Deep-Dive Authority Intel
            </h2>
            <Card className="p-8 md:p-16 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
                
                <div 
                    className="prose prose-slate dark:prose-invert max-w-none 
                    prose-h1:text-4xl prose-h1:font-black prose-h1:font-serif prose-h1:italic prose-h1:mb-8 prose-h1:tracking-tight
                    prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-slate-100 dark:prose-h2:border-slate-800 prose-h2:pb-2
                    prose-h3:text-xl prose-h3:font-bold prose-h3:mt-8 prose-h3:mb-4
                    prose-p:text-lg prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
                    prose-ul:my-6 prose-li:text-slate-600 dark:prose-li:text-slate-300 prose-li:mb-2
                    prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:italic prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800/30 prose-blockquote:p-6 prose-blockquote:rounded-r-xl
                    prose-table:border prose-table:border-slate-200 dark:prose-table:border-slate-800
                    prose-th:bg-slate-50 dark:prose-th:bg-slate-800/50 prose-th:p-4
                    prose-td:p-4 prose-td:border-t prose-td:border-slate-100 dark:prose-td:border-slate-800
                    [&_.cnn-fast-facts]:bg-slate-50 [&_.cnn-fast-facts]:dark:bg-slate-800/50 [&_.cnn-fast-facts]:border-l-8 [&_.cnn-fast-facts]:border-red-600 [&_.cnn-fast-facts]:p-8 [&_.cnn-fast-facts]:my-10 [&_.cnn-fast-facts]:rounded-r-2xl
                    [&_.cnn-fast-facts_h3]:text-red-600 [&_.cnn-fast-facts_h3]:uppercase [&_.cnn-fast-facts_h3]:text-xs [&_.cnn-fast-facts_h3]:font-black [&_.cnn-fast-facts_h3]:tracking-[0.3em] [&_.cnn-fast-facts_h3]:mb-4 [&_.cnn-fast-facts_h3]:mt-0
                    [&_.cnn-fast-facts_ul]:list-none [&_.cnn-fast-facts_ul]:pl-0 [&_.cnn-fast-facts_ul]:m-0
                    [&_.cnn-fast-facts_li]:text-base [&_.cnn-fast-facts_li]:font-bold [&_.cnn-fast-facts_li]:text-slate-900 [&_.cnn-fast-facts_li]:dark:text-white [&_.cnn-fast-facts_li]:mb-3 [&_.cnn-fast-facts_li]:relative [&_.cnn-fast-facts_li]:pl-6
                    [&_.cnn-fast-facts_li]:before:content-[''] [&_.cnn-fast-facts_li]:before:absolute [&_.cnn-fast-facts_li]:before:left-0 [&_.cnn-fast-facts_li]:before:top-2.5 [&_.cnn-fast-facts_li]:before:w-2 [&_.cnn-fast-facts_li]:before:h-2 [&_.cnn-fast-facts_li]:before:bg-red-600 [&_.cnn-fast-facts_li]:before:rounded-full
                    "
                    dangerouslySetInnerHTML={{ __html: content.replace(/src="http:\/\//g, 'src="https://') }}
                />

                <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>© Warlock Publishing Authority Hub</span>
                    <span>Knowledge Assets Verified</span>
                </div>
            </Card>
        </section>
    );
}
