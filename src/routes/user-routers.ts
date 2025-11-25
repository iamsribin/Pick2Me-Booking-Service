import { Router } from "express";
import { verifyGatewayJwt } from "@Pick2Me/shared/auth";
import { catchAsync } from "@Pick2Me/shared/utils";

const userRouter = Router();

//  All routes below require a valid admin gateway JWT
userRouter.use(verifyGatewayJwt(true, process.env.GATEWAY_SHARED_SECRET!));

export { userRouter };
