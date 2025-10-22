
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AIMode } from '@shared/schema';

// API client
async function fetchAPI(path: string, options?: RequestInit) {
  const response = await fetch(`/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  
  return response.json();
}

// Profile hooks
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchAPI('/profile'),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchAPI('/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// Opportunities hooks
export function useOpportunities() {
  return useQuery({
    queryKey: ['opportunities'],
    queryFn: () => fetchAPI('/opportunities'),
  });
}

export function useCreateOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchAPI('/opportunities', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

export function useUpdateOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => fetchAPI(`/opportunities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}

// Sessions hooks
export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: () => fetchAPI('/sessions'),
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchAPI('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

// Mood hooks
export function useCurrentMood() {
  return useQuery({
    queryKey: ['mood', 'current'],
    queryFn: () => fetchAPI('/mood/current'),
  });
}

export function useMoodHistory() {
  return useQuery({
    queryKey: ['mood', 'history'],
    queryFn: () => fetchAPI('/mood/history'),
  });
}

export function useCreateMood() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => fetchAPI('/mood', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood'] });
    },
  });
}

// Stats hooks
export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => fetchAPI('/stats'),
  });
}

// Messages hooks
export function useMessages(mode?: AIMode) {
  return useQuery({
    queryKey: ['messages', mode],
    queryFn: () => fetchAPI(`/messages${mode ? `?mode=${mode}` : ''}`),
  });
}
