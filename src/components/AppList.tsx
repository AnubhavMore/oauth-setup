import React, { useState, useMemo } from 'react';
import { OAuthGuide } from '@/types/oauth';
import { AppCard } from './AppCard';
import { filterGuides } from '@/lib/oauth-utils';
import { Search, Sparkles, Filter, X } from 'lucide-react';

interface AppListProps {
  guides: OAuthGuide[];
  selectedGuide: OAuthGuide | null;
  onSelectGuide: (guide: OAuthGuide) => void;
  onOpenLiveGeneratorWithQuery: (query: string) => void;
}

const CATEGORIES = ['All', 'Communication', 'Productivity & Cloud', 'Productivity & Knowledge', 'CRM & Enterprise', 'CRM & Marketing', 'Developer Tools'];
const DIFFICULTIES = ['All', 'Easy', 'Moderate', 'Complex', 'Enterprise'];

export function AppList({
  guides,
  selectedGuide,
  onSelectGuide,
  onOpenLiveGeneratorWithQuery,
}: AppListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const filteredGuides = useMemo(() => {
    return filterGuides(guides, searchQuery, selectedCategory, selectedDifficulty);
  }, [guides, searchQuery, selectedCategory, selectedDifficulty]);

  return (
    <div className="flex flex-col h-full bg-[#0a0c12] border-r border-[#1a1f2e]">
      {/* Search Bar & Filters Header */}
      <div className="p-4 border-b border-[#1a1f2e] space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by app, scope, auth type..."
            className="w-full bg-[#121520] border border-[#232736] focus:border-indigo-500 rounded-lg pl-9 pr-8 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Badges Row: Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-md transition-all font-medium ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-[#141824] text-zinc-400 hover:text-zinc-200 hover:bg-[#1b2030]'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat.split('&')[0].trim()}
            </button>
          ))}
        </div>

        {/* Difficulty Filter Selector */}
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1 text-[11px] text-zinc-400">
            <Filter className="w-3 h-3 text-zinc-400" />
            Difficulty:
          </span>
          <div className="flex items-center gap-1">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-zinc-700 text-white font-semibold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guide Cards Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredGuides.length > 0 ? (
          filteredGuides.map((guide) => (
            <AppCard
              key={guide.id}
              guide={guide}
              isSelected={selectedGuide?.id === guide.id}
              onSelect={onSelectGuide}
            />
          ))
        ) : (
          <div className="py-12 text-center space-y-4 px-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300">No pre-built guide found</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                We have not curated &quot;{searchQuery}&quot; into the static library yet.
              </p>
            </div>
            <button
              onClick={() => onOpenLiveGeneratorWithQuery(searchQuery)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Research &quot;{searchQuery || 'App'}&quot; Live with AI Agent</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Banner */}
      <div className="p-3 bg-[#0d0f17] border-t border-[#1a1f2e] flex items-center justify-between text-xs text-zinc-400">
        <span>Showing {filteredGuides.length} of {guides.length} guides</span>
        <button
          onClick={() => onOpenLiveGeneratorWithQuery('')}
          className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 text-[11px]"
        >
          <Sparkles className="w-3 h-3" />
          <span>Research New App</span>
        </button>
      </div>
    </div>
  );
}
