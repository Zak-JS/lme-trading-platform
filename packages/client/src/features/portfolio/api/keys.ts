export const portfolioKeys = {
  all: ['portfolio'] as const,
  positions: () => [...portfolioKeys.all, 'positions'] as const,
  summary: () => [...portfolioKeys.all, 'summary'] as const,
};
