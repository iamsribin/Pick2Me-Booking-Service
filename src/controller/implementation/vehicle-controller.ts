import { IVehicleController } from "../interfaces/i-vehicle-controller";
import { IVehicleService } from "@/services/interfaces/i-vehicle-service";
import { inject, injectable } from "inversify";
import { TYPES } from "@/types/inversify-types";
import { NextFunction, Request, Response } from "express";

@injectable()
export class VehicleController implements IVehicleController {
  constructor(
    @inject(TYPES.VehicleService) private _vehicleService: IVehicleService
  ) {}

  fetchVehicles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const response = await this._vehicleService.fetchVehicles();
      res.status(+response.status).json(response.data);
    } catch (error) {
      next(error);
    }
  };
}
