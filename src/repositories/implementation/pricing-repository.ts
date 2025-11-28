import { VehicleInterface } from "@/interfaces/vehicle.interface";
import { VehicleModel } from "../../model/vehicle.model";
import { IVehicleRepository } from "../interfaces/i-pricing-repository";
import { MongoBaseRepository } from "@Pick2Me/shared/mongo";

export class PricingRepository
  extends MongoBaseRepository<VehicleInterface>
  implements IVehicleRepository
{
  constructor() {
    super(VehicleModel);
  }
}
