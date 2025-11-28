import { IVehicleService } from "../interfaces/i-vehicle-service";
import { IVehicleRepository } from "../../repositories/interfaces/i-pricing-repository";
import { IResponse, StatusCode } from "@Pick2Me/shared/interfaces";
import { VehicleInterface } from "@/interfaces/vehicle.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/inversify-types";
import { InternalError } from "@Pick2Me/shared/errors";

@injectable()
export class VehicleService implements IVehicleService {
  constructor(
    @inject(TYPES.PricingRepository) private _vehicleRepo: IVehicleRepository
  ) {}

  async getPrice(distanceKm: number, vehicleModel: string): Promise<number> {
    try {
      const config = await this._vehicleRepo.findOne({ vehicleModel });
      if (!config) {
        throw new Error(`Pricing configuration not found for ${vehicleModel}`);
      }

      const { basePrice, pricePerKm, minDistanceKm } = config;

      const minKm = parseFloat(minDistanceKm ?? "0");
      const additionalDistance = Math.max(0, distanceKm - minKm);
      const price = basePrice + additionalDistance * pricePerKm;

      return Math.round(price);
    } catch (error) {
      throw new Error(`Price calculation failed: ${(error as Error).message}`);
    }
  }

  async fetchVehicles(): Promise<IResponse<VehicleInterface[]>> {
    try {
      const response = await this._vehicleRepo.find({});
      return {
        message: "vehicle list fetch",
        status: StatusCode.OK,
        data: response,
      };
    } catch (error) {
      throw InternalError((error as Error).message);
    }
  }

  // async updatePricing(
  //   adminId: string,
  //   vehicleModel: string,
  //   config: PricingConfig
  // ): Promise<PricingConfig> {
  //   try {
  //     return await this._pricingRepo.findOneAndUpdat(
  //       { vehicleModel },
  //       { ...config, updatedBy: adminId, updatedAt: new Date() },
  //       { new: true, upsert: true }
  //     );
  //   } catch (error) {
  //     throw new Error(`Failed to update pricing: ${(error as Error).message}`);
  //   }
  // }
}
