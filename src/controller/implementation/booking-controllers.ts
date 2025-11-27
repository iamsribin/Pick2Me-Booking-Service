import { IBookingController } from "../interfaces/i-booking-controller";
import { IBookingService } from "@/services/interfaces/i-booking-service";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/inversify-types";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "@Pick2Me/shared/errors";
import { StatusCode } from "@Pick2Me/shared/interfaces";
import { testDrivers } from "@/utils/testDrivers";

@injectable()
export class BookingController implements IBookingController {
  constructor(
    @inject(TYPES.BookingService) private _bookingService: IBookingService
  ) {}

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
      console.log("driversList", driversList);

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
      console.log("booking", bookingDetails);
      this._bookingService.bookRide(bookingDetails);
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
