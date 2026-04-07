import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { portfolioKeys } from './keys';
import type { PositionsResponse, PortfolioSummary } from '@lme/shared';

export const usePositionsQuery = () => {
  return useQuery({
    queryKey: portfolioKeys.positions(),
    queryFn: async () => {
      const { data } = await apiClient.get<PositionsResponse>('/positions');
      return data;
    },
    refetchInterval: 5000,
  });
};

export const usePortfolioSummaryQuery = () => {
  return useQuery({
    queryKey: portfolioKeys.summary(),
    queryFn: async () => {
      const { data } = await apiClient.get<PortfolioSummary>('/portfolio');
      return data;
    },
    refetchInterval: 5000,
  });
};
