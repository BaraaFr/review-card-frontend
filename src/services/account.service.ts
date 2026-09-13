import {
    api,
  } from "@/lib/api";
  
  /*
   * =========================================================
   * Types
   * =========================================================
   */
  
  export type AccountProfile = {
    id:
      string;
  
    name:
      string;
  
    email:
      string;
  
    phoneNumber:
      string | null;
  
    role?:
      string;
  
    createdAt?:
      string;
  
    updatedAt?:
      string;
  };
  
  export type UpdateProfilePayload = {
    name:
      string;
  
    phoneNumber:
      string | null;
  };
  
  type ProfileResponse = {
    user:
      AccountProfile;
  };
  
  type UpdateProfileResponse = {
    message:
      string;
  
    user:
      AccountProfile;
  };
  
  /*
   * =========================================================
   * Get profile
   * =========================================================
   */
  
  export async function getProfile() {
    const response =
      await api.get<ProfileResponse>(
        "/account/profile"
      );
  
    return response.data;
  }
  
  /*
   * =========================================================
   * Update profile
   * =========================================================
   */
  
  export async function updateProfile(
    payload:
      UpdateProfilePayload
  ) {
    const response =
      await api.patch<UpdateProfileResponse>(
        "/account/profile",
        payload
      );
  
    return response.data;
  }

  /*
 * =========================================================
 * Password types
 * =========================================================
 */

export type ChangePasswordPayload = {
  currentPassword:
    string;

  newPassword:
    string;

  confirmPassword:
    string;
};

export type ChangePasswordResponse = {
  message:
    string;
};

/*
 * =========================================================
 * Change password
 * =========================================================
 */

export async function changePassword(
  payload:
    ChangePasswordPayload
) {
  const response =
    await api.patch<ChangePasswordResponse>(
      "/account/password",
      payload
    );

  return response.data;
}