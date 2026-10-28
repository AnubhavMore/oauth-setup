'use client';

import React, { useState, useEffect, useRef } from 'react';
import { OAuthGuide } from '@/types/oauth';
import { Sparkles, ArrowRight, Loader2, Globe, CheckCircle2, AlertTriangle, Key, Search } from 'lucide-react';
import { FrictionGauge } from './FrictionGauge';

interface LiveGeneratorProps {
  initialQuery?: string;
  onGuideGenerated: (guide: OAuthGuide) => void;
  onCancel: () => void;
}

const PRESET_SUGGESTIONS = [
  { name: 'Linear', docUrl: 'https://developers.linear.app/docs/oauth/authentication', category: 'Project Management' },
  { name: 'Plaid', docUrl: 'https://plaid.com/docs/link/oauth/', category: 'Fintech & Banking' },
  { name: 'Zoom', docUrl: 'https://developers.zoom.us/docs/internal-apps/oauth/', category: 'Communication' },
  { name: 'Spotify', docUrl: 'https://developer.spotify.com/documentation/web-api/tutorials/code-flow', category: 'Media' },
];

const AGENT_THOUGHT_STEPS = [
  { id: 1, title: 'Discovering official developer portal & OAuth 2.0 specs', icon: '🔍' },
  { id: 2, title: 'Extracting grant types, PKCE requirements, & token lifetimes', icon: '⚡' },
  { id: 3, title: 'Auditing review friction, restricted scope gates & CASA audits', icon: '🛡️' },
  { id: 4, title: 'Attributing Agent Automatable vs Human 2FA setup boundaries', icon: '🤖' },
  { id: 5, title: 'Grounding evidence, verifying citations & synthesizing structured guide', icon: '✅' },
];

