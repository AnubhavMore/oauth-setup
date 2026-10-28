# OAuth Setup Navigator: Interactive Integration Copilot for AI Agents & Builders

> **APM Integrations Take-Home Assignment Deliverable**  
> A production-grade, interactive web application designed to help developers and AI agent builders evaluate OAuth 2.0 complexity, anticipate review friction and idle wait times, and execute setup with clear human-vs-agent ownership boundaries.

Deployed Live on Vercel: Ready for zero-config deployment.  
Local Access: `http://localhost:3000`

---

## 1. Executive Summary & Problem Breakdown

When building AI agents that connect with third-party SaaS platforms, developers are frequently blindsided by OAuth complexity. The path to production is rarely just "writing code" — it involves opaque vendor approval queues, hidden governance barriers, strict domain verifications, and external security audits.

Today, builders experience three core pain points:
1. **The Velocity Illusion:** A developer might spend 20 minutes coding an OAuth exchange, only to discover a mandatory 4-week manual app review gate before their agent can connect external users.
2. **Ambiguous Boundary Ownership:** Unclear delineations of what an AI agent can automate (generating manifests, provisioning redirect URIs, drafting permission scopes) versus where a human must intervene (2FA, legal agreements, credit card billing, video audits).
3. **Information Fragmentation:** Critical nuances — such as Google's CASA Tier 2/3 security audits, Salesforce's 10-minute metadata propagation delay, or Notion's page-picker architecture — are buried across disparate documentation and support forums.

**OAuth Setup Navigator** eliminates this friction by providing a dual-mode platform:
- **Curated Library:** Deeply researched, verified static archetypes spanning low-friction self-serve tools to high-friction enterprise platforms.
- **Live AI Research Agent:** An on-demand investigation engine that crawls official developer documentation in real-time, extracts authentication specs, and synthesizes a structured, shareable guide on the fly.

---

## 2. Core Product Capabilities

### A. Dual-Pane Master-Detail Explorer
- **Real-Time Filtering:** Instant keyword search across app names, categories, auth types, and permission scopes.
- **Deep-Linking Architecture:** Every app selection updates the browser URL (`?app=google-workspace`, `?app=slack`) for frictionless team sharing.
- **Visual Duality ("Friction Gauge"):** Prominently displays hands-on Developer Effort (minutes) vs. Provider Idle Wait Time (days/weeks) to ground project planning.

### B. Actionable Execution Engine & Checklist
- **Persistent Progress Tracker:** Step-by-step implementation checkboxes backed by `localStorage` so developers and agents can track state across browser refreshes.
- **Task Ownership Badging:** Every step is tagged with:
  - `🤖 Agent Automatable`: Scriptable manifests, API calls, and redirect URI configurations.
  - `👤 Human Required`: 2FA authentication, client secret downloads, domain DNS verification, and human demo recording.
  - `🤝 Hybrid (Co-Pilot)`: Agent drafts descriptions and privacy justifications; human reviews and submits.
- **Actor Rationales:** Explicit explanations accompanying every task explaining why that boundary exists.
- **Gotcha & Pitfall Alerts:** Embedded warnings highlighting trailing slash redirect bugs, localhost constraints, and token expiration surprises.

### C. Live AI Documentation Investigator
- **URL & Keyword Crawling:** Developers can enter any app name (e.g., *Linear, Plaid, Zoom, Spotify*) along with an optional official documentation link.
- **Live Agent Reasoning Feed:** Real-time visual log of the agent's autonomous investigation steps:
  1. 🔍 *Discovering official developer portal & OAuth 2.0 specs*
  2. ⚡ *Extracting grant types, PKCE requirements, & token lifetimes*
  3. 🛡️ *Auditing review friction, restricted scope gates & CASA audits*
  4. 🤖 *Attributing Agent Automatable vs Human 2FA setup boundaries*
  5. ✅ *Grounding evidence, verifying citations & synthesizing structured guide*
- **One-Click Handoff:** Instantly injects newly generated guides into the active session library for exploration and sharing.

### D. Team Sharing & Markdown Export
- **One-Click Share Link:** Copies the deep-link URL directly to clipboard.
- **Markdown Team Brief Export:** Formats the entire guide into clean GitHub-flavored markdown ready for Jira tickets, Slack channels, or pull request descriptions.

---

## 3. Curated Library Archetypes

The library demonstrates 6 diverse setup archetypes representing the spectrum of developer friction:

| Platform | Category | Difficulty | Dev Effort | Provider Wait | Agent Auto % | Key Archetype Trait |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Slack** | Communication | Easy | 15 mins | Instant (0 days) | 80% | **Self-Serve Velocity:** Declarative `manifest.json` generation; 0 wait days for workspace testing. |
| **Google Workspace** | Productivity & Cloud | Enterprise | 90 mins | 2 to 6 weeks | 30% | **High Friction & Audits:** Restricted scope reviews, YouTube demo video, and third-party CASA Tier 2/3 audits. |
| **Salesforce** | CRM & Enterprise | Complex | 60 mins | Instant / 1-3 days | 45% | **Enterprise Governance:** Connected Apps, IP relaxation policies, 10-minute metadata propagation delay, JWT Bearer flows. |
| **GitHub** | Developer Tools | Moderate | 25 mins | Instant (0 days) | 70% | **App Architecture Choice:** Modern GitHub Apps (fine-grained repo permissions, 1-hr tokens) vs legacy OAuth Apps. |
| **Notion** | Productivity & Knowledge | Easy | 20 mins | Instant (0 days) | 75% | **Dual Integration Model:** Internal secret token (instant) vs Public OAuth with mandatory user page-picker grant flow. |
| **HubSpot** | CRM & Marketing | Moderate | 45 mins | Instant (Testing) | 60% | **Multi-Portal Architecture:** Dedicated developer portal, developer test accounts with mock CRM data, 30-min access tokens. |

