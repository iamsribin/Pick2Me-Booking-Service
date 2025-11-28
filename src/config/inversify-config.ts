import { Container } from "inversify";
import { TYPES } from "../types/inversify-types";
import { IBookingController } from "@/controller/interfaces/i-booking-controller";
import { BookingController } from "@/controller/implementation/booking-controllers";
import { IVehicleController } from "@/controller/interfaces/i-vehicle-controller";
import { VehicleController } from "@/controller/implementation/vehicle-controller";
import { IBookingService } from "@/services/interfaces/i-booking-service";
import { BookingService } from "@/services/implementation/booking-service";
import { IVehicleService } from "@/services/interfaces/i-vehicle-service";
import { VehicleService } from "@/services/implementation/vehicle-service";
import { BookingRepository } from "@/repositories/implementation/booking-repository";
import { BookingInterface } from "@/interfaces/booking.interface";
import { IBookingRepository } from "@/repositories/interfaces/i-booking-repository";
import { IVehicleRepository } from "@/repositories/interfaces/i-pricing-repository";
import { PricingRepository } from "@/repositories/implementation/pricing-repository";

const container = new Container();

container
  .bind<IBookingController>(TYPES.BookingController)
  .to(BookingController);
container
  .bind<IVehicleController>(TYPES.VehicleController)
  .to(VehicleController);

container.bind<IBookingService>(TYPES.BookingService).to(BookingService);
container.bind<IVehicleService>(TYPES.VehicleService).to(VehicleService);

container
  .bind<IBookingRepository>(TYPES.BookingRepository)
  .to(BookingRepository);

  container
  .bind<IVehicleRepository>(TYPES.PricingRepository)
  .to(PricingRepository);

  export {container};