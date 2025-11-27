import { IMongoBaseRepository } from "@Pick2Me/shared/mongo";
import { VehicleInterface } from "@/interfaces/vehicle.interface";

export type IVehicleRepository = IMongoBaseRepository<VehicleInterface>;
