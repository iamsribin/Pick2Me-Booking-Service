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

@injectable()
export class BookingService implements IBookingService {
  constructor(@inject(TYPES.BookingRepository)private _bookingRepo: IBookingRepository) {}

  async getNearbyDriversForHomePage(
    lat: number,
    lng: number,
    radius: number
  ): Promise<void> {
    try {
      if (!lat || !lng) {
        throw BadRequestError("lat and lng required");
      }

      const redisService = RedisService.getInstance();

      const driversGeo = await redisService.findNearbyDrivers(lat, lng, radius);
      console.log("driversGeo", driversGeo);

      const enrichedDrivers = await Promise.all(
        driversGeo.map(async (item: any) => {
          const driverId = String(item[0]);
          const coords = Array.isArray(item[1])
            ? item[1]
            : item[item.length - 1];
          const longitude = coords[0];
          const latitude = coords[1];

          const details = await redisService.getOnlineDriverDetails(driverId);
          if (!details) return null;

          return {
            driverId,
            lat: parseFloat(latitude),
            lng: parseFloat(longitude),
            vehicleModel: details.vehicleModel,
            name: details.name,
          };
        })
      );

      const availableDrivers = enrichedDrivers.filter((d) => d !== null);
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw InternalError("something went wrong");
    }
  }
}
