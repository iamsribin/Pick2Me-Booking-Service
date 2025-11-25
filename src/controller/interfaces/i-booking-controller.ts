import { Request, Response, NextFunction } from "express";

export interface IBookingController {
  // POST /bookings
  createBooking(req: Request, res: Response, next: NextFunction): Promise<void>;

  // POST /bookings/driver-accept
  handleDriverAcceptance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // GET /drivers/:id/bookings
  fetchDriverBookingList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // GET /bookings/:id
  fetchDriverBookingDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // POST /bookings/:bookingId/check-pin
  checkSecurityPin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // POST /bookings/:rideId/cancel
  cancelRide(req: Request, res: Response, next: NextFunction): Promise<void>;

  // POST /bookings/:bookingId/complete
  completeRide(req: Request, res: Response, next: NextFunction): Promise<void>;

  // POST /bookings/:bookingId/mark-paid
  MarkAsPaid(req: Request, res: Response, next: NextFunction): Promise<void>;

  // POST /bookings/:bookingId/rollback-payment
  RollbackPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
