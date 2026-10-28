export type ActorType = 'AGENT_AUTOMATABLE' | 'HUMAN_REQUIRED' | 'HYBRID';

export type DifficultyLevel = 'Easy' | 'Moderate' | 'Complex' | 'Enterprise';

export type VerificationStatus = 
  | 'VERIFIED_OFFICIAL_DOCS' 
  | 'SETUP_ATTEMPTED' 
  | 'COMMUNITY_REPORTED' 
  | 'UNCERTAIN';

export interface OAuthStep {
  stepNumber: number;
  title: string;
  actor: ActorType;
  actorRationale: string; // Explains why an agent can or cannot do this
  description: string;
  actionUrl?: string; // Direct link to provider developer portal
  codeSnippet?: string; // Example manifest, curl, or configuration block
  pitfalls?: string[]; // Traps, tricky defaults, redirect URI gotchas
}

export interface VerificationLog {
  status: VerificationStatus;
  lastChecked: string; // ISO date format YYYY-MM-DD
  sources: { title: string; url: string }[];
  verifiedClaims: string[];
  uncertaintiesOrCaveats: string[]; // Honest disclosures of what could not be tested
}

export interface OAuthGuide {
  id: string; // URL slug, e.g., 'slack', 'google-workspace'
  appName: string;
  appUrl: string;
  category: string; // e.g. "Communication", "Productivity", "CRM", "Developer Tools"
  summary: string; // 1-2 sentence executive summary for builders
  authType: string; // e.g. "OAuth 2.0 (Authorization Code + PKCE)", "OAuth 2.0 (Bot Manifest)"
  difficulty: DifficultyLevel;
  
  // Effort vs. Wait Time Breakdown
  estimatedDevTimeMinutes: number; // Active developer hands-on time
  estimatedApprovalWaitDays: string; // Idle wait time (e.g. "Instant (0 days)", "2 - 6 weeks")
  requiresAppReview: boolean;
  agentAutomationPercentage: number; // % of total tasks an AI agent can handle autonomously

  // Prerequisites & Friction Triggers
  prerequisites: {
    paidAccountRequired: boolean;
    domainVerificationRequired: boolean;
    privacyPolicyRequired: boolean;
    securityAssessmentRequired: boolean; // e.g. CASA Tier 2/3, SOC2
    notes: string[];
  };

  // Scopes & Nuances
  scopesOverview: {
    defaultScopes: string[];
    sensitiveScopesWarning?: string;
  };
  redirectUriNuances: string[];

  // Execution Steps
  steps: OAuthStep[];

  // Trust & Evidence Grounding
  verification: VerificationLog;
}
