import { container } from "@/config/inversify-config";
import { IBookingController } from "@/controller/interfaces/i-booking-controller";
import { IVehicleController } from "@/controller/interfaces/i-vehicle-controller";
import { TYPES } from "@/types/inversify-types";
import { Router } from "express";

const bookingController = container.get<IBookingController>(TYPES.BookingController);
const vehicleController = container.get<IVehicleController>(TYPES.VehicleController);

const userRouter = Router();

userRouter.get("/users/list-online-drivers", bookingController.getNearbyDrivers);
userRouter.get("/vehicles", vehicleController.fetchVehicles);

export { userRouter };
