import { OAuthGuide } from '@/types/oauth';

export const STATIC_GUIDES: OAuthGuide[] = [
  {
    id: 'slack',
    appName: 'Slack',
    appUrl: 'https://api.slack.com/apps',
    category: 'Communication',
    summary: 'The gold standard for developer experience. Rapid self-serve setup with declarative App Manifests that an AI agent can generate and configure instantly.',
    authType: 'OAuth 2.0 (Bot Token & Granular Scopes)',
    difficulty: 'Easy',
    estimatedDevTimeMinutes: 15,
    estimatedApprovalWaitDays: 'Instant (0 days)',
    requiresAppReview: false,
    agentAutomationPercentage: 80,
    prerequisites: {
      paidAccountRequired: false,
      domainVerificationRequired: false,
      privacyPolicyRequired: false,
      securityAssessmentRequired: false,
      notes: [
        'Free Slack workspace is sufficient for full development and testing.',
        'App directory listing is only required if distributing publicly to external organizations.',
      ],
    },
    scopesOverview: {
      defaultScopes: ['chat:write', 'channels:read', 'commands'],
      sensitiveScopesWarning: 'Admin scopes (e.g. admin.*) or broad file export scopes require Workspace Admin approval during installation.',
    },
    redirectUriNuances: [
      'Allows http://localhost for local development without TLS.',
      'Must match the exact URL registered in the OAuth & Permissions tab.',
      'Multiple redirect URLs can be saved simultaneously.',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Create Slack App using App Manifest',
        actor: 'AGENT_AUTOMATABLE',
        actorRationale: 'AI agents can generate the entire JSON/YAML manifest including required bot scopes, slash commands, and event subscriptions.',
        description: 'Navigate to Slack API Apps console and click "Create New App" > "From an app manifest". Paste the prepared manifest.',
        actionUrl: 'https://api.slack.com/apps?new_app=1',
        codeSnippet: `display_information:
  name: "Integrations Copilot"
features:
  bot_user:
    display_name: "CopilotBot"
oauth_config:
  redirect_urls:
    - "http://localhost:3000/api/auth/callback/slack"
  scopes:
    bot:
      - chat:write
      - channels:read`,
        pitfalls: ['Ensure you select the correct workspace where you have admin installation privileges.'],
      },
      {
        stepNumber: 2,
        title: 'Retrieve Client Credentials',
        actor: 'HUMAN_REQUIRED',
        actorRationale: 'Extracting and storing Client Secret requires accessing workspace secrets and populating secure environment files.',
        description: 'Under "Basic Information" > "App Credentials", copy your Client ID, Client Secret, and Signing Secret into your .env.local file.',
        pitfalls: ['Do not commit your Client Secret or Signing Secret to Git repositories.'],
      },
      {
        stepNumber: 3,
        title: 'Install to Workspace for Immediate Testing',
        actor: 'HUMAN_REQUIRED',
        actorRationale: 'Requires human consent screen authorization in the browser to grant requested scopes to your test workspace.',
        description: 'Under "Install App", click "Install to Workspace" and approve the OAuth permissions prompt. Copy the generated Bot User OAuth Token (xoxb-...).',
        pitfalls: ['Re-installation is required every time you add or alter requested bot scopes.'],
      },
    ],
    verification: {
      status: 'VERIFIED_OFFICIAL_DOCS',
      lastChecked: '2026-10-25',
      sources: [
        { title: 'Slack API: App Manifests Documentation', url: 'https://api.slack.com/reference/manifests' },
        { title: 'Slack API: Using OAuth 2.0', url: 'https://api.slack.com/authentication/oauth-v2' },
      ],
      verifiedClaims: [
        'App Manifest allows complete declarative app definition in one step.',
        'Localhost redirect URIs do not require HTTPS in Slack development apps.',
        'No external provider review required for private internal workspace usage.',
      ],
      uncertaintiesOrCaveats: [
        'Enterprise Grid workspaces may have organization-wide admin approval policies that block self-installation.',
      ],
    },
  },
  {
    id: 'google-workspace',
    appName: 'Google Workspace (Gmail & Drive)',
    appUrl: 'https://console.cloud.google.com/apis/credentials',
    category: 'Productivity & Cloud',
    summary: 'High-friction enterprise security governance. While testing is instant for up to 100 test users, external production deployment with sensitive or restricted scopes requires intense audits, YouTube video proof, and CASA Tier 2/3 independent evaluations.',
    authType: 'OAuth 2.0 (Authorization Code with PKCE / Consent Screen)',
    difficulty: 'Enterprise',
    estimatedDevTimeMinutes: 90,
    estimatedApprovalWaitDays: '2 to 6 weeks',
    requiresAppReview: true,
    agentAutomationPercentage: 30,
    prerequisites: {
      paidAccountRequired: false,
      domainVerificationRequired: true,
      privacyPolicyRequired: true,
      securityAssessmentRequired: true,
      notes: [
        'Domain verification required via Google Search Console (DNS TXT or HTML upload).',
        'Public Privacy Policy and Terms of Service hosted on the verified domain.',
        'Restricted scopes (e.g. Gmail API `https://mail.google.com/`) require CASA (Cloud Application Security Assessment) Tier 2 or 3 letter of assessment ($500 - $3,000+ third-party fee).',
        'Unedited YouTube video demonstrating OAuth grant flow and exact data usage.',
      ],
    },
    scopesOverview: {
      defaultScopes: ['openid', 'email', 'profile'],
      sensitiveScopesWarning: 'Adding Gmail (gmail.readonly), Drive (drive.file), or Calendar scopes triggers mandatory Google Trust & Safety verification before unverified app warning screens can be removed.',
    },
    redirectUriNuances: [
      'Allows http://localhost and http://127.0.0.1 (with or without custom ports).',
      'Wildcards in redirect URIs (e.g. *.example.com) are strictly prohibited.',
      'All production redirect URI domains must be verified in Google Search Console.',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Create Cloud Project & Enable Target APIs',
        actor: 'AGENT_AUTOMATABLE',
        actorRationale: 'Agents can execute GCP Cloud SDK CLI commands (`gcloud services enable gmail.googleapis.com`) or script GCP resource provisioning.',
        description: 'Navigate to Google Cloud Console, create or select a GCP project, and enable the necessary APIs (e.g., Gmail API, Google Drive API).',
        actionUrl: 'https://console.cloud.google.com/flows/enableapi',
        codeSnippet: `gcloud services enable gmail.googleapis.com --project=YOUR_PROJECT_ID`,
        pitfalls: ['Ensure billing is enabled if your project exceeds free GCP API quotas.'],
      },
      {
        stepNumber: 2,
        title: 'Configure OAuth Consent Screen & Scopes',
        actor: 'HYBRID',
        actorRationale: 'Agent drafts privacy policy statements and justification rationale; human must submit official contact emails and branding icons.',
        description: 'Choose "External" user type. Enter App Name, User Support Email, Developer Contact Info, and add target scopes.',
        pitfalls: [
          'Uploading a custom app logo immediately triggers a branding review before you can even test freely.',
          'Selecting restricted scopes triggers warning prompts regarding external verification.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Generate OAuth 2.0 Client ID Credentials',
        actor: 'HUMAN_REQUIRED',
        actorRationale: 'Client secrets must be securely retrieved from the GCP console without exposing raw browser secrets.',
        description: 'Under Credentials > Create Credentials > OAuth client ID. Select Application Type "Web application". Configure Authorized JavaScript origins and Authorized redirect URIs.',
        actionUrl: 'https://console.cloud.google.com/apis/credentials/oauthclient',
        pitfalls: ['Port mismatch on localhost: http://localhost:3000 is treated differently from http://127.0.0.1:3000.'],
      },
      {
        stepNumber: 4,
        title: 'Submit for Google Verification (Production Launch)',
        actor: 'HUMAN_REQUIRED',
        actorRationale: 'Requires recording a real human demo video showing the client_id query param in the URL bar and justifying each scope.',
        description: 'Submit your app for verification. Provide: (1) Domain ownership proof, (2) YouTube demo link, (3) Detailed justification written for why non-sensitive scopes are insufficient, (4) Complete CASA security self-assessment or lab audit.',
        pitfalls: [
          'If the YouTube video does not visibly display the OAuth Client ID in the browser address bar during the sign-in flow, the submission will be rejected immediately.',
        ],
      },
    ],
    verification: {
      status: 'VERIFIED_OFFICIAL_DOCS',
      lastChecked: '2026-10-26',
      sources: [
        { title: 'Google Identity: OAuth 2.0 Review Process', url: 'https://support.google.com/cloud/answer/13463073' },
        { title: 'App Defense Alliance: CASA Requirements', url: 'https://appdefensealliance.dev/casa' },
      ],
      verifiedClaims: [
        'Apps in "Testing" publishing status are limited to 100 explicitly added test users and bypass CASA review.',
        'Restricted scopes require CASA Tier 2 or 3 validation for production multi-tenant use.',
        'YouTube demo video is mandatory for sensitive scope verification.',
      ],
      uncertaintiesOrCaveats: [
        'Exact third-party CASA lab pricing fluctuates between authorized security scanning vendors.',
      ],
    },
  },
  {
    id: 'salesforce',
    appName: 'Salesforce',
    appUrl: 'https://login.salesforce.com',
    category: 'CRM & Enterprise',
    summary: 'The archetype of enterprise IT governance. OAuth apps ("Connected Apps") require deep understanding of profile permissions, IP relaxation policies, and certificate-backed JWT Bearer flows for headless agent integration.',
    authType: 'OAuth 2.0 (Connected App: Auth Code or JWT Bearer)',
    difficulty: 'Complex',
    estimatedDevTimeMinutes: 60,
    estimatedApprovalWaitDays: 'Instant (Sandbox) / 1-3 days (Org Admin Review)',
    requiresAppReview: false,
    agentAutomationPercentage: 45,
    prerequisites: {
      paidAccountRequired: false,
      domainVerificationRequired: false,
      privacyPolicyRequired: false,
      securityAssessmentRequired: false,
      notes: [
        'Free Salesforce Developer Edition org is available for testing without a corporate paid contract.',
        'Production installation in customer orgs requires Salesforce Org System Administrator credentials.',
      ],
    },
    scopesOverview: {
      defaultScopes: ['api', 'refresh_token', 'offline_access'],
      sensitiveScopesWarning: 'Scope `full` grants unrestricted access across all Salesforce APIs and should be avoided in favor of least-privilege `api` or `id`.',
    },
    redirectUriNuances: [
      'Allows https:// only, except http://localhost (port numbers allowed).',
      'Changes to Connected App metadata (like scopes or callback URLs) can take 2 to 10 minutes to propagate across Salesforce clusters.',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Sign Up for a Free Salesforce Developer Org',
        actor: 'HUMAN_REQUIRED',
        actorRationale: 'Requires completing reCAPTCHA and validating email confirmation tokens.',
        description: 'Do not use a customer production org for development. Register at developer.salesforce.com for a lifetime free Developer Edition org.',
        actionUrl: 'https://developer.salesforce.com/signup',
      },
      {
        stepNumber: 2,
        title: 'Create Connected App in App Manager',
        actor: 'HYBRID',
        actorRationale: 'Agent can configure exact scope strings and callback URL formats; human must navigate Setup UI.',
        description: 'Navigate to Setup > App Manager > New Connected App. Check "Enable OAuth Settings". Input Callback URL and select OAuth Scopes (e.g. Manage user data via APIs `api`, Perform requests at any time `refresh_token`).',
        pitfalls: [
          'Wait 10 minutes after saving for the Connected App consumer key to propagate globally across Salesforce data centers.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Relax IP Restrictions & Configure Permitted Users',
        actor: 'HUMAN_REQUIRED',
        actorRationale: 'Critical enterprise setting: default Salesforce policy requires verification codes for unrecognized IPs, which breaks headless agents.',
        description: 'Go to Manage Connected Apps > Edit Policies. Set "IP Relaxation" to "Relax IP restrictions" (or enforce trusted IP ranges) and configure Refresh Token Policy to "Refresh token is valid until revoked".',
        pitfalls: [
          'Failing to relax IP restrictions causes unexpected "invalid_grant" errors during headless server-to-server token refresh.',
        ],
      },
      {
        stepNumber: 4,
        title: 'Retrieve Consumer Key (Client ID) & Consumer Secret',
        actor: 'HUMAN_REQUIRED',
        actorRationale: 'Requires 2FA verification to reveal the Consumer Secret in the Salesforce Setup console.',
        description: 'Under App Manager, click "View" on your Connected App. Click "Manage Consumer Details". Authenticate via email/SMS 2FA to reveal keys.',
      },
    ],
    verification: {
      status: 'VERIFIED_OFFICIAL_DOCS',
      lastChecked: '2026-10-24',
      sources: [
        { title: 'Salesforce Help: Create a Connected App', url: 'https://help.salesforce.com/s/articleView?id=sf.connected_app_create.htm' },
        { title: 'Salesforce Developers: OAuth 2.0 Web Server Flow', url: 'https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_web_server_flow.htm' },
      ],
      verifiedClaims: [
        'Developer Edition orgs provide identical Connected App capabilities to Enterprise/Unlimited editions.',
        '10-minute propagation delay is officially documented behavior.',
        'IP relaxation setting is necessary to avoid intermittent headless token refresh failures.',
      ],
      uncertaintiesOrCaveats: [
        'If publishing to Salesforce AppExchange for public multi-tenant monetization, a comprehensive AppExchange Security Review ($2,550 fee) is required.',
      ],
    },
  },
  {
    id: 'github',
    appName: 'GitHub',
    appUrl: 'https://github.com/settings/apps',
    category: 'Developer Tools',
    summary: 'The modern standard for developer platform integration. Offers two distinct models: legacy OAuth Apps (coarse account-wide scopes) vs modern GitHub Apps (fine-grained repository permissions, short-lived tokens, and webhook signatures).',
    authType: 'GitHub App (Granular Permissions & Webhooks) vs OAuth App',
    difficulty: 'Moderate',
    estimatedDevTimeMinutes: 25,
    estimatedApprovalWaitDays: 'Instant (0 days)',
    requiresAppReview: false,
    agentAutomationPercentage: 70,
    prerequisites: {
      paidAccountRequired: false,
      domainVerificationRequired: false,
      privacyPolicyRequired: false,
      securityAssessmentRequired: false,
      notes: [
        'Free GitHub personal account or free organization is 100% sufficient.',
        'No marketplace review required unless listing in the public GitHub Marketplace.',
      ],
    },
    scopesOverview: {
      defaultScopes: ['read:user', 'repo (or granular repository contents:read)'],
      sensitiveScopesWarning: 'Requesting the legacy `repo` scope grants full read/write access to all public and private repositories. GitHub heavily recommends creating a GitHub App with read-only Repository Contents instead.',
    },
    redirectUriNuances: [
      'Allows http://localhost for development.',
      'GitHub Apps allow configuring multiple callback URLs or dynamic redirect validation.',
      'OAuth apps only permit a single registered callback URL.',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Choose Architecture: GitHub App vs OAuth App',
        actor: 'AGENT_AUTOMATABLE',
        actorRationale: 'AI agents can evaluate integration requirements and recommend the optimal model (GitHub App is preferred for 95% of modern agents due to fine-grained security).',
        description: 'Navigate to GitHub Settings > Developer Settings. Choose "GitHub Apps" over "OAuth Apps" for fine-grained repository permissions, distinct bot identity, and 1-hour short-lived tokens.',
        actionUrl: 'https://github.com/settings/apps/new',
      },
      {
        stepNumber: 2,
        title: 'Configure Permissions and Webhook URL',
        actor: 'HYBRID',
        actorRationale: 'Agent can output exact permission flags needed; human selects options in GitHub settings UI.',
        description: 'Provide App Name and Homepage URL. Set Callback URL. Under "Permissions", grant read-only or read-and-write to specific resources (e.g., Pull Requests, Issues, Contents).',
        pitfalls: ['If you do not plan to receive real-time events, uncheck "Active" under Webhook to avoid timeout delivery errors.'],
      },
      {
        stepNumber: 3,
        title: 'Generate Client Secret & Private Key (PEM)',
        actor: 'HUMAN_REQUIRED',
        actorRationale: 'GitHub App authentication requires downloading an RSA private key (.pem file) which must be stored in secure key vaults.',
        description: 'Click "Generate a new client secret" for user OAuth flow, and "Generate a private key" to download the PEM file for server-to-server installation authentication.',
        pitfalls: ['The private key PEM file can only be downloaded once upon generation.'],
      },
    ],
    verification: {
      status: 'VERIFIED_OFFICIAL_DOCS',
      lastChecked: '2026-10-26',
      sources: [
        { title: 'GitHub Docs: Differences between GitHub Apps and OAuth Apps', url: 'https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/differences-between-github-apps-and-oauth-apps' },
        { title: 'GitHub Docs: Creating a GitHub App', url: 'https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app' },
      ],
      verifiedClaims: [
        'GitHub Apps provide 1-hour ephemeral installation tokens, superior to indefinite OAuth personal access tokens.',
        'Localhost callback URLs are supported without HTTPS requirement in developer mode.',
      ],
      uncertaintiesOrCaveats: [
        'Organization-level permission policies can restrict members from installing third-party GitHub Apps without Org Owner approval.',
      ],
    },
  },
  {
    id: 'notion',
    appName: 'Notion',
    appUrl: 'https://www.notion.so/profile/integrations',
    category: 'Productivity & Knowledge',
    summary: 'Unique two-tier integration model: "Internal Integrations" provide instant secret tokens for a single workspace, while "Public Integrations" require OAuth 2.0 flow with a native Notion page-selection picker.',
    authType: 'OAuth 2.0 (Public Integration) / Internal Secret Token',
    difficulty: 'Easy',
    estimatedDevTimeMinutes: 20,
    estimatedApprovalWaitDays: 'Instant (0 days)',
    requiresAppReview: false,
    agentAutomationPercentage: 75,
    prerequisites: {
      paidAccountRequired: false,
      domainVerificationRequired: false,
      privacyPolicyRequired: false,
      securityAssessmentRequired: false,
      notes: [
        'Free Notion workspace is fully supported.',
        'Public OAuth distribution requires providing a public redirect URI and company name.',
      ],
    },
    scopesOverview: {
      defaultScopes: ['Read content', 'Update content', 'Insert content'],
      sensitiveScopesWarning: 'Notion does not use arbitrary scope strings; capabilities (Read/Update/Insert user info and comments) are configured as checkboxes in the developer portal.',
    },
    redirectUriNuances: [
      'HTTPS required for public production redirect URIs.',
      'http://localhost is permitted for development.',
      'Strict exact URL matching: trailing slashes matter.',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Create Integration in Notion My Integrations',
        actor: 'AGENT_AUTOMATABLE',
        actorRationale: 'Straightforward configuration with guided capability selection.',
        description: 'Go to notion.so/profile/integrations. Click "New integration". Assign a name, upload a logo, and select the associated workspace.',
        actionUrl: 'https://www.notion.so/profile/integrations',
      },
      {
        stepNumber: 2,
        title: 'Switch Distribution from Internal to Public (For Multi-User Apps)',
        actor: 'HUMAN_REQUIRED',
        actorRationale: 'Requires agreeing to developer terms and supplying contact emails, privacy policy link, and OAuth redirect URI.',
        description: 'Under "Distribution", toggle from "Internal" to "Public". Fill in Organization Name, Website, Privacy Policy URL, and Redirect URIs.',
        pitfalls: [
          'If left as Internal, your integration cannot authenticate external users via OAuth 2.0 and will only work inside your own workspace.',
        ],
      },
      {
        stepNumber: 3,
        title: 'Implement the Notion Page Picker Grant Flow',
        actor: 'AGENT_AUTOMATABLE',
        actorRationale: 'Agent can write the OAuth authorization URL generator and token exchange route handler.',
        description: 'Direct users to `https://api.notion.com/v1/oauth/authorize?client_id=...&response_type=code&owner=user&redirect_uri=...`. Notice that users must explicitly pick which pages your bot can access.',
        pitfalls: [
          'Notion OAuth token responses include `duplicated_template_id` and `workspace_icon`, and access is strictly restricted to pages the user explicitly checked in the picker UI.',
        ],
      },
    ],
    verification: {
      status: 'VERIFIED_OFFICIAL_DOCS',
      lastChecked: '2026-10-27',
      sources: [
        { title: 'Notion Developers: Authorization Guide', url: 'https://developers.notion.com/docs/authorization' },
        { title: 'Notion Developers: Creating a Public Integration', url: 'https://developers.notion.com/docs/create-a-notion-integration#public-integrations' },
      ],
      verifiedClaims: [
        'Internal integrations do not require OAuth and can start making API requests immediately using the internal secret token.',
        'Notion enforces that the authenticating user must explicitly select pages to share with the integration.',
      ],
      uncertaintiesOrCaveats: [
        'Public integration listing on the official Notion Integrations Gallery requires separate manual editorial review.',
      ],
    },
  },
  {
    id: 'hubspot',
    appName: 'HubSpot',
    appUrl: 'https://app.hubspot.com/signup-hubspot/developers',
    category: 'CRM & Marketing',
    summary: 'Architecture separated between Developer Accounts and Standard User Accounts. Developers build apps inside a dedicated Developer Portal, generate install URLs, and test against dedicated Developer Test Accounts with mock CRM contacts.',
    authType: 'OAuth 2.0 (Authorization Code with Granular CRM Scopes)',
    difficulty: 'Moderate',
    estimatedDevTimeMinutes: 45,
    estimatedApprovalWaitDays: 'Instant (Testing) / Optional Marketplace Review',
    requiresAppReview: false,
    agentAutomationPercentage: 60,
    prerequisites: {
      paidAccountRequired: false,
      domainVerificationRequired: false,
      privacyPolicyRequired: false,
      securityAssessmentRequired: false,
      notes: [
        'Must register for a dedicated free HubSpot Developer Account (separate from a regular sales/marketing account).',
        'Can spin up unlimited free Developer Test Accounts that simulate Enterprise CRM tiers.',
      ],
    },
    scopesOverview: {
      defaultScopes: ['crm.objects.contacts.read', 'crm.objects.contacts.write'],
      sensitiveScopesWarning: 'Adding sensitive scopes like `e-commerce` or `tickets` requires corresponding CRM objects to exist in the target customer portal.',
    },
    redirectUriNuances: [
      'HTTPS required for production; http://localhost allowed for local development.',
      'Multiple redirect URIs can be saved in the App settings under the Auth tab.',
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Create a HubSpot Developer Account',
        actor: 'HUMAN_REQUIRED',
        actorRationale: 'Requires completing developer signup and email verification.',
        description: 'Navigate to app.hubspot.com/signup-hubspot/developers and create a Developer Account. This will serve as your developer dashboard.',
        actionUrl: 'https://app.hubspot.com/signup-hubspot/developers',
      },
      {
        stepNumber: 2,
        title: 'Create an App & Create a Test Account',
        actor: 'HYBRID',
        actorRationale: 'Agent can configure app scopes and callback URL; human provisions the Developer Test Account.',
        description: 'In your developer portal, click "Create App". Fill in the basic app info. Next, go to the "Testing" tab in the main developer portal and create a "Developer Test Account" with preloaded sample CRM data.',
        pitfalls: ['Do not try to install your app into your developer portal itself — apps must be installed into test accounts or customer accounts.'],
      },
      {
        stepNumber: 3,
        title: 'Configure Auth Tab & Select Scopes',
        actor: 'AGENT_AUTOMATABLE',
        actorRationale: 'Agents can generate the required scope list and OAuth install URL.',
        description: 'Under the "Auth" tab of your app, copy the Client ID and Client Secret. Add your redirect URI and select required scopes (e.g. `crm.objects.contacts.read`).',
        pitfalls: [
          'HubSpot tokens expire every 30 minutes; robust refresh token handling is required from day 1.',
        ],
      },
    ],
    verification: {
      status: 'VERIFIED_OFFICIAL_DOCS',
      lastChecked: '2026-10-25',
      sources: [
        { title: 'HubSpot Developers: Working with OAuth', url: 'https://developers.hubspot.com/docs/api/working-with-oauth' },
        { title: 'HubSpot Developers: Managing Apps in Developer Portals', url: 'https://developers.hubspot.com/docs/api/developer-tools-overview' },
      ],
      verifiedClaims: [
        'Developer accounts and test accounts are 100% free with no credit card required.',
        'Access tokens expire strictly in 1800 seconds (30 minutes).',
        'Direct OAuth install links work immediately without waiting for marketplace approval.',
      ],
      uncertaintiesOrCaveats: [
        'Custom CRM object scopes require the target installation account to have Enterprise tier subscription.',
      ],
    },
  },
];
