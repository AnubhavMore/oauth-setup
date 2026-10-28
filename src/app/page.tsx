'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { AppList } from '@/components/AppList';
import { GuideDetail } from '@/components/GuideDetail';
import { LiveGenerator } from '@/components/LiveGenerator';
import { STATIC_GUIDES } from '@/data/staticGuides';
import { OAuthGuide } from '@/types/oauth';

function NavigatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeView, setActiveView] = useState<'library' | 'live-generator'>('library');
  const [selectedGuide, setSelectedGuide] = useState<OAuthGuide>(STATIC_GUIDES[0]);
  const [initialSearchQuery, setInitialSearchQuery] = useState('');
  const [guidesList, setGuidesList] = useState<OAuthGuide[]>(STATIC_GUIDES);

  // Sync selected guide with ?app= query parameter
  useEffect(() => {
    const appQuery = searchParams.get('app');
    if (appQuery) {
      const match = guidesList.find((g) => g.id.toLowerCase() === appQuery.toLowerCase());
      if (match) {
        setSelectedGuide(match);
        setActiveView('library');
      }
    }
  }, [searchParams, guidesList]);

  const handleSelectGuide = (guide: OAuthGuide) => {
    setSelectedGuide(guide);
    setActiveView('library');
    router.push(`?app=${guide.id}`, { scroll: false });
  };

  const handleOpenLiveGenerator = (query: string = '') => {
    setInitialSearchQuery(query);
    setActiveView('live-generator');
  };

  const handleGuideGenerated = (newGuide: OAuthGuide) => {
    // Add to active library list if not already present
    setGuidesList((prev) => {
      const exists = prev.some((g) => g.id === newGuide.id);
      return exists ? prev.map((g) => (g.id === newGuide.id ? newGuide : g)) : [newGuide, ...prev];
    });

    // Select the new guide and switch view to the interactive reader
    setSelectedGuide(newGuide);
    setActiveView('library');
    router.push(`?app=${newGuide.id}`, { scroll: false });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#090a0f]">
      {/* Top Application Header */}
      <Header
        guides={guidesList}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenLiveGenerator={() => handleOpenLiveGenerator('')}
      />

      {/* Main Dual-Pane Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {activeView === 'library' ? (
          <>
            {/* Left Pane: Master App List */}
            <div className="w-full md:w-80 lg:w-[380px] shrink-0 h-full flex flex-col border-r border-[#1a1f2e]">
              <AppList
                guides={guidesList}
                selectedGuide={selectedGuide}
                onSelectGuide={handleSelectGuide}
                onOpenLiveGeneratorWithQuery={handleOpenLiveGenerator}
              />
            </div>

            {/* Right Pane: Detailed Interactive Guide Reader */}
            <div className="hidden md:block flex-1 h-full overflow-hidden bg-[#090b10]">
              {selectedGuide ? (
                <GuideDetail guide={selectedGuide} />
              ) : (
                <div className="h-full flex items-center justify-center p-8 text-center text-zinc-500">
                  <p>Select an app on the left to inspect its OAuth guide.</p>
                </div>
              )}
            </div>

            {/* Mobile View Toggle */}
            <div className="md:hidden flex-1 h-full overflow-hidden">
              {selectedGuide && <GuideDetail guide={selectedGuide} />}
            </div>
          </>
        ) : (
          /* Live AI Generator View */
          <div className="flex-1 h-full overflow-y-auto bg-[#090a0f]">
            <LiveGenerator
              initialQuery={initialSearchQuery}
              onGuideGenerated={handleGuideGenerated}
              onCancel={() => setActiveView('library')}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#090a0f] flex items-center justify-center text-zinc-400 text-sm">
          Loading OAuth Setup Navigator...
        </div>
      }
    >
      <NavigatorContent />
    </Suspense>
  );
}
