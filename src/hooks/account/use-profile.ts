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
          queryClient.setQueryData(
            profileQueryKey,
            response
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