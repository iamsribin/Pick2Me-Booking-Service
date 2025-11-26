import { IMongoBaseRepository } from "@Pick2Me/shared/mongo";
import { PricingInterface } from "@/interfaces/booking.interface";

export type IPricingRepository = IMongoBaseRepository<PricingInterface>;
