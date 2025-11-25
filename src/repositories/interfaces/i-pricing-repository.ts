import { IMongoBaseRepository } from "@Pick2Me/shared/mongo";
import { PricingInterface } from "@/interfaces/interface";

export type IPricingRepository = IMongoBaseRepository<PricingInterface>;
