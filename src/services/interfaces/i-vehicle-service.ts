import { PricingInterface } from "@/interfaces/price.interface";
import { IResponse } from "@Pick2Me/shared/interfaces";


export interface IVehicleService {
  fetchVehicles(): Promise<IResponse<PricingInterface[]>>;
  getPrice(distanceKm: number, vehicleModel: string): Promise<number>;
}
