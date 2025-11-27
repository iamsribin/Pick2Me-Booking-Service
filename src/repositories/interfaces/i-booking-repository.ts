import {
  BookingInterface,
} from "@/interfaces/booking.interface";
import { IMongoBaseRepository } from "@Pick2Me/shared/mongo";


export type IBookingRepository = IMongoBaseRepository<BookingInterface>

// {
  // createBooking(
  //   data: BookingReq,
  //   pin: number
  // ): Promise<BookingInterface>;

  // findBookingById(rideId: string): Promise<BookingInterface | null>;

  // updateBookingStatus(
  //   id: string,
  //   status: string
  // ): Promise<BookingInterface | null>;

  // confirmRide(pin: number): Promise<BookingInterface | null>;

  // updateDriverCoordinates(
  //   rideId: string,
  //   coordinates: Coordinates
  // ): Promise<BookingInterface | null>;

  // updateAcceptedRide(
  //   data: DriverAssignmentPayload
  // ): Promise<BookingInterface | null>;

  // fetchBookingListWithDriverId(
  //   id: string,
  //   role: string
  // ): Promise<BookingInterface[]>;

  // fetchBookingListWithBookingId(
  //   id: string
  // ): Promise<BookingInterface | null>;

  // verifyPinAndStartRide(
  //   bookingId: string,
  //   pin: number
  // ): Promise<BookingInterface | null>;

  // cancelRide(
  //   userId: string,
  //   rideId: string
  // ): Promise<BookingInterface>;
// }