export function LiveGenerator({
  initialQuery = '',
  onGuideGenerated,
  onCancel,
}: LiveGeneratorProps) {
  const [appName, setAppName] = useState(initialQuery);
  const [docUrl, setDocUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentThoughtIndex, setCurrentThoughtIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [generatedGuide, setGeneratedGuide] = useState<OAuthGuide | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Cycle thought steps during generation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setCurrentThoughtIndex(0);
      interval = setInterval(() => {
        setCurrentThoughtIndex((prev) => (prev < AGENT_THOUGHT_STEPS.length - 1 ? prev + 1 : prev));
      }, 800); // 800ms per step feels snappy and dynamic
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Scroll to result when generated
  useEffect(() => {
    if (generatedGuide && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [generatedGuide]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedGuide(null);

    try {
      const res = await fetch('/api/generate-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName: appName.trim(),
          docUrl: docUrl.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate guide.');
      }

      setGeneratedGuide(data.guide);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while communicating with the agent.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectPreset = (preset: { name: string; docUrl: string }) => {
    setAppName(preset.name);
    setDocUrl(preset.docUrl);
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-6 md:p-8 space-y-8 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-time Documentation Research Agent</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Investigate & Generate OAuth Guide
        </h2>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Submit any app or developer documentation link. An AI agent will investigate the provider&apos;s authentication specs, analyze approval friction, attribute human vs agent boundaries, and generate a verified guide.
        </p>
      </div>

      {/* Input Form */}
      <div className="p-6 rounded-2xl bg-[#111420] border border-[#1e2334] shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* App Name Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Target App / Platform Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="e.g. Linear, YouTube, Plaid, Zoom, Spotify"
                  disabled={isLoading}
                  className="w-full bg-[#0a0c12] border border-[#232736] focus:border-indigo-500 rounded-lg pl-9 pr-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Doc URL Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                <span>Official Documentation URL</span>
                <span className="text-[11px] text-zinc-500 font-normal">Optional (Crawl Grounding)</span>
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  placeholder="e.g. https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps"
                  disabled={isLoading}
                  className="w-full bg-[#0a0c12] border border-[#232736] focus:border-indigo-500 rounded-lg pl-9 pr-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center flex-wrap gap-2 pt-1 text-xs">
            <span className="text-zinc-500">Quick Test Candidates:</span>
            {PRESET_SUGGESTIONS.map((preset) => (
              <button
                type="button"
                key={preset.name}
                onClick={() => selectPreset(preset)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-md bg-[#161a26] hover:bg-indigo-600/20 text-zinc-300 hover:text-indigo-300 border border-[#232736] text-[11px] transition-all disabled:opacity-50"
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-[#141824] hover:bg-[#1b2030] text-zinc-300 text-xs font-medium border border-[#232736] transition-all disabled:opacity-50"
            >
              Cancel & Return
            </button>

            <button
              type="submit"
              disabled={isLoading || !appName.trim()}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Agent Investigating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Live Agent Research</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Agent Reasoning Feed (Active during generation) */}
        {isLoading && (
          <div className="p-4 rounded-xl bg-[#0b0d14] border border-[#1e2334] space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-[#1a1f2e] pb-2">
              <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                Live Agent Reasoning Feed
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">Autonomous Pipeline Running (~2-4s)</span>
            </div>

            <div className="space-y-2">
              {AGENT_THOUGHT_STEPS.map((step, idx) => {
                const isActive = idx === currentThoughtIndex;
                const isPassed = idx < currentThoughtIndex;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg text-xs transition-all ${
                      isActive
                        ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-medium'
                        : isPassed
                        ? 'text-zinc-400 opacity-70'
                        : 'text-zinc-600'
                    }`}
                  >
                    <span className="text-sm">{step.icon}</span>
                    <span className="flex-1 font-mono text-[11px]">{step.title}</span>
                    {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {isActive && <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Feedback */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-rose-300 font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Investigation Error</span>
            </div>
            <p className="text-rose-200/90 leading-relaxed">{error}</p>
            {error.includes('GEMINI_API_KEY') && (
              <div className="p-3 bg-[#0d0f17] rounded-lg border border-rose-500/20 text-zinc-400 space-y-1">
                <div className="flex items-center space-x-1.5 text-zinc-200 font-mono text-[11px]">
                  <Key className="w-3 h-3 text-amber-400" />
                  <span>Setup Reminder:</span>
                </div>
                <p className="text-[11px]">
                  Add your Google Gemini API key to a <code className="text-indigo-300 font-mono">.env.local</code> file:
                </p>
                <pre className="p-2 bg-black/50 rounded font-mono text-[11px] text-emerald-400">
                  GEMINI_API_KEY=AIzaSy...
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Generated Guide Preview & Success Handoff */}
        {generatedGuide && !isLoading && (
          <div
            ref={resultRef}
            className="p-6 rounded-xl bg-gradient-to-b from-[#131726] to-[#0d0f17] border border-indigo-500/40 space-y-5 animate-fade-in"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Investigation Completed & Grounded</span>
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">{generatedGuide.appName}</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {generatedGuide.category} • <span className="font-mono text-zinc-300">{generatedGuide.authType}</span>
                </p>
              </div>

              <button
                onClick={() => onGuideGenerated(generatedGuide)}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
              >
                <span>Open in Interactive Reader</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 bg-[#090b10] p-4 rounded-xl border border-[#1e2334] leading-relaxed">
              {generatedGuide.summary}
            </p>

            {/* Friction Breakdown */}
            <FrictionGauge guide={generatedGuide} />

            {/* Action Bar */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 border-t border-[#1a1f2e]">
              <span>
                Synthesized <strong className="text-white font-mono">{generatedGuide.steps.length} setup steps</strong> with task ownership badges and pitfalls.
              </span>
              <button
                onClick={() => onGuideGenerated(generatedGuide)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#161b28] hover:bg-[#1e2436] text-indigo-300 hover:text-white border border-indigo-500/20 transition-all"
              >
                <span>Explore Checklist, Code & Sources</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
