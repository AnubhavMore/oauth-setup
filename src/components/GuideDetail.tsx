'use client';

import React, { useState } from 'react';
import { OAuthGuide } from '@/types/oauth';
import { FrictionGauge } from './FrictionGauge';
import { StepChecklist } from './StepChecklist';
import { generateMarkdownBrief } from '@/lib/export-markdown';
import { getDifficultyColor } from '@/lib/oauth-utils';
import {
  Share2,
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Check,
  Info,
} from 'lucide-react';

interface GuideDetailProps {
  guide: OAuthGuide;
}

export function GuideDetail({ guide }: GuideDetailProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const diffColor = getDifficultyColor(guide.difficulty);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}?app=${guide.id}`;
      navigator.clipboard.writeText(url);
      showToast('Deep-link copied to clipboard!');
    }
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownBrief(guide);
    navigator.clipboard.writeText(md);
    showToast('Markdown team brief copied!');
  };

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-8 space-y-8 bg-[#090b10]">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-2xl shadow-indigo-500/40 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Guide Header Banner */}
      <div className="space-y-4 pb-6 border-b border-[#1a1f2e]">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-2xl font-bold tracking-tight text-white">{guide.appName}</h2>
              <span
                className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${diffColor.bg} ${diffColor.text} ${diffColor.border}`}
              >
                {guide.difficulty} Difficulty
              </span>
            </div>
            <div className="mt-1 flex items-center space-x-3 text-xs text-zinc-400">
              <span>{guide.category}</span>
              <span>•</span>
              <span className="font-mono text-zinc-300">{guide.authType}</span>
            </div>
          </div>

          {/* Action Buttons: Share & Export */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1b2030] text-zinc-200 border border-[#232736] text-xs font-medium transition-all"
              title="Copy shareable URL"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Share Link</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1b2030] text-zinc-200 border border-[#232736] text-xs font-medium transition-all"
              title="Export as Markdown for Jira, Slack, or GitHub PR"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Brief (Markdown)</span>
            </button>

            {guide.appUrl && (
              <a
                href={guide.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-500/20 transition-all"
              >
                <span>Provider Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Executive Summary */}
        <p className="text-sm text-zinc-300 leading-relaxed bg-[#111420] p-4 rounded-xl border border-[#1e2334]">
          {guide.summary}
        </p>
      </div>

      {/* Visual Duality: Effort vs. Wait Time (Friction Gauge) */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-400" />
          Friction Breakdown & Velocity Metrics
        </h3>
        <FrictionGauge guide={guide} />
      </section>

      {/* Prerequisites & Friction Triggers */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
          Prerequisites & Potential Blockers
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div
            className={`p-3 rounded-lg border ${
              guide.prerequisites.paidAccountRequired
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-[#111420] border-[#1e2334] text-zinc-300'
            }`}
          >
            <div className="font-semibold text-zinc-200">Paid Account</div>
            <div className="text-[11px] mt-1 text-zinc-400">
              {guide.prerequisites.paidAccountRequired ? '⚠️ Paid Plan Required' : '✅ Free Tier Supported'}
            </div>
          </div>

          <div
            className={`p-3 rounded-lg border ${
              guide.prerequisites.domainVerificationRequired
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-[#111420] border-[#1e2334] text-zinc-300'
            }`}
          >
            <div className="font-semibold text-zinc-200">Domain Verification</div>
            <div className="text-[11px] mt-1 text-zinc-400">
              {guide.prerequisites.domainVerificationRequired ? '⚠️ DNS/HTML Required' : '✅ None Required'}
            </div>
          </div>

          <div
            className={`p-3 rounded-lg border ${
              guide.prerequisites.privacyPolicyRequired
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-[#111420] border-[#1e2334] text-zinc-300'
            }`}
          >
            <div className="font-semibold text-zinc-200">Privacy Policy URL</div>
            <div className="text-[11px] mt-1 text-zinc-400">
              {guide.prerequisites.privacyPolicyRequired ? '⚠️ Public URL Required' : '✅ Optional for Dev'}
            </div>
          </div>

          <div
            className={`p-3 rounded-lg border ${
              guide.prerequisites.securityAssessmentRequired
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-[#111420] border-[#1e2334] text-zinc-300'
            }`}
          >
            <div className="font-semibold text-zinc-200">Security Audit / CASA</div>
            <div className="text-[11px] mt-1 text-zinc-400">
              {guide.prerequisites.securityAssessmentRequired ? '🚨 Third-Party Audit' : '✅ No Audit Needed'}
            </div>
          </div>
        </div>

        {guide.prerequisites.notes.length > 0 && (
          <div className="p-3 rounded-lg bg-[#0e111a] border border-[#1a1f2e] text-xs text-zinc-400 space-y-1">
            <span className="font-semibold text-zinc-300">Prerequisite Nuances:</span>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              {guide.prerequisites.notes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Scopes & Redirect URI Rules */}
      <section className="space-y-3">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
          Scopes & Redirect URI Traps
        </h3>
        <div className="p-4 rounded-xl bg-[#111420] border border-[#1e2334] space-y-3 text-xs">
          <div>
            <span className="text-zinc-400 font-medium">Standard / Recommended Scopes: </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {guide.scopesOverview.defaultScopes.map((scope, idx) => (
                <code
                  key={idx}
                  className="px-2 py-0.5 rounded bg-[#181d2a] text-indigo-300 border border-indigo-500/20 font-mono text-[11px]"
                >
                  {scope}
                </code>
              ))}
            </div>
          </div>

          {guide.scopesOverview.sensitiveScopesWarning && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300/90 text-[11px] flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{guide.scopesOverview.sensitiveScopesWarning}</span>
            </div>
          )}

          <div className="pt-2 border-t border-[#1a1f2e]">
            <span className="text-zinc-400 font-medium">Redirect URI Gotchas & Constraints:</span>
            <ul className="mt-1.5 space-y-1 list-disc list-inside text-zinc-400">
              {guide.redirectUriNuances.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Step-by-Step Walkthrough with Checklist */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
            Step-by-Step Implementation Flow
          </h3>
          <span className="text-[11px] text-zinc-400">Interactive Progress Tracker</span>
        </div>
        <StepChecklist guide={guide} steps={guide.steps} />
      </section>

      {/* Grounded Verification Log & Source Evidence */}
      <section className="space-y-3 pt-4 border-t border-[#1a1f2e]">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verification & Evidence Grounding
          </h3>
          <span className="text-[11px] text-zinc-400">
            Last Checked: <strong className="text-zinc-300">{guide.verification.lastChecked}</strong>
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0d0f17] border border-[#1a1f2e] space-y-4 text-xs">
          {/* Official Documentation Sources */}
          <div>
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              Official Provider Sources:
            </span>
            <div className="flex flex-wrap gap-2">
              {guide.verification.sources.map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-[#141824] hover:bg-[#1a2030] text-indigo-300 border border-indigo-500/20 text-[11px] transition-colors"
                >
                  <span>{src.title}</span>
                  <ExternalLink className="w-3 h-3 text-indigo-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Verified Claims */}
          <div>
            <span className="font-semibold text-zinc-300 block mb-1.5">Verified Facts & Guarantees:</span>
            <ul className="space-y-1">
              {guide.verification.verifiedClaims.map((claim, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-zinc-400">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{claim}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Honest Disclosures of Uncertainties / Limitations */}
          {guide.verification.uncertaintiesOrCaveats.length > 0 && (
            <div className="pt-2 border-t border-[#1a1f2e]">
              <span className="font-semibold text-zinc-300 block mb-1.5">
                Sound Judgment: Remaining Uncertainties & Edge Cases:
              </span>
              <ul className="space-y-1">
                {guide.verification.uncertaintiesOrCaveats.map((caveat, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-amber-400/90">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{caveat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
