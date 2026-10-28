import React from 'react';
import { Clock, Hourglass, ShieldAlert, ShieldCheck, Bot } from 'lucide-react';
import { OAuthGuide } from '@/types/oauth';

interface FrictionGaugeProps {
  guide: OAuthGuide;
}

export function FrictionGauge({ guide }: FrictionGaugeProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
      {/* 1. Developer Hands-on Effort */}
      <div className="p-4 rounded-xl bg-[#111420] border border-[#1e2334] relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-400" />
            Active Dev Effort
          </span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
            Hands-on
          </span>
        </div>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-white font-mono">
            {guide.estimatedDevTimeMinutes}
          </span>
          <span className="text-xs text-zinc-400">minutes</span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-400">
          Coding routes, registering apps, and configuring redirect URIs.
        </p>
      </div>

      {/* 2. Provider Approval Queue (Wait Time) */}
      <div className="p-4 rounded-xl bg-[#111420] border border-[#1e2334] relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-medium flex items-center gap-1.5">
            <Hourglass className="w-4 h-4 text-amber-400" />
            Provider Wait Time
          </span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
            Approval Queue
          </span>
        </div>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-xl font-bold tracking-tight text-white">
            {guide.estimatedApprovalWaitDays}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px]">
          {guide.requiresAppReview ? (
            <span className="text-rose-400 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Mandatory review blocks launch
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Instant self-serve (No review gate)
            </span>
          )}
        </div>
      </div>

      {/* 3. AI Agent Automation Capability */}
      <div className="p-4 rounded-xl bg-[#111420] border border-[#1e2334] relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-medium flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-purple-400" />
            Agent Automatable
          </span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
            {guide.agentAutomationPercentage}%
          </span>
        </div>
        <div className="mt-3 w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${guide.agentAutomationPercentage}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-zinc-400 flex items-center justify-between">
          <span>Agent handles setup files & API calls</span>
          <span className="text-zinc-500">{100 - guide.agentAutomationPercentage}% Human 2FA/Keys</span>
        </p>
      </div>
    </div>
  );
}
