import { generatePIN } from "@/utils/generatePIN";
import { IBookingService } from "../interfaces/i-booking-service";
import { IBookingRepository } from "@/repositories/interfaces/i-booking-repository";
import {
  BadRequestError,
  HttpError,
  InternalError,
} from "@Pick2Me/shared/errors";
import { RedisService } from "@Pick2Me/shared/redis";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/inversify-types";
import { OnlineDriverPreview } from "@Pick2Me/shared/interfaces";
import { BookingReq } from "@/types/booking/request";
import { fetchUserInfo } from "@/grpc/client/user-client";
import { userInfo } from "os";

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(TYPES.BookingRepository) private _bookingRepo: IBookingRepository
  ) {}

  async getNearbyDriversForHomePage(
    lat: number,
    lng: number,
    radiusKm: number
  ): Promise<OnlineDriverPreview[]> {
    try {
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        throw BadRequestError("lat and lng required and must be numbers");
      }

      const redisService = RedisService.getInstance();

      // findNearbyDrivers returns driverId + coords + distance
      const driversGeo = await redisService.findNearbyDrivers(
        lat,
        lng,
        radiusKm
      );

      if (!driversGeo || driversGeo.length === 0) return [];

      const enriched = await Promise.all(
        driversGeo.map(async (d) => {
          const details = await redisService.getOnlineDriverDetails(d.driverId);

          if (!details) return null;

          const summary: OnlineDriverPreview = {
            driverId: d.driverId,
            lat: d.latitude,
            lng: d.longitude,
            distanceKm: d.distanceKm,
            vehicleModel: details.vehicleModel,
            name: details.name,
          };

          return summary;
        })
      );

      return enriched.filter((x): x is OnlineDriverPreview => x !== null);
    } catch (error) {
      console.log(error);

      if (error instanceof HttpError) throw error;
      throw InternalError("something went wrong");
    }
  }

  async bookRide(bookingReq: BookingReq): Promise<void> {
    try {
      const redisService = RedisService.getInstance();

      const driversGeo = await redisService.findNearbyDrivers(
        bookingReq.pickupLocation.latitude,
        bookingReq.pickupLocation.longitude,
        10
      );

      if (!driversGeo || driversGeo.length === 0)
        throw BadRequestError("no drivers available nearby");

      const pin = generatePIN();
      const userInfo = await fetchUserInfo(bookingReq.userId);
      console.log("userInfo ent",userInfo);

      await this._bookingRepo.create({
        user: userInfo,
        pin: pin,
        pickupCoordinates: bookingReq.pickupLocation,
        dropOffCoordinates: bookingReq.dropOffLocation,
        vehicleModel: bookingReq.vehicleModel,
        price: bookingReq.estimatedPrice,
        duration: bookingReq.estimatedDuration,
        distanceInfo: bookingReq.distanceInfo,
      });
    } catch (error) {
      console.log(error);

      if (error instanceof HttpError) throw error;
      throw InternalError("something went wrong");
    }
  }
}
