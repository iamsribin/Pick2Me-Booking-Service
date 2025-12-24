import { BookRideResponseDto } from "@/dto/booking.dto";
import { BookingReq, RideAcceptReq } from "@/types/booking";
import { OnlineDriverPreview } from "@Pick2Me/shared/interfaces";

export interface IBookingService {
  getNearbyDriversForHomePage(
    lat: number,
    lng: number,
    radiusKm: number
  ): Promise<OnlineDriverPreview[]>;
  bookRide(bookingReq: BookingReq): Promise<BookRideResponseDto>;
  rideAccept(driverData: RideAcceptReq): Promise<void>;
  cancelRide(rideId:string): Promise<void>;
  completeRide(rideId:string): Promise<void>;
  checkSecurityPin(enteredPin:number,_id:string): Promise<void>;
  getBookingData(userId: string, role: string): Promise<BookRideResponseDto | null>
}
