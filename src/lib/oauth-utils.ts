import { OAuthGuide, DifficultyLevel, ActorType } from '@/types/oauth';

export function filterGuides(
  guides: OAuthGuide[],
  searchQuery: string,
  selectedCategory: string = 'All',
  selectedDifficulty: string = 'All'
): OAuthGuide[] {
  return guides.filter((guide) => {
    const matchesSearch =
      guide.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.authType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || guide.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesDifficulty =
      selectedDifficulty === 'All' || guide.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesCategory && matchesDifficulty;
  });
}

export function getDifficultyColor(difficulty: DifficultyLevel): {
  bg: string;
  text: string;
  border: string;
} {
  switch (difficulty) {
    case 'Easy':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'Moderate':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' };
    case 'Complex':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' };
    case 'Enterprise':
      return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' };
    default:
      return { bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/30' };
  }
}

export function getActorBadge(actor: ActorType): {
  label: string;
  bg: string;
  text: string;
  border: string;
  iconName: 'bot' | 'user' | 'layers';
} {
  switch (actor) {
    case 'AGENT_AUTOMATABLE':
      return {
        label: '🤖 Agent Automatable',
        bg: 'bg-indigo-500/10',
        text: 'text-indigo-400',
        border: 'border-indigo-500/30',
        iconName: 'bot',
      };
    case 'HUMAN_REQUIRED':
      return {
        label: '👤 Human Required',
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        iconName: 'user',
      };
    case 'HYBRID':
      return {
        label: '🤝 Hybrid (Co-Pilot)',
        bg: 'bg-sky-500/10',
        text: 'text-sky-400',
        border: 'border-sky-500/30',
        iconName: 'layers',
      };
  }
}

export function calculateLibraryStats(guides: OAuthGuide[]) {
  const totalGuides = guides.length;
  const avgDevTime = Math.round(
    guides.reduce((acc, g) => acc + g.estimatedDevTimeMinutes, 0) / (totalGuides || 1)
  );
  const avgAutomation = Math.round(
    guides.reduce((acc, g) => acc + g.agentAutomationPercentage, 0) / (totalGuides || 1)
  );
  const requireReviewCount = guides.filter((g) => g.requiresAppReview).length;

  return {
    totalGuides,
    avgDevTime,
    avgAutomation,
    requireReviewCount,
  };
}
