import { useQuery } from '@tanstack/react-query';
import { getTodayNameDays, getMonthNameDays, searchNameDays } from '../services/api';

export const useTodayNameDays = () => {
  return useQuery({
    queryKey: ['nameDays', 'today'],
    queryFn: getTodayNameDays,
    staleTime: 1000 * 60 * 60, // 1 hour - data rarely changes during the day
    gcTime: 1000 * 60 * 60 * 24, // 24 hours cache
  });
};

export const useMonthNameDays = (month?: number) => {
  return useQuery({
    queryKey: ['nameDays', 'month', month || 'current'],
    queryFn: () => getMonthNameDays(month),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days cache - month data is static
  });
};

export const useSearchNameDays = (name: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['nameDays', 'search', name],
    queryFn: () => searchNameDays(name),
    enabled: enabled && name.length > 0,
    staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days - name day dates rarely change
    gcTime: 1000 * 60 * 60 * 24 * 30, // 30 days cache
  });
};

