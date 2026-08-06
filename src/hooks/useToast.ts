import { useCallback } from 'react';
import { useToastStore } from '../stores/toastStore';

export function useToast() {
  const push = useToastStore((s) => s.push);

  const success = useCallback((message: string) => push(message, 'success'), [push]);
  const error = useCallback((message: string) => push(message, 'error'), [push]);
  const info = useCallback((message: string) => push(message, 'info'), [push]);

  return { success, error, info };
}
