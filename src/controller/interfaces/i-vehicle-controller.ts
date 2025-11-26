import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { IResponse } from "../../types/common/response";
import { PricingInterface } from "../../interfaces/booking.interface";

export interface IVehicleController {
  fetchVehicles(
    call: ServerUnaryCall<{}, IResponse<PricingInterface[]>>,
    callback: sendUnaryData<IResponse<PricingInterface[]>>
  ): Promise<void>;

  
}
