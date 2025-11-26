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

  async getNearbyDrivers(req: Request, res: Response, next: NextFunction) {
    try {
      const lat = Number(req.query.lat || "");
      const lng = Number(req.query.lng || "");
      const radius = Number(req.query.radius ?? 5);
      console.log({ lat, lng, radius });
      this._bookingService.getNearbyDriversForHomePage(lat, lng, radius);

      res.status(StatusCode.OK).json(testDrivers);
    } catch (err) {
      next(err);
    }
  }


}