---

## 4. The Friction Framework: Effort vs. Wait Time

A foundational product insight reflected in this tool is that **OAuth friction is two-dimensional**:
$$\text{Total Time to Production} = \text{Developer Hands-On Effort (Coding)} + \text{Provider Wait Time (Governance \& Audits)}$$

- **Developer Hands-On Effort:** Time spent creating accounts, defining callback routes, handling PKCE code exchanges, and refreshing tokens.
- **Provider Wait Time:** Idle time spent waiting for vendor Trust & Safety reviews, security assessments, and business domain verification.

By displaying these two numbers side-by-side in the **Friction Gauge**, engineering leaders and APMs can immediately forecast whether an integration can launch tomorrow or requires a 6-week runway.

---

## 5. Human vs. Agent Execution Boundaries

We establish a clear, principled framework for delegating OAuth setup tasks:

### What AI Agents Can Automate (`🤖 AGENT_AUTOMATABLE`)
- Generating complete, syntactically valid App Manifests (e.g., Slack JSON/YAML manifests, GitHub App permission manifests).
- Drafting scope justification rationales and privacy policy disclosures.
- Registering redirect URIs and configuring webhook event subscription URLs via provider CLIs and REST APIs.
- Writing backend token exchange, storage, and refresh route handlers.

### Where Humans Must Intervene (`👤 HUMAN_REQUIRED`)
- **2FA and SMS Verification:** Passing biometric or mobile two-factor challenges on developer consoles.
- **Secret Retrieval:** Extracting and securely provisioning Client Secrets into environment vaults without exposing them to browser logs.
- **Domain Verification:** Adding DNS TXT records or uploading HTML verification files to production web roots.
- **Video Workflow Demonstration:** Recording unedited video walkthroughs displaying `client_id` in the address bar (required by Google for restricted scopes).
- **Payment & Legal Sign-off:** Signing vendor terms of service, paying AppExchange listing fees ($2,550 for Salesforce), or contracting third-party CASA security scanning labs.

---

## 6. Sound Judgment & Evidence Grounding

To prevent hallucinations and provide credible guidance, every guide includes an explicit **Verification & Evidence Grounding** card:
1. **Direct Documentation Citations:** Clickable links to the exact vendor documentation pages consulted.
2. **Verified Facts:** Guarantees verified against official documentation (e.g., token lifetimes, localhost port handling, sandbox limits).
3. **Disclosed Uncertainties & Caveats:** Honest admissions of what could not be independently tested (e.g., third-party CASA audit lab pricing variations, enterprise admin override policies).

---

## 7. Tech Stack & Architecture

- **Framework:** Next.js 14 (App Router, React 18, TypeScript)
- **Styling:** Tailwind CSS with custom dark-mode design tokens and sleek scrollbars
- **Icons:** Lucide React
- **AI Engine:** Google Gemini 1.5 Flash (`@google/genai` REST integration with strict `application/json` output enforcement)
- **Deployment:** Vercel (Edge/Serverless runtime with 60-second execution window)

---

## 8. Setup & Local Development Instructions

### Prerequisites
- Node.js v18.17+ or v20.x
- npm or pnpm

### Step 1: Clone and Install
```bash
cd "OAuth Guide App"
npm install
```

### Step 2: Configure Environment Variables
Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```
Add your free Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/app/apikey)):
```env
GEMINI_API_KEY=AIzaSy...
```

### Step 3: Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 4: Build for Production
```bash
npm run build
npm run start
```

---

## 9. Vercel Deployment Guide

1. Push this repository to GitHub or GitLab.
2. Import the project into the [Vercel Dashboard](https://vercel.com/new).
3. In the **Environment Variables** section, add:
   - `GEMINI_API_KEY`: Your Google AI Studio API Key.
4. Click **Deploy**. Vercel will detect Next.js and deploy with zero additional configuration.

---

## 10. Known Limitations & Future Roadmap

- **Headless Browser CLI Automation:** Future versions could integrate Playwright/Puppeteer agents to autonomously log into provider consoles, fill out non-sensitive fields, and pause only when a human 2FA prompt appears.
- **Automated Token Exchange Probing:** Adding synthetic test suites that attempt an OAuth 2.0 PKCE exchange against sandbox credentials to automatically verify that redirect URIs and scopes are configured correctly.
- **Expanded Static Library:** Scaling the curated catalog from 6 representative archetypes to all 100 top SaaS platforms.

---
*Built with care for the APM Integrations Take-Home Assignment.*
