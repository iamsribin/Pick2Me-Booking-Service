import { envChecker } from '@Pick2Me/shared/utils';

export const isEnvDefined = () => {
  envChecker(process.env.PORT, 'PORT');
  envChecker(process.env.DRIVER_GRPC_URL, 'DRIVER_GRPC_URL');
  envChecker(process.env.PAYMENT_GRPC_URL, 'PAYMENT_GRPC_URL');
  envChecker(process.env.GATEWAY_SHARED_SECRET, 'GATEWAY_SHARED_SECRET');
  envChecker(process.env.REDIS_URL, 'REDIS_URL');
};
