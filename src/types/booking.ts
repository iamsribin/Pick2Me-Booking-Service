import { LocationCoordinates } from "@Pick2Me/shared/interfaces";

export interface UserInfo {
  userId: string;
  userName: string;
  userNumber: string;
  userProfile: string;
}

export interface BookingReq{
  userId:string;
  pickupLocation: LocationCoordinates;
  dropOffLocation: LocationCoordinates;
  vehicleModel: string;
  estimatedPrice: number;
  estimatedDuration: string;
  distanceInfo: { distance: string, distanceInKm: number }
}

export interface RideAcceptReq{
  id: string,
  driver: {
    driverId: string,
    driverName: string,
    driverNumber: string,
    driverProfile: string
  },
  status: string
}