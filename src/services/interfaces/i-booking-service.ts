import { BookingReq } from "@/types/booking/request";
import { OnlineDriverPreview } from "@Pick2Me/shared/interfaces";

export interface IBookingService {
  getNearbyDriversForHomePage(
    lat: number,
    lng: number,
    radiusKm: number
  ): Promise<OnlineDriverPreview[]>;
  bookRide(bookingReq: BookingReq): Promise<void>;
}
