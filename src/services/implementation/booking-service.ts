import { generatePIN } from "../../utils/generatePIN";
import { IBookingService } from "../interfaces/i-booking-service";
import {
  BookingDetailsDto,
  BookingListDTO,
  CreateBookingResponseDTO,
} from "../../dto/booking.dto";
import { IResponse } from "../../types/common/response";
import { StatusCode } from "../../types/common/status-code";
import {
  CreateBookingReq,
  DriverAssignmentPayload,
} from "../../types/booking/request";
import { findNearbyDrivers } from "../../utils/find-near-by-drivers";
import { DriverNotificationPayload } from "../../types/booking/driver-notification";
import { RabbitMQPublisher } from "../../events/publisher";
import { IBookingRepository } from "../../repositories/interfaces/i-booking-repository";

export class BookingService implements IBookingService {
  constructor(private _bookingRepo: IBookingRepository) {}

  async createBooking(
    data: CreateBookingReq
  ): Promise<IResponse<CreateBookingResponseDTO>> {
    try {

      const drivers = await findNearbyDrivers(
        data.pickupLocation.latitude,
        data.pickupLocation.longitude,
        data.vehicleModel
      );

      if (!drivers.length) {
        return {
          status: StatusCode.NotFound,
          message: "No drivers available for this booking request",
        };
      }

      const pin = generatePIN();
      const booking = await this._bookingRepo.createBooking(
        data,
        data.distanceInfo.distanceInKm,
        data.estimatedPrice,
        pin
      );

      const requestId = `${booking._id}_${Date.now()}`;

      const notificationPayload: DriverNotificationPayload = {
        bookingId: booking._id.toString(),
        rideId: booking.rideId,
        requestId: requestId,
        user: {
          userId: booking.user.userId,
          userName: booking.user.userName,
          userNumber: booking.user.userNumber,
          userProfile: booking.user.userProfile,
        },
        pickupCoordinates: {
          latitude: booking.pickupCoordinates.latitude,
          longitude: booking.pickupCoordinates.longitude,
          address: booking.pickupCoordinates.address,
        },
        dropCoordinates: {
          latitude: booking.dropoffCoordinates.latitude,
          longitude: booking.dropoffCoordinates.longitude,
          address: booking.dropoffCoordinates.address,
        },
        distance: booking.distance,
        price: booking.price,
        estimatedDuration: booking.duration,
        pin: booking.pin,
        drivers: drivers,
        timeoutSeconds: 30,
        createdAt: new Date(),
      };

      await RabbitMQPublisher.publish("booking.request", notificationPayload);

      return {
        status: StatusCode.Created,
        message: "booking created successfully",
      };
    } catch (error) {
      console.error("Error creating booking", error);
      throw new Error(`Failed to create booking: ${(error as Error).message}`);
    }
  }

  async updateBooking(id: string, action: string): Promise<IResponse<null>> {
    try {
      const response = await this._bookingRepo.updateBookingStatus(id, action);
      if (!response) {
        return {
          status: StatusCode.Forbidden,
          message: "field unmatched",
        };
      }
      return {
        status: StatusCode.OK,
        message: "successfully updated",
      };
    } catch (error) {
      throw new Error(`Failed to update booking: ${(error as Error).message}`);
    }
  }

  async handleDriverAcceptance(data: DriverAssignmentPayload): Promise<void> {
    try {
      const response = await this._bookingRepo.updateAcceptedRide(data);
    } catch (error) {
      throw new Error(`Failed to update booking: ${(error as Error).message}`);
    }
  }

  async fetchDriverBookingList(
    id: string,
    role: string
  ): Promise<IResponse<BookingListDTO[]>> {
    try {
      const response = await this._bookingRepo.fetchBookingListWithDriverId(
        id,
        role
      );

      const dtoList: BookingListDTO[] = response.map((booking) => ({
        _id: booking._id.toString(),
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
        distance: booking.distance || null,
        price: booking.price ?? null,
        date: booking.date,
        status: booking.status,
      }));

      return {
        status: StatusCode.OK,
        message: "Successfully fetched the booking list",
        data: dtoList,
      };
    } catch (error) {
      console.log("fetchDriverBookingList service", error);
      throw new Error(`Failed to fetch bookings: ${(error as Error).message}`);
    }
  }

