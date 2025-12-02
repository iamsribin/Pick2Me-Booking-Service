import { LocationCoordinates } from "@Pick2Me/shared/interfaces";
import mongoose, { Document } from "mongoose";

export interface BookingInterface extends Document {
  _id: mongoose.Types.ObjectId;
  rideId: string;
  paymentId: string;
  pin: number;
  distanceInfo: { distance: string; distanceInKm: number };
  duration: string;
  vehicleModel: string;
  price: number;
  date: Date;

  user: {
    userId: string;
    userName: string;
    userNumber: string;
    userProfile: string;
  };
  driver: {
    driverId: string;
    driverName: string;
    driverNumber: string;
    driverProfile: string;
  };

  pickupCoordinates: LocationCoordinates;
  dropOffCoordinates: LocationCoordinates;

  status: "Pending" | "Accepted" | "InRide" | "Completed" | "Cancelled";
  paymentStatus: "Pending" | "Failed" | "Completed" | "idle";
  paymentMode: "Cash" | "Wallet" | "Strip";

  feedback?: string;
  rating?: number;
}
