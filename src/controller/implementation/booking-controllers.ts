import { IBookingController } from "../interfaces/i-booking-controller";
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { IResponse } from "../../types/common/response";
import {
  BookingDetailsDto,
  BookingListDTO,
  CreateBookingResponseDTO,
} from "../../dto/booking.dto";
import { StatusCode } from "../../types/common/status-code";
import { IBookingService } from "../../services/interfaces/i-booking-service";
import {
  CreateBookingReq,
  DriverAssignmentPayload,
} from "../../types/booking/request";

export class BookingController implements IBookingController {
  constructor(private _bookingService: IBookingService) {}

  async createBooking(
    call: ServerUnaryCall<
      CreateBookingReq,
      IResponse<CreateBookingResponseDTO>
    >,
    callback: sendUnaryData<IResponse<CreateBookingResponseDTO>>
  ): Promise<void> {
    try {
      const data = { ...call.request };

      const response = await this._bookingService.createBooking(data);

      callback(null, response);
    } catch (error) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async handleDriverAcceptance(data: DriverAssignmentPayload): Promise<void> {
    try {
      await this._bookingService.handleDriverAcceptance(data);
    } catch (error) {
      console.log("error", error);
    }
  }

  async fetchDriverBookingList(
    call: ServerUnaryCall<
      { id: string; role: string },
      IResponse<BookingListDTO[]>
    >,
    callback: sendUnaryData<IResponse<BookingListDTO[]>>
  ): Promise<void> {
    try {
      const { id, role } = call.request;

      const response = await this._bookingService.fetchDriverBookingList(
        id,
        role
      );

      callback(null, response);
    } catch (error) {
      console.log(error);
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async fetchDriverBookingDetails(
    call: ServerUnaryCall<{ id: string }, IResponse<BookingDetailsDto>>,
    callback: sendUnaryData<IResponse<BookingDetailsDto>>
  ): Promise<void> {
    try {
      const { id } = call.request;

      const response = await this._bookingService.fetchDriverBookingDetails(id);

      callback(null, response);
    } catch (error) {
      console.log(error);
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async checkSecurityPin(
    call: ServerUnaryCall<
      { securityPin: string; bookingId: string },
      IResponse<null>
    >,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void> {
    try {
      const { securityPin, bookingId } = call.request;

      const response = await this._bookingService.checkSecurityPin(
        securityPin,
        bookingId
      );

      callback(null, response);
    } catch (error) {
      console.log(error);
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async cancelRide(
    call: ServerUnaryCall<{ userId: string; rideId: string }, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void> {
    try {
      const data = { ...call.request };

      const response = await this._bookingService.cancelRide(
        data.userId,
        data.rideId
      );

      callback(null, response);
    } catch (error) {
      console.log(error);
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async completeRide(
    call: ServerUnaryCall<
      { bookingId: string; userId: string },
      IResponse<null>
    >,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void> {
    try {
      const data = { ...call.request };

      const response = await this._bookingService.completeRide(
        data.bookingId,
        data.userId
      );

      callback(null, response);
    } catch (error) {
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }

  async MarkAsPaid(
    call: ServerUnaryCall<
      { bookingId: string; paymentId: string },
      { status: string; message: string }
    >,
    callback: sendUnaryData<{ status: string; message: string }>
  ): Promise<void> {
    try {
      const { bookingId, paymentId } = call.request;

      const result = await this._bookingService.markAsPaid(
        bookingId,
        paymentId
      );

      callback(null, { status: "success", message: "Booking marked as paid" });
    } catch (error: any) {
      console.log(error);

      callback(null, { status: "error", message: error.message });
    }
  }

  async RollbackPayment(
    call: ServerUnaryCall<
      { bookingId: string },
      { status: string; message: string }
    >,
    callback: sendUnaryData<{ status: string; message: string }>
  ): Promise<void> {
    try {
      const { bookingId } = call.request;

      const result = await this._bookingService.rollbackPayment(bookingId);

      callback(null, { status: "success", message: "Payment rolled back" });
    } catch (error: any) {
      callback(null, { status: "error", message: error.message });
    }
  }
}
