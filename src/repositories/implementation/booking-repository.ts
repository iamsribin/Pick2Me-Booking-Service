import bookingModel from "@/model/booking.model";
import { BookingInterface } from "@/interfaces/interface";
import { IBookingRepository } from "../interfaces/i-booking-repository";
import {
  CreateBookingReq,
  DriverAssignmentPayload,
} from "@/types/booking/request";
import { MongoBaseRepository } from "@Pick2Me/shared/mongo";
import { injectable } from "inversify";

@injectable()
export class BookingRepository
  extends MongoBaseRepository<BookingInterface>
  implements IBookingRepository
{
  constructor() {
    super(bookingModel);
  }

  async createBooking(
    data: CreateBookingReq,
    distanceKm: number,
    price: number,
    pin: number
  ): Promise<BookingInterface> {
    try {
      const response = await bookingModel.create({
        rideId: `ride_${Date.now()}`,

        user: {
          userId: data.userId,
          userName: data.userName,
          userNumber: data.mobile,
          userProfile: data.profile,
        },

        pickupCoordinates: {
          latitude: data.pickupLocation.latitude,
          longitude: data.pickupLocation.longitude,
          address: data.pickupLocation.address,
        },
        dropoffCoordinates: {
          latitude: data.dropOffLocation.latitude,
          longitude: data.dropOffLocation.longitude,
          address: data.dropOffLocation.address,
        },

        pickupLocation: data.pickupLocation.address,
        dropoffLocation: data.dropOffLocation.address,

        vehicleModel: data.vehicleModel,
        duration: data.estimatedDuration,
        distance: data.distanceInfo?.distance || `${distanceKm} km`,
        price,
        pin,
        status: "Pending",
      });

      return response;
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to create booking: ${(error as Error).message}`);
    }
  }

  async findBookingById(rideId: string): Promise<BookingInterface | null> {
    try {
      return await bookingModel.findOne({ rideId: rideId });
    } catch (error) {
      throw new Error(`Failed to find booking: ${(error as Error).message}`);
    }
  }

  async updateBookingStatus(
    id: string,
    status: string
  ): Promise<BookingInterface | null> {
    try {
      return await bookingModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
    } catch (error) {
      throw new Error(
        `Failed to update booking status: ${(error as Error).message}`
      );
    }
  }

  async confirmRide(pin: number): Promise<BookingInterface | null> {
    try {
      return await bookingModel.findOneAndUpdate(
        { pin, status: "Accepted" },
        { status: "Confirmed" },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to confirm ride: ${(error as Error).message}`);
    }
  }

  async updateDriverCoordinates(
    rideId: string,
    coordinates: { latitude: number; longitude: number }
  ): Promise<BookingInterface | null> {
    try {
      return await bookingModel.findOneAndUpdate(
        { ride_id: rideId },
        { driverCoordinates: coordinates },
        { new: true }
      );
    } catch (error) {
      throw new Error(
        `Failed to update driver coordinates: ${(error as Error).message}`
      );
    }
  }

  async updateAcceptedRide(
    data: DriverAssignmentPayload
  ): Promise<BookingInterface | null> {
    try {
      const updatedBooking = await bookingModel.findByIdAndUpdate(
        data.bookingId,
        {
          $set: {
            driver: {
              driverId: data.driver.driverId,
              driverName: data.driver.driverName,
              driverNumber: data.driver.driverNumber,
              driverProfile: data.driver.driverProfile,
            },
            driverCoordinates: {
              latitude: data.driverCoordinates.latitude,
              longitude: data.driverCoordinates.longitude,
            },
            status: "Accepted",
          },
        },
        { new: true }
      );

      console.log("updatedBooking response==", updatedBooking);
      return updatedBooking;
    } catch (error) {
      throw new Error(
        `Failed to update booking status: ${(error as Error).message}`
      );
    }
  }

async fetchBookingListWithDriverId(id: string, role: string) {
  try {
    const queryField = role === "user" ? "user.userId" : "driver.driverId";

    const response = await bookingModel.find({
      [queryField]: id,
    });

    return response;
  } catch (error) {
    console.error("error==", error);
    throw new Error(`Failed to fetch bookings: ${(error as Error).message}`);
  }
}


  async fetchBookingListWithBookingId(id: string) {
    try {
      const response = await bookingModel.findById(id);

      return response;
    } catch (error) {
      throw new Error(`Failed to fetch bookings: ${(error as Error).message}`);
    }
  }
  async verifyPinAndStartRide(
    bookingId: string,
    pin: number
  ): Promise<BookingInterface | null> {
    try {
      return await bookingModel.findOneAndUpdate(
        { _id: bookingId, pin, status: "Accepted" },
        { status: "InRide" },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Failed to verify pin: ${(error as Error).message}`);
    }
  }

  async cancelRide(userId: string, rideId: string) {
    try {
      const response = await bookingModel.findOneAndUpdate(
        {
          rideId: rideId,
          "user.userId": userId,
          status: { $ne: "Cancelled" },
        },
        { $set: { status: "Cancelled" } },
        { new: true }
      );
      console.log("cancelRide res===", response);

      if (!response) {
        throw new Error("Ride not found or already cancelled");
      }

      return response;
    } catch (error) {
      console.log("cancelRide error==", error);
      throw new Error(`Failed to cancel ride: ${(error as Error).message}`);
    }
  }
}
