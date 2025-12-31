import { NextFunction, Request, Response } from "express";

export interface IVehicleController {
  fetchVehicles(req: Request, res: Response, next: NextFunction): Promise<void>;
}
