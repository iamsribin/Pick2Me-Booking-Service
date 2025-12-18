import { IBookingController } from "../interfaces/i-booking-controller";
import { IBookingService } from "@/services/interfaces/i-booking-service";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/inversify-types";
import e, { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@Pick2Me/shared/errors";
import { StatusCode } from "@Pick2Me/shared/interfaces";
import { testDrivers } from "@/utils/testDrivers";
import { RedisService } from "@Pick2Me/shared/redis";

@injectable()
export class BookingController implements IBookingController {
  constructor(
    @inject(TYPES.BookingService) private _bookingService: IBookingService
  ) { }

  getNearbyDrivers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const lat = Number(req.query.lat ?? "");
      const lng = Number(req.query.lng ?? "");
      const radius = Number(req.query.radius ?? 5);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        throw BadRequestError("lat and lng required");
      }

      const drivers = await this._bookingService.getNearbyDriversForHomePage(
        lat,
        lng,
        radius
      );

      const driversList = drivers.length
        ? {
          success: true,
          drivers,
        }
        : testDrivers;

      res.status(StatusCode.OK).json(driversList);
    } catch (err) {
      console.log(err);

      next(err);
    }
  };

  bookRide = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const bookingDetails = req.body;
      const user = req.gatewayUser!;

      bookingDetails.userId = user.id;

      const ride = await this._bookingService.bookRide(bookingDetails);
      res.status(StatusCode.OK).json(ride);
    } catch (error) {
      next(error);
    }
  };

  getBookingData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = req.gatewayUser!;
      const rideData = await this._bookingService.getBookingData(user.id,user.role);
      if (rideData) {
        const driverLocation = await RedisService.getInstance().getDriverGeoPosition(rideData.driver?.driverId || '');
        const data = {
          rideData,
          driverLocation: driverLocation || null
        };        
        res.status(StatusCode.OK).json(data);
      } else {
        res.status(StatusCode.Continue).json(null);
      }
    } catch (error) {
      next(error);
    }
  };

  checkSecurityPin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { enteredPin, _id } = req.body;
      await this._bookingService.checkSecurityPin(Number(enteredPin), _id);
      res.status(StatusCode.OK).json("success");
    } catch (error) {
      next(error);
    }
  };
}

// {
//   pickupLocation: {
//     address: 'WW7M+W7H, Tirur, Kerala 676101, India',
//     latitude: 10.9148999,
//     longitude: 75.93326309999999
//   },
//   dropOffLocation: {
//     address: 'Kozhikode, Kerala, India',
//     latitude: 11.2488478,
//     longitude: 75.7839458
//   },
//   vehicleModel: 'Standard',
//   estimatedPrice: 1227,
//   estimatedDuration: '1 hour 18 mins',
//   distanceInfo: { distance: '56.3 km', distanceInKm: 56.316 }
// }
