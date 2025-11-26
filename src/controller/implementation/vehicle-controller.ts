import { IVehicleController } from "../interfaces/i-vehicle-controller";
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { IVehicleService } from "@/services/interfaces/i-vehicle-service";
import { IResponse, StatusCode } from "@Pick2Me/shared/interfaces";
import { PricingInterface } from "@/interfaces/price.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/inversify-types";
@injectable()
export class VehicleController implements IVehicleController {
  constructor(
    @inject(TYPES.VehicleService) private _vehicleService: IVehicleService
  ) {}

  async fetchVehicles(
    call: ServerUnaryCall<{}, IResponse<PricingInterface[]>>,
    callback: sendUnaryData<IResponse<PricingInterface[]>>
  ): Promise<void> {
    try {
      const response = await this._vehicleService.fetchVehicles();
      callback(null, response);
    } catch (error) {
      console.log(error);
      callback(null, {
        status: StatusCode.InternalServerError,
        message: (error as Error).message,
      });
    }
  }
}
