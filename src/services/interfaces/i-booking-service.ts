import { IResponse } from '../../types/common/response';
import { BookingDetailsDto, BookingListDTO, CreateBookingResponseDTO } from '../../dto/booking.dto';
import { CreateBookingReq, DriverAssignmentPayload, UpdateAcceptRideReq } from '../../types/booking/request';

export interface IBookingService {
  createBooking(data: CreateBookingReq): Promise<IResponse<CreateBookingResponseDTO>>;
  updateBooking(id: string, action: string): Promise<IResponse<null>>;
  handleDriverAcceptance(data:DriverAssignmentPayload): Promise<void> 
  // updateAcceptedRide(data:UpdateAcceptRideReq): Promise<IResponse<null>>;
  fetchDriverBookingList(id:string): Promise<IResponse<BookingListDTO[]>>;
  fetchDriverBookingDetails(id:string): Promise<IResponse<BookingDetailsDto>>;
  checkSecurityPin(securityPin: string, bookingId: string): Promise<IResponse<null>> 
  cancelRide(userId: string, rideId: string): Promise<IResponse<null>>;
}