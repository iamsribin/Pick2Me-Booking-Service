import { userClient } from "../connection";

interface UserInfo {
  userId: string;
  userName: string;
  userNumber: string;
  userProfile: string;
}
 
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
