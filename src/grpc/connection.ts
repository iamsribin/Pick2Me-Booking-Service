import { userProto } from '@Pick2Me/shared/protos';
import * as grpc from '@grpc/grpc-js';
console.log("process.env.USER_GRPC_URL",process.env.USER_GRPC_URL);

const userClient = new (userProto as any).UserService(
  process.env.USER_GRPC_URL,
  grpc.credentials.createInsecure()
);

export { userClient };
