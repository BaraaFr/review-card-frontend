import { publicApi } from "@/lib/api";
import type {
    PublicAccountRequestInput,
} from "@/types/account-request";

type CreateAccountRequestResponse = {
    success: boolean;
  
    message: string;
  };

export async function createPublicAccountRequest(
    payload:
        PublicAccountRequestInput
) {
    const data =
        await publicApi.post<CreateAccountRequestResponse>(
            "/public/account-requests",
            payload
        );
    

    return data.data;
}