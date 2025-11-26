import { PricingInterface } from "@/interfaces/price.interface";
import { PricingModel } from "../../model/pricing.model";
import { IPricingRepository } from "../interfaces/i-pricing-repository";
import { MongoBaseRepository } from "@Pick2Me/shared/mongo";

export class PricingRepository
  extends MongoBaseRepository<PricingInterface>
  implements IPricingRepository
{
  constructor() {
    super(PricingModel);
  }
}
