import { useQuery } from '@tanstack/react-query';
import { getTodayNameDays, getMonthNameDays, searchNameDays } from '../services/api';

export const useTodayNameDays = () => {
  return useQuery({
    queryKey: ['nameDays', 'today'],
    queryFn: getTodayNameDays,
  });
};

export const useMonthNameDays = (month?: number) => {
  return useQuery({
    queryKey: ['nameDays', 'month', month || 'current'],
    queryFn: () => getMonthNameDays(month),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useSearchNameDays = (name: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['nameDays', 'search', name],
    queryFn: () => searchNameDays(name),
    enabled: enabled && name.length > 0,
  });
};
