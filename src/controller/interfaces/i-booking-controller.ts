import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import {
  CreateBookingReq,
  DriverAssignmentPayload,
} from "../../types/booking/request";
import { IResponse } from "../../types/common/response";
import {
  BookingDetailsDto,
  BookingListDTO,
  CreateBookingResponseDTO,
} from "../../dto/booking.dto";

export interface ControllerResponse {
  message: string;
  data?: any;
  status?: string;
}

export interface DriverDetails {
  driverId: string;
  distance: number;
  rating: number;
  cancelCount: number;
}

export interface IBookingController {
  createBooking(
    call: ServerUnaryCall<
      CreateBookingReq,
      IResponse<CreateBookingResponseDTO>
    >,
    callback: sendUnaryData<IResponse<CreateBookingResponseDTO>>
  ): Promise<void>;

  handleDriverAcceptance(data: DriverAssignmentPayload): Promise<void>;
  fetchDriverBookingList(
    call: ServerUnaryCall<{ id: string }, IResponse<BookingListDTO[]>>,
    callback: sendUnaryData<IResponse<BookingListDTO[]>>
  ): Promise<void>;

  fetchDriverBookingDetails(
    call: ServerUnaryCall<{ id: string }, IResponse<BookingDetailsDto>>,
    callback: sendUnaryData<IResponse<BookingDetailsDto>>
  ): Promise<void>;

  checkSecurityPin(
    call: ServerUnaryCall<
      { securityPin: string; bookingId: string },
      IResponse<null>
    >,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void> 

  cancelRide(
    call: ServerUnaryCall<{ userId: string; ride_id: string }, IResponse<null>>,
    callback: sendUnaryData<IResponse<null>>
  ): Promise<void>;
}
