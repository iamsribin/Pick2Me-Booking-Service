import { container } from "@/config/inversify-config";
import { IBookingController } from "@/controller/interfaces/i-booking-controller";
import { IVehicleController } from "@/controller/interfaces/i-vehicle-controller";
import { TYPES } from "@/types/inversify-types";
import { verifyGatewayJwt } from "@Pick2Me/shared/auth";
import { Router } from "express";

const bookingController = container.get<IBookingController>(
  TYPES.BookingController,
);
const vehicleController = container.get<IVehicleController>(
  TYPES.VehicleController,
);

const userRouter = Router();

//  All routes below require a valid gateway gateway JWT
userRouter.use(verifyGatewayJwt(true, process.env.GATEWAY_SHARED_SECRET!));
userRouter.post("/me/book-cab", bookingController.bookRide);
userRouter.post("/check-security-pin", bookingController.checkSecurityPin);
userRouter.get("/me/booking-data", bookingController.getBookingData);
userRouter.post("/complete-ride/:rideId", bookingController.completeRide);
export { userRouter };
