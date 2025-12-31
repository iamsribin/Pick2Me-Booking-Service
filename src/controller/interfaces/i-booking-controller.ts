import { Request, Response, NextFunction } from "express";

export interface IBookingController {
  getNearbyDrivers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;

  bookRide(req: Request, res: Response, next: NextFunction): Promise<void>;
  checkSecurityPin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getBookingData(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  completeRide(req: Request, res: Response, next: NextFunction): Promise<void>;
}
