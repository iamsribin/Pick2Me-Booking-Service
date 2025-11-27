import mongoose, { Schema } from "mongoose";
import { BookingInterface } from "../interfaces/booking.interface";

const BookingSchema: Schema = new Schema({
  rideId: { type: String, required: true },
  paymentId: { type: String },
  pin: { type: Number, required: true },
  distanceInfo: { distance: { type: String }, distanceInKm: { type: Number } },
  duration: { type: String },
  vehicleModel: { type: String, required: true },
  price: { type: Number },
  date: { type: Date, default: Date.now },

  user: {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userNumber: { type: String, required: true },
    userProfile: { type: String, required: true },
  },

  driver: {
    driverId: { type: String, required: true },
    driverName: { type: String, required: true },
    driverNumber: { type: String, required: true },
    driverProfile: { type: String, required: true },
  },

  pickupCoordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
  },

  dropOffCoordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
  },

  status: {
    type: String,
    enum: ["Pending", "Accepted", "InRide", "Completed", "Cancelled"],
    default: "Pending",
  },

  paymentStatus: {
    type: String,
    enum: ["idle", "Pending", "Failed", "Completed"],
    default: "idle",
  },

  paymentMode: {
    type: String,
    enum: ["Cash", "Wallet", "Strip"],
  },

  feedback: { type: String },
  rating: { type: Number },
});

const bookingModel = mongoose.model<BookingInterface>("Booking", BookingSchema);
export default bookingModel;
