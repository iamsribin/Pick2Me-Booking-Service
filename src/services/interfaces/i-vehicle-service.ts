import { VehicleInterface } from "@/interfaces/vehicle.interface";
import { IResponse } from "@Pick2Me/shared/interfaces";

export interface IVehicleService {
  fetchVehicles(): Promise<IResponse<VehicleInterface[]>>;
  getPrice(distanceKm: number, vehicleModel: string): Promise<number>;
}
