import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "@Pick2Me/shared/errors";
import { adminRouter } from "./routes/admin-roures";
import { publicRouter } from "./routes/public-routers";
import { userRouter } from "./routes/user-routers";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", publicRouter);
app.use("/", userRouter);
app.use("/admin", adminRouter);

app.use(errorHandler);

export default app;
