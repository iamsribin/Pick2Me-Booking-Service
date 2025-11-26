import { LocationCoordinates } from "@Pick2Me/shared/interfaces";
import mongoose, { Document } from "mongoose";

export interface BookingInterface extends Document {
  _id: mongoose.Types.ObjectId;
  rideId: string;

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

  distance: string;
  duration: string;
  vehicleModel: string;
  price: number;
  date: Date;
  status: "Pending" | "Accepted" | "InRide" | "Completed" | "Cancelled";
  paymentStatus: "Pending" | "Failed" | "Completed";
  paymentId: string | null;
  pin: number;
  paymentMode: string;
  feedback?: string;
  rating?: number;
}
