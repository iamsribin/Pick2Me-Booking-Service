
export interface IBookingService {
  getNearbyDriversForHomePage(
    lat: number,
    lng: number,
    radius: number
  ): Promise<void>;
}
