import { IVehicleController } from "../interfaces/i-vehicle-controller";
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { PricingInterface } from "@/interfaces/interface";
import { IVehicleService } from "@/services/interfaces/i-vehicle-service";
import { IResponse, StatusCode } from "@Pick2Me/shared/interfaces";

export class VehicleController implements IVehicleController {
  constructor(private _vehicleService: IVehicleService) {}

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
