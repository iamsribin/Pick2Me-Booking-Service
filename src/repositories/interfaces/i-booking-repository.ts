import {
  BookingInterface,
  Coordinates,
} from "../../interfaces/booking.interface";
import {
  CreateBookingReq,
  DriverAssignmentPayload,
} from "../../types/booking/request";

export interface IBookingRepository {
  createBooking(
    data: CreateBookingReq,
    distanceKm: number,
    price: number,
    pin: number
  ): Promise<BookingInterface>;

  findBookingById(rideId: string): Promise<BookingInterface | null>;

  updateBookingStatus(
    id: string,
    status: string
  ): Promise<BookingInterface | null>;

  confirmRide(pin: number): Promise<BookingInterface | null>;

  updateDriverCoordinates(
    rideId: string,
    coordinates: Coordinates
  ): Promise<BookingInterface | null>;

  updateAcceptedRide(
    data: DriverAssignmentPayload
  ): Promise<BookingInterface | null>;

  fetchBookingListWithDriverId(
    id: string,
    role: string
  ): Promise<BookingInterface[]>;

  fetchBookingListWithBookingId(
    id: string
  ): Promise<BookingInterface | null>;

  verifyPinAndStartRide(
    bookingId: string,
    pin: number
  ): Promise<BookingInterface | null>;

  cancelRide(
    userId: string,
    rideId: string
  ): Promise<BookingInterface>;
}