  async fetchDriverBookingDetails(
    id: string
  ): Promise<IResponse<BookingDetailsDto>> {
    try {
      const response = await this._bookingRepo.fetchBookingListWithBookingId(
        id
      );

      if (!response)
        return {
          status: StatusCode.NotFound,
          message: "not booking found",
        };

      const dto: BookingDetailsDto = {
        id: response._id.toString(),
        user: {
          userId: response.user.userId.toString(),
          userName: response.user.userName,
          userNumber: response.user.userNumber,
        },
        driver: response.driver
          ? {
              driverId: response.driver.driverId.toString(),
              driverName: response.driver.driverName,
              driverNumber: response.driver.driverNumber,
            }
          : undefined,

        pickupLocation: response.pickupLocation,
        dropoffLocation: response.dropoffLocation,
        pickupCoordinates: {
          latitude: response.pickupCoordinates.latitude,
          longitude: response.pickupCoordinates.longitude,
        },
        dropoffCoordinates: {
          latitude: response.dropoffCoordinates.latitude,
          longitude: response.dropoffCoordinates.longitude,
        },

        status: response.status,
        price: response.price,
        date: response.date.toISOString(),
        paymentMode: response.paymentMode,
        pin: response.pin,
        feedback: response.feedback,
        rating: response.rating,

        distance: response.distance,
        duration: response.duration,
        vehicleModel: response.vehicleModel,
      };

      return {
        status: StatusCode.OK,
        message: "Successfully fetched booking details",
        data: dto,
      };
    } catch (error) {
      console.log("fetchDriverBookingList service", error);
      throw new Error(`Failed fetch vehicles: ${(error as Error).message}`);
    }
  }

  async checkSecurityPin(
    securityPin: string,
    bookingId: string
  ): Promise<IResponse<null>> {
    try {
      const updatedBooking = await this._bookingRepo.verifyPinAndStartRide(
        bookingId,
        Number(securityPin)
      );

      if (!updatedBooking) {
        return {
          status: StatusCode.NotFound,
          message: "Invalid pin or booking not found",
        };
      }

      const payload = {
        userId: updatedBooking.user.userId,
        bookingId: updatedBooking._id.toString(),
        driverId: updatedBooking.driver.driverId,
        rideId: updatedBooking.rideId,
      };

      RabbitMQPublisher.publish("driver.startRide", payload);

      return {
        status: StatusCode.Accepted,
        message: "Pin verified successfully, ride started",
      };
    } catch (error) {
      console.log("Failed check security pin:", error);
      throw new Error(`Failed check security pin: ${(error as Error).message}`);
    }
  }

  async cancelRide(userId: string, rideId: string): Promise<IResponse<null>> {
    try {
      const response = await this._bookingRepo.cancelRide(userId, rideId);

      const payload = {
        rideId: response.rideId,
        driverId: response.driver.driverId,
        userId: response.user.userId,
      };

      RabbitMQPublisher.publish("cancel.ride", payload);

      return {
        message: "successfully canceled",
        status: StatusCode.OK,
      };
    } catch (error) {
      console.log("fetchDriverBookingList service", error);
      throw new Error(`Failed fetch vehicles: ${(error as Error).message}`);
    }
  }

  async completeRide(
    bookingId: string,
    userId: string
  ): Promise<IResponse<null>> {
    try {
      const updatedBooking = await this._bookingRepo.updateBookingStatus(
        bookingId,
        "Completed"
      );

      if (!updatedBooking) {
        throw new Error("Booking not found or could not be updated");
      }

      const data = {
        bookingId: updatedBooking._id.toString(),
        userId: updatedBooking.user.userId,
      };

      RabbitMQPublisher.publish("ride.completed", data);

      return {
        status: StatusCode.OK,
        message: "Ride marked as completed",
      };
    } catch (error) {
      console.log("Failed complete ride:", error);
      throw new Error(`Failed complete: ${(error as Error).message}`);
    }
  }

  async markAsPaid(bookingId: string, paymentId: string) {
    try {
      const booking = await this._bookingRepo.findBookingById(bookingId);

      if (!booking) throw new Error("Booking not found");

      booking.paymentStatus = "Completed";
      booking.paymentId = paymentId;
      await booking.save();

      return booking;
    } catch (error: any) {
      console.log("markAsPaid service", error);
      throw new Error(error);
    }
  }

  async rollbackPayment(bookingId: string) {
    try {
      const booking = await this._bookingRepo.findBookingById(bookingId);

      if (!booking) throw new Error("Booking not found");

      booking.paymentStatus = "Pending";
      booking.paymentId = null;
      await booking.save();

      return booking;
    } catch (error:any) {
      console.log("rollbackPayment service", error);
      throw new Error(error);
    }
  }
}
