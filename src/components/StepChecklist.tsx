'use client';

import React, { useState, useEffect } from 'react';
import { OAuthStep, OAuthGuide } from '@/types/oauth';
import { getActorBadge } from '@/lib/oauth-utils';
import { CheckCircle2, Circle, ExternalLink, Copy, Check, AlertTriangle, Terminal } from 'lucide-react';

interface StepChecklistProps {
  guide: OAuthGuide;
  steps: OAuthStep[];
}

export function StepChecklist({ guide, steps }: StepChecklistProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  // Load persistence from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`oauth_progress_${guide.id}`);
      if (stored) {
        setCompletedSteps(JSON.parse(stored));
      } else {
        setCompletedSteps({});
      }
    } catch {
      // Fallback if localStorage is unavailable
      setCompletedSteps({});
    }
  }, [guide.id]);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => {
      const updated = { ...prev, [stepNumber]: !prev[stepNumber] };
      try {
        localStorage.setItem(`oauth_progress_${guide.id}`, JSON.stringify(updated));
      } catch {
        // Ignore localStorage error
      }
      return updated;
    });
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / (steps.length || 1)) * 100);

  return (
    <div className="space-y-4">
      {/* Step Progress Tracker Bar */}
      <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#111420] border border-[#1e2334] text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-zinc-200">Execution Progress:</span>
          <span className="text-zinc-400">
            {completedCount} of {steps.length} steps completed ({progressPercent}%)
          </span>
        </div>
        <div className="w-32 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isDone = !!completedSteps[step.stepNumber];
          const badge = getActorBadge(step.actor);

          return (
            <div
              key={step.stepNumber}
              className={`p-5 rounded-xl border transition-all duration-200 ${
                isDone
                  ? 'bg-[#0f141a]/60 border-emerald-500/30 opacity-80'
                  : 'bg-[#111420] border-[#1e2334]'
              }`}
            >
              {/* Header: Checkbox + Title + Actor Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleStep(step.stepNumber)}
                    className="mt-0.5 text-zinc-500 hover:text-emerald-400 transition-colors"
                    title={isDone ? 'Mark step incomplete' : 'Mark step completed'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-500 hover:text-zinc-300" />
                    )}
                  </button>

                  <div>
                    <h4
                      className={`text-sm font-semibold tracking-tight ${
                        isDone ? 'line-through text-zinc-400' : 'text-zinc-100'
                      }`}
                    >
                      Step {step.stepNumber}: {step.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto pl-8 sm:pl-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}
                  >
                    {badge.label}
                  </span>

                  {step.actionUrl && (
                    <a
                      href={step.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-medium rounded-md bg-[#1a2030] hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
                    >
                      <span>Console</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Actor Rationale Callout */}
              <div className="mt-3 ml-8 p-2.5 rounded-lg bg-[#0d0f17] border border-[#1a1f2e] text-[11px] text-zinc-300 flex items-start space-x-2">
                <span className="font-semibold text-zinc-400 shrink-0">Why this actor:</span>
                <span className="text-zinc-400">{step.actorRationale}</span>
              </div>

              {/* Description */}
              <p className="mt-3 ml-8 text-xs text-zinc-300 leading-relaxed">
                {step.description}
              </p>

              {/* Code Snippet / Manifest Block */}
              {step.codeSnippet && (
                <div className="mt-3 ml-8 rounded-lg bg-[#090b10] border border-[#1e2334] overflow-hidden">
                  <div className="px-3 py-1.5 bg-[#0e111a] border-b border-[#1e2334] flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="flex items-center space-x-1 font-mono">
                      <Terminal className="w-3 h-3 text-indigo-400" />
                      <span>Configuration / Manifest</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(step.codeSnippet!, idx)}
                      className="flex items-center space-x-1 hover:text-white transition-colors"
                    >
                      {copiedCodeIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 text-[11px] font-mono text-zinc-300 overflow-x-auto leading-normal">
                    {step.codeSnippet}
                  </pre>
                </div>
              )}

              {/* Pitfalls & Gotchas */}
              {step.pitfalls && step.pitfalls.length > 0 && (
                <div className="mt-3 ml-8 space-y-1.5">
                  {step.pitfalls.map((pitfall, pIdx) => (
                    <div
                      key={pIdx}
                      className="flex items-start space-x-2 text-[11px] text-amber-300/90 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{pitfall}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
