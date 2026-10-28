import React from 'react';
import { Compass, Sparkles, ShieldCheck, Clock, Bot } from 'lucide-react';
import { calculateLibraryStats } from '@/lib/oauth-utils';
import { OAuthGuide } from '@/types/oauth';

interface HeaderProps {
  guides: OAuthGuide[];
  onOpenLiveGenerator?: () => void;
  activeView: 'library' | 'live-generator';
  setActiveView: (view: 'library' | 'live-generator') => void;
}

export function Header({
  guides,
  onOpenLiveGenerator,
  activeView,
  setActiveView,
}: HeaderProps) {
  const stats = calculateLibraryStats(guides);

  return (
    <header className="border-b border-[#1e2230] bg-[#0c0e14]/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-white tracking-tight">OAuth Setup Navigator</h1>
              <span className="px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                APM Integration Lab
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Clear path, effort vs wait time, and AI agent execution boundaries for 100+ providers
            </p>
          </div>
        </div>

        {/* Global Stats Pill & Live Agent Toggle */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="hidden lg:flex items-center space-x-4 px-3 py-1.5 rounded-lg bg-[#141824] border border-[#232736] text-xs text-zinc-300">
            <div className="flex items-center space-x-1.5" title="Pre-built verified archetypes">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong className="text-white">{stats.totalGuides}</strong> Curated Apps</span>
            </div>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center space-x-1.5" title="Average developer hands-on setup time">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Avg Dev: <strong className="text-white">{stats.avgDevTime}m</strong></span>
            </div>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center space-x-1.5" title="Average tasks automatable by an AI agent">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span><strong className="text-white">{stats.avgAutomation}%</strong> Agent Auto</span>
            </div>
          </div>

          {/* Navigation Mode Buttons */}
          <div className="flex items-center p-1 bg-[#141824] rounded-lg border border-[#232736]">
            <button
              onClick={() => setActiveView('library')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeView === 'library'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Curated Guides
            </button>
            <button
              onClick={() => {
                setActiveView('live-generator');
                if (onOpenLiveGenerator) onOpenLiveGenerator();
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeView === 'live-generator'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-zinc-400 hover:text-indigo-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live AI Generator</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
