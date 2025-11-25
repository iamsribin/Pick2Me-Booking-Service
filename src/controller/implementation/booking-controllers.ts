import { IBookingController } from "../interfaces/i-booking-controller";
import { IBookingService } from "@/services/interfaces/i-booking-service";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/inversify-types";
import { NextFunction, Request, Response } from "express";
import {
  CreateBookingReq,
  DriverAssignmentPayload,
} from "@/types/booking/request";
import { BadRequestError } from "@Pick2Me/shared/errors";
import { StatusCode } from "@Pick2Me/shared/interfaces";

@injectable()
export class BookingController implements IBookingController {
  constructor(
    @inject(TYPES.BookingService) private _bookingService: IBookingService
  ) {}

  // POST /bookings
  createBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = req.body as CreateBookingReq;
      // basic validation
      if (!data || !data.userId)
        throw BadRequestError("invalid booking payload");

      const response = await this._bookingService.createBooking(data);
      res.status(+response.status).json(response);
    } catch (err) {
      next(err);
    }
  };

  // POST /bookings/driver-accept
  // (keeps the original behavior but exposed as an HTTP endpoint that accepts driver assignment payload)
  handleDriverAcceptance = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const payload = req.body as DriverAssignmentPayload;
      if (!payload || !payload.bookingId || !payload.driver.driverId) {
        throw BadRequestError("invalid driver assignment payload");
      }

      await this._bookingService.handleDriverAcceptance(payload);
      res.status(StatusCode.OK).json({ message: "driver acceptance handled" });
    } catch (err) {
      next(err);
    }
  };

  // GET /drivers/:id/bookings?role=driver&page=1&limit=10
  fetchDriverBookingList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = String(req.params.id || req.query.id || "");
      const role = String(req.query.role || "");
      if (!id) throw BadRequestError("driver id required");

      const response = await this._bookingService.fetchDriverBookingList(
        id,
        role
      );
      res.status(StatusCode.OK).json(response);
    } catch (err) {
      next(err);
    }
  };

  // GET /bookings/:id
  fetchDriverBookingDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = String(req.params.id || "");
      if (!id) throw BadRequestError("booking id required");

      const response = await this._bookingService.fetchDriverBookingDetails(id);
      res.status(StatusCode.OK).json(response);
    } catch (err) {
      next(err);
    }
  };

  // POST /bookings/:bookingId/check-pin
  // body: { securityPin: string }
  checkSecurityPin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const bookingId = String(
        req.params.bookingId || req.body.bookingId || ""
      );
      const securityPin = String(req.body.securityPin || "");
      if (!bookingId || !securityPin)
        throw BadRequestError("bookingId and securityPin required");

      const response = await this._bookingService.checkSecurityPin(
        securityPin,
        bookingId
      );
      res.status(StatusCode.OK).json(response);
    } catch (err) {
      next(err);
    }
  };

  // POST /bookings/:rideId/cancel
  // body: { userId: string }
  cancelRide = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const rideId = String(req.params.rideId || req.body.rideId || "");
      const userId = String(req.body.userId || req.query.userId || "");
      if (!rideId || !userId)
        throw BadRequestError("userId and rideId required");

      const response = await this._bookingService.cancelRide(userId, rideId);
      res.status(StatusCode.OK).json(response);
    } catch (err) {
      next(err);
    }
  };

  // POST /bookings/:bookingId/complete
  // body: { userId: string }
  completeRide = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const bookingId = String(
        req.params.bookingId || req.body.bookingId || ""
      );
      const userId = String(req.body.userId || req.query.userId || "");
      if (!bookingId || !userId)
        throw BadRequestError("bookingId and userId required");

      const response = await this._bookingService.completeRide(
        bookingId,
        userId
      );
      res.status(StatusCode.OK).json(response);
    } catch (err) {
      next(err);
    }
  };

  // POST /bookings/:bookingId/mark-paid
  // body: { paymentId: string }
  MarkAsPaid = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const bookingId = String(
        req.params.bookingId || req.body.bookingId || ""
      );
      const paymentId = String(req.body.paymentId || "");
      if (!bookingId || !paymentId)
        throw BadRequestError("bookingId and paymentId required");

      await this._bookingService.markAsPaid(bookingId, paymentId);
      res
        .status(StatusCode.OK)
        .json({ status: "success", message: "Booking marked as paid" });
    } catch (err: any) {
      next(err);
    }
  };

  // POST /bookings/:bookingId/rollback-payment
  RollbackPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const bookingId = String(
        req.params.bookingId || req.body.bookingId || ""
      );
      if (!bookingId) throw BadRequestError("bookingId required");

      await this._bookingService.rollbackPayment(bookingId);
      res
        .status(StatusCode.OK)
        .json({ status: "success", message: "Payment rolled back" });
    } catch (err: any) {
      next(err);
    }
  };
}
