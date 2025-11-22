import { IResponse } from '../../types/common/response';
import { BookingDetailsDto, BookingListDTO, CreateBookingResponseDTO } from '../../dto/booking.dto';
import { CreateBookingReq, DriverAssignmentPayload, UpdateAcceptRideReq } from '../../types/booking/request';
import { BookingInterface } from '../../interfaces/interface';

export interface IBookingService {
  createBooking(data: CreateBookingReq): Promise<IResponse<CreateBookingResponseDTO>>;
  updateBooking(id: string, action: string): Promise<IResponse<null>>;
  handleDriverAcceptance(data:DriverAssignmentPayload): Promise<void> 
  fetchDriverBookingList(id:string,role:string): Promise<IResponse<BookingListDTO[]>>;
  fetchDriverBookingDetails(id:string): Promise<IResponse<BookingDetailsDto>>;
  checkSecurityPin(securityPin: string, bookingId: string): Promise<IResponse<null>> 
  cancelRide(userId: string, rideId: string): Promise<IResponse<null>>;
  completeRide(bookingId: string,userId: string): Promise<IResponse<null>> ;
  rollbackPayment(bookingId: string): Promise<BookingInterface>
  markAsPaid(bookingId: string, paymentId: string) :Promise<BookingInterface>
}