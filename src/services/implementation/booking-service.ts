import { generatePIN, generateRideId } from "@/utils/generatePIN";
import { IBookingService } from "../interfaces/i-booking-service";
import { IBookingRepository } from "@/repositories/interfaces/i-booking-repository";
import {
  BadRequestError,
  HttpError,
  InternalError,
} from "@Pick2Me/shared/errors";
import { RedisService } from "@Pick2Me/shared/redis";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/inversify-types";
import { OnlineDriverPreview } from "@Pick2Me/shared/interfaces";
import { fetchUserInfo } from "@/grpc/client/user-client";
import { BookingReq, RideAcceptReq } from "@/types/booking";
import { BookRideResponseDto } from "@/dto/booking.dto";
import { EventProducer } from "@/events/publisher";

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(TYPES.BookingRepository) private _bookingRepo: IBookingRepository
  ) {}

  async getNearbyDriversForHomePage(
    lat: number,
    lng: number,
    radiusKm: number
  ): Promise<OnlineDriverPreview[]> {
    try {
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        throw BadRequestError("lat and lng required and must be numbers");
      }

      const redisService = RedisService.getInstance();

      // findNearbyDrivers returns driverId + coords + distance
      const driversGeo = await redisService.findNearbyDrivers(
        lat,
        lng,
        radiusKm
      );

      if (!driversGeo || driversGeo.length === 0) return [];

      const enriched = await Promise.all(
        driversGeo.map(async (d) => {
          const details = await redisService.getOnlineDriverDetails(d.driverId);

          if (!details) return null;

          const summary: OnlineDriverPreview = {
            driverId: d.driverId,
            lat: d.latitude,
            lng: d.longitude,
            distanceKm: d.distanceKm,
            vehicleModel: details.vehicleModel,
            name: details.name,
          };

          return summary;
        })
      );

      return enriched.filter((x): x is OnlineDriverPreview => x !== null);
    } catch (error) {
      console.log(error);

      if (error instanceof HttpError) throw error;
      throw InternalError("something went wrong");
    }
  }

  async bookRide(bookingReq: BookingReq): Promise<BookRideResponseDto> {
    try {
      const redisService = RedisService.getInstance();

      const driversGeo = await redisService.findNearbyDrivers(
        bookingReq.pickupLocation.latitude,
        bookingReq.pickupLocation.longitude,
        10
      );

      if (!driversGeo || driversGeo.length === 0)
        throw BadRequestError("no drivers available nearby");

      const pin = generatePIN();

      //GRPC call
      const userInfo = await fetchUserInfo(bookingReq.userId);
      const rideId = generateRideId();

      const rideData = await this._bookingRepo.create({
        rideId,
        user: userInfo,
        pin,
        pickupCoordinates: bookingReq.pickupLocation,
        dropOffCoordinates: bookingReq.dropOffLocation,
        vehicleModel: bookingReq.vehicleModel,
        price: bookingReq.estimatedPrice,
        duration: bookingReq.estimatedDuration,
        distanceInfo: bookingReq.distanceInfo,
      });

      if (!rideData) throw InternalError("something went wrong");

      const rideResponseDto: BookRideResponseDto = {
        id: rideData._id.toString(),
        distanceInfo: rideData.distanceInfo,
        dropOffCoordinates: rideData.dropOffCoordinates,
        pickupCoordinates: rideData.pickupCoordinates,
        duration: rideData.duration,
        pin: rideData.pin,
        price: rideData.price,
        user: rideData.user,
        vehicleModel: rideData.vehicleModel,
        date: rideData.date,
        paymentMode: rideData.paymentMode,
        paymentStatus: rideData.paymentStatus,
        rideId: rideData.rideId,
        status: rideData.status,
      };

      await EventProducer.publishRideRequest(rideResponseDto);

      return rideResponseDto;
    } catch (error) {
      console.log(error);

      if (error instanceof HttpError) throw error;
      throw InternalError("something went wrong");
    }
  }

  async rideAccept(driverData: RideAcceptReq): Promise<void> {
    try {
      const normalizedStatus =
        driverData.status === "ACCEPT" ? "Accepted" : driverData.status;

      const driverPayload = {
        driverId: driverData.driver.driverId,
        driverName: driverData.driver.driverName,
        driverNumber: driverData.driver.driverNumber,
        driverProfile: driverData.driver.driverProfile,
      };

      const filter = {
        _id: driverData.id,
        status: "Pending",
      };

      const update = {
        $set: {
          driver: driverPayload,
          status: normalizedStatus,
        },
      };

      const updated = await this._bookingRepo.updateOne(
        filter as any,
        update as any
      );

      if (!updated) {
        throw BadRequestError("Ride not found or not in Pending state");
      }
    } catch (err) {
      console.log(err);

      if (err instanceof HttpError) throw err;
      throw InternalError("something went wrong while accepting the ride");
    }
  }

  async checkSecurityPin(enteredPin: number, _id: string): Promise<void> {
    try {
      if (!enteredPin || !_id) throw BadRequestError("some fields are missing");

      const ride = await this._bookingRepo.findById(_id);
      if (!ride) throw BadRequestError("no ride found");
      console.log(ride.pin ,"===", enteredPin);
      
      if (ride.pin === enteredPin) {
        this._bookingRepo.update(_id, { status: "InRide" });
        const rideDetails = {
          userId: ride.user.userId,
          driverId: ride.driver.driverId,
          status: "InRide",
        };
        await EventProducer.publishRideStart(rideDetails);
      } else {
        throw BadRequestError("wrong pin");
      }
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw InternalError("something went wrong");
    }
  }

  async cancelRide(_id: string): Promise<void> {
    await this._bookingRepo.update(_id, { status: "Cancelled" });
  }
}
