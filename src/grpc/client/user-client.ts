import { UserInfo } from "@/types/booking";
import { userClient } from "../connection";
 
export async function fetchUserInfo(userId: string) {
  return new Promise<UserInfo>((resolve, reject) => {
    userClient.FetchUserInfoForBookingRide(
      { userId },
      (err: Error | null, response: UserInfo) => {
        if (err) return reject(err);
        resolve(response);
      }
    );
  }); 
}
