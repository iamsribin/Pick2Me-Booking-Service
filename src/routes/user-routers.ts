import { container } from "@/config/inversify-config";
import { IBookingController } from "@/controller/interfaces/i-booking-controller";
import { TYPES } from "@/types/inversify-types";
import { Router } from "express";

const bookingController = container.get<IBookingController>(TYPES.BookingController);

const userRouter = Router();

userRouter.get("/users/list-online-drivers", bookingController.getNearbyDrivers);

export { userRouter };
