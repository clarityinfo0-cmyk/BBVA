'use client';
import { useFirebase } from '@/firebase/provider'; // Use the main hook
    
export interface UserAuthHookResult {
  user: any; // Consider using a more specific User type from your auth provider
  isUserLoading: boolean;
  userError: Error | null;
}
    
/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserAuthHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = (): UserAuthHookResult => {
  const { user, isUserLoading, userError } = useFirebase(); // Leverages the main hook
  return { user, isUserLoading, userError };
};
