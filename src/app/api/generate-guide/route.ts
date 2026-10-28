import { NextRequest, NextResponse } from 'next/server';
import { OAuthGuide } from '@/types/oauth';

// Strip HTML tags and script/style contents to extract raw documentation text
function extractTextFromHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Ordered by speed and uptime reliability
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.8-flash',
];

export async function POST(req: NextRequest) {
  try {
    const { appName, docUrl } = await req.json();

    if (!appName || typeof appName !== 'string') {
      return NextResponse.json({ error: 'App name is required.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'Missing GEMINI_API_KEY. Please provide a GEMINI_API_KEY in your environment variables (.env.local).',
        },
        { status: 500 }
      );
    }

    let scrapedDocContext = '';
    let fetchedUrl = docUrl;

    // Real-time documentation fetch if URL was provided
    if (docUrl && typeof docUrl === 'string' && docUrl.startsWith('http')) {
      try {
        const docResponse = await fetch(docUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          signal: AbortSignal.timeout(6000),
        });

        if (docResponse.ok) {
          const html = await docResponse.text();
          const cleanText = extractTextFromHtml(html);
          scrapedDocContext = cleanText.slice(0, 15000); // Feed up to 15,000 characters of grounded doc text
        }
      } catch (fetchErr) {
        console.warn('Could not fetch docUrl, falling back to model knowledge:', fetchErr);
      }
    }

    const systemPrompt = `You are an expert Principal Engineer & Senior Product Architect specializing in OAuth 2.0 integrations and AI agent developer tooling.
Your mission is to generate a comprehensive, highly accurate, production-grade OAuth setup guide for the requested app: "${appName}".

${
  scrapedDocContext
    ? `GROUNDING CONTEXT FETCHED DIRECTLY FROM OFFICIAL DOCUMENTATION (${fetchedUrl}):\n"""\n${scrapedDocContext}\n"""\nUse this documentation as the primary source of truth for endpoints, scopes, and setup steps.`
    : `Use your extensive, accurate knowledge of ${appName}'s official developer portal, OAuth 2.0 flow, and review policies.`
}

IMPORTANT REQUIREMENTS:
1. Every step must have an explicit "actor": "AGENT_AUTOMATABLE", "HUMAN_REQUIRED", or "HYBRID".
2. In "actorRationale", explain clearly why an AI agent can or cannot automate that step (e.g., "Requires human 2FA and organization billing credentials", or "Agent can generate complete manifest and register redirect URIs via API").
3. Clearly contrast Developer Effort Time (in minutes) vs Provider Wait Time (e.g., "Instant (0 days)", "3-5 business days", "2-4 weeks").
4. State whether official provider app review/approval blocks production usage ("requiresAppReview": true/false).
5. Highlight unexpected friction or blockers: paid plans, domain verification, privacy policy requirements, and security assessments (like Google CASA or Salesforce AppExchange).
6. Detail scopes, localhost redirect URI nuances (port wildcards, HTTP vs HTTPS).
7. In the "verification" block, list real official documentation links, verified facts, and honest disclosures of remaining uncertainties or edge cases.

Respond ONLY with valid JSON matching the following schema without markdown code fences:
{
  "id": "${appName.toLowerCase().replace(/[^a-z0-9]/g, '-')}",
  "appName": "${appName}",
  "appUrl": "https://...",
  "category": "e.g. Communication / Developer Tools / Productivity / CRM",
  "summary": "1-2 sentence executive summary for builders",
  "authType": "e.g. OAuth 2.0 (Authorization Code with PKCE)",
  "difficulty": "Easy" | "Moderate" | "Complex" | "Enterprise",
  "estimatedDevTimeMinutes": 30,
  "estimatedApprovalWaitDays": "Instant (0 days)",
  "requiresAppReview": false,
  "agentAutomationPercentage": 75,
  "prerequisites": {
    "paidAccountRequired": false,
    "domainVerificationRequired": false,
    "privacyPolicyRequired": false,
    "securityAssessmentRequired": false,
    "notes": ["string"]
  },
  "scopesOverview": {
    "defaultScopes": ["scope:read"],
    "sensitiveScopesWarning": "string or null"
  },
  "redirectUriNuances": ["string"],
  "steps": [
    {
      "stepNumber": 1,
      "title": "string",
      "actor": "AGENT_AUTOMATABLE" | "HUMAN_REQUIRED" | "HYBRID",
      "actorRationale": "string",
      "description": "string",
      "actionUrl": "https://...",
      "codeSnippet": "string or null",
      "pitfalls": ["string"]
    }
  ],
  "verification": {
    "status": "VERIFIED_OFFICIAL_DOCS",
    "lastChecked": "${new Date().toISOString().split('T')[0]}",
    "sources": [{ "title": "string", "url": "https://..." }],
    "verifiedClaims": ["string"],
    "uncertaintiesOrCaveats": ["string"]
  }
}`;

    // Attempt generation across candidate models for seamless resilience
    let lastError = '';
    let parsedGuide: OAuthGuide | null = null;

    for (const model of CANDIDATE_MODELS) {
      try {
        console.log(`[OAuth Agent] Querying Gemini model: ${model} for app: ${appName}...`);
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const geminiResponse = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: systemPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
          signal: AbortSignal.timeout(20000), // 20s timeout per model
        });

        if (!geminiResponse.ok) {
          const errText = await geminiResponse.text();
          console.warn(`[OAuth Agent] Model ${model} failed (${geminiResponse.status}): ${errText}`);
          lastError = `Model ${model} returned ${geminiResponse.status}: ${errText}`;
          // Fall through to next model for 503, 404, 429, etc.
          continue;
        }

        const geminiData = await geminiResponse.json();
        const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (rawText) {
          const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
          parsedGuide = JSON.parse(cleanJson);
          console.log(`[OAuth Agent] Successfully generated guide for ${appName} using ${model}!`);
          break; // Successfully obtained and parsed guide
        }
      } catch (err: any) {
        console.warn(`[OAuth Agent] Error with model ${model}:`, err.message);
        lastError = err.message;
      }
    }

    if (!parsedGuide) {
      return NextResponse.json(
        { error: lastError || 'Failed to generate guide with available Gemini models.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ guide: parsedGuide });
  } catch (err: any) {
    console.error('Error generating guide:', err);
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred during live generation.' },
      { status: 500 }
    );
  }
}
