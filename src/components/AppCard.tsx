import React from 'react';
import { OAuthGuide } from '@/types/oauth';
import { getDifficultyColor } from '@/lib/oauth-utils';
import { Clock, Hourglass, Bot, ArrowRight, ShieldAlert } from 'lucide-react';

interface AppCardProps {
  guide: OAuthGuide;
  isSelected: boolean;
  onSelect: (guide: OAuthGuide) => void;
}

export function AppCard({ guide, isSelected, onSelect }: AppCardProps) {
  const diffColor = getDifficultyColor(guide.difficulty);

  return (
    <div
      onClick={() => onSelect(guide)}
      className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
        isSelected
          ? 'bg-[#151926] border-indigo-500/80 shadow-md shadow-indigo-500/10'
          : 'bg-[#10121a] hover:bg-[#131622] border-[#1d2232] hover:border-zinc-700/60'
      }`}
    >
      {/* Top Row: App Name + Difficulty Badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-zinc-100 group-hover:text-white text-sm flex items-center gap-1.5">
            {guide.appName}
            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>}
          </h3>
          <p className="text-[11px] text-zinc-400 font-medium mt-0.5">{guide.category}</p>
        </div>
        <span
          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${diffColor.bg} ${diffColor.text} ${diffColor.border}`}
        >
          {guide.difficulty}
        </span>
      </div>

      {/* Summary Snippet */}
      <p className="text-xs text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
        {guide.summary}
      </p>

      {/* Timing & Friction Metric Chips */}
      <div className="mt-3 pt-2.5 border-t border-[#1a1f2e] flex flex-wrap items-center justify-between text-[11px] gap-2">
        <div className="flex items-center space-x-1 text-zinc-300" title="Active developer hands-on time">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{guide.estimatedDevTimeMinutes}m dev</span>
        </div>

        <div className="flex items-center space-x-1 text-zinc-300" title="Provider queue / approval wait time">
          <Hourglass className="w-3.5 h-3.5 text-amber-400" />
          <span>{guide.estimatedApprovalWaitDays}</span>
        </div>

        <div className="flex items-center space-x-1 text-zinc-300" title="Agent automation readiness">
          <Bot className="w-3.5 h-3.5 text-purple-400" />
          <span>{guide.agentAutomationPercentage}% auto</span>
        </div>
      </div>

      {/* Review required indicator tag */}
      {guide.requiresAppReview && (
        <div className="mt-2 flex items-center space-x-1 text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 w-fit">
          <ShieldAlert className="w-3 h-3" />
          <span>Provider Approval Review Blocks Production</span>
        </div>
      )}
    </div>
  );
}
