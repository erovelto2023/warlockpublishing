import React from 'react';
import { Card } from "@/components/ui/card";
import { Terminal, Copy, Image as ImageIcon, Megaphone, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AIPromptProps {
  prompts: {
    sceneGeneratorPrompt: string;
    marketingHookPrompt: string;
    aiImagePrompt: string;
  };
}

const AIPromptCommandCenter: React.FC<AIPromptProps> = ({ prompts }) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 font-serif italic">
          <Terminal className="text-indigo-600" /> AI Command Center
        </h2>
        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
          Ready to Execute
        </span>
      </div>
      
      <div className="grid gap-6">
        {/* Scene Generator */}
        <Card className="p-0 overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-lg">
          <div className="bg-slate-50 dark:bg-slate-900 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2 text-indigo-600">
              <Send size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Scene Generator Prompt</span>
            </div>
            <button 
              onClick={() => copyToClipboard(prompts.sceneGeneratorPrompt, 'Scene Prompt')}
              className="text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <Copy size={16} />
            </button>
          </div>
          <div className="p-6">
            <pre className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-mono bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {prompts.sceneGeneratorPrompt}
            </pre>
          </div>
        </Card>

        {/* Marketing Hook */}
        <Card className="p-0 overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-lg">
          <div className="bg-slate-50 dark:bg-slate-900 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2 text-emerald-600">
              <Megaphone size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Marketing Hook Prompt</span>
            </div>
            <button 
              onClick={() => copyToClipboard(prompts.marketingHookPrompt, 'Marketing Prompt')}
              className="text-slate-400 hover:text-emerald-600 transition-colors"
            >
              <Copy size={16} />
            </button>
          </div>
          <div className="p-6">
            <pre className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-mono bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {prompts.marketingHookPrompt}
            </pre>
          </div>
        </Card>

        {/* Image Prompt */}
        <Card className="p-0 overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-lg">
          <div className="bg-slate-50 dark:bg-slate-900 px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2 text-amber-600">
              <ImageIcon size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">AI Image Prompt</span>
            </div>
            <button 
              onClick={() => copyToClipboard(prompts.aiImagePrompt, 'Image Prompt')}
              className="text-slate-400 hover:text-amber-600 transition-colors"
            >
              <Copy size={16} />
            </button>
          </div>
          <div className="p-6">
            <pre className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap font-mono bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              {prompts.aiImagePrompt}
            </pre>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AIPromptCommandCenter;
