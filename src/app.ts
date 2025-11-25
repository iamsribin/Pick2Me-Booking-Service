import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "@Pick2Me/shared/errors";
import { adminRouter } from "./routes/admin-roures";
import { userRouter } from "./routes/user-routers";

// create app
const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/", userRouter);
app.use("/admin", adminRouter);

// // error handler
app.use(errorHandler);

// export app
export default app;
