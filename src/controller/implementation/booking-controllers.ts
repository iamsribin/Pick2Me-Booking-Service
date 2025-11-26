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

      res.status(StatusCode.OK).json(driversList);
    } catch (err) {
      console.log(err);

      next(err);
    }
  };
}
