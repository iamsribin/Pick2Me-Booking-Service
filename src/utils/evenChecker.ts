import { envChecker } from "@Pick2Me/shared/utils";

export const isEnvDefined = () => {
  envChecker(process.env.PORT, "PORT");
  envChecker(process.env.GATEWAY_SHARED_SECRET, "GATEWAY_SHARED_SECRET");
  envChecker(process.env.REDIS_URL, "REDIS_URL");
};
