import React from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, BarChart3, Heart, Users, Activity } from "lucide-react";

interface MarketDemandProps {
  demand: {
    demandScore: string;
    passionScore: string;
    saturationScore: string;
    trendStatus: string;
  };
}

const MarketDemandSection: React.FC<MarketDemandProps> = ({ demand }) => {
  const getScoreValue = (score: string) => {
    return parseFloat(score.split('/')[0]) * 10;
  };

  return (
    <Card className="p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 text-slate-100 dark:text-slate-800 pointer-events-none">
        <TrendingUp size={120} strokeWidth={1} />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-8 flex items-center gap-2">
          <BarChart3 size={16} className="text-indigo-600" /> Market Intelligence
        </h3>
        
        <div className="space-y-8">
          {/* Demand Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1.5"><Users size={12} /> Market Demand</span>
              <span className="text-indigo-600">{demand.demandScore}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                style={{ width: `${getScoreValue(demand.demandScore)}%` }}
              ></div>
            </div>
          </div>

          {/* Passion Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1.5"><Heart size={12} /> Passion Depth</span>
              <span className="text-rose-600">{demand.passionScore}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-500 rounded-full transition-all duration-1000" 
                style={{ width: `${getScoreValue(demand.passionScore)}%` }}
              ></div>
            </div>
          </div>

          {/* Saturation Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span className="flex items-center gap-1.5"><Activity size={12} /> Market Saturation</span>
              <span className="text-emerald-600">{demand.saturationScore}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                style={{ width: `${getScoreValue(demand.saturationScore)}%` }}
              ></div>
            </div>
          </div>

          {/* Trend Status */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Velocity</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase border border-indigo-100 dark:border-indigo-800">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
              {demand.trendStatus}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MarketDemandSection;
