import {
    useMutation,
    useQuery,
    useQueryClient,
  } from "@tanstack/react-query";
  
  import {
    changePassword,
    getProfile,
    updateProfile,
  } from "@/services/account.service";
  
  import type {
    ChangePasswordPayload,
    UpdateProfilePayload,
  } from "@/services/account.service";
import { User } from "@/types/auth";
import { authKeys } from "../auth/use-me";
  /*
   * =========================================================
   * Query key
   * =========================================================
   */
  
  export const profileQueryKey =
    [
      "account",
      "profile",
    ] as const;
  
  /*
   * =========================================================
   * Profile query
   * =========================================================
   */
  
  export function useProfile() {
    return useQuery({
      queryKey:
        profileQueryKey,
  
      queryFn:
        getProfile,
  
      staleTime:
        60 *
        1000,
    });
  }
  
  /*
   * =========================================================
   * Update profile
   * =========================================================
   */
  
  export function useUpdateProfile() {
    const queryClient =
      useQueryClient();
  
    return useMutation({
      mutationFn:
        (
          payload:
            UpdateProfilePayload
        ) =>
          updateProfile(
            payload
          ),
  
      onSuccess:
        (
          response
        ) => {
          /*
           * Update the profile page cache.
           */
          queryClient.setQueryData(
            profileQueryKey,
            response
          );
  
          /*
           * Update the authenticated user cache.
           *
           * UserMenu uses useMe(), so updating this
           * cache makes the sidebar update instantly
           * without refreshing the browser.
           */
          queryClient.setQueryData<
            User | undefined
          >(
            authKeys.me(),
  
            (
              currentUser
            ) => {
              if (
                !currentUser
              ) {
                return currentUser;
              }
  
              return {
                ...currentUser,
  
                name:
                  response.user.name,
              };
            }
          );
        },
    });
  }

  /*
 * =========================================================
 * Change password
 * =========================================================
 */

export function useChangePassword() {
  return useMutation({
    mutationFn:
      (
        payload:
          ChangePasswordPayload
      ) =>
        changePassword(
          payload
        ),
  });
}