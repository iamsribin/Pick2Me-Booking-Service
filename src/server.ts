import "dotenv/config";
import app from "./app";
import { isEnvDefined } from "./utils/evenChecker";
import { createRedisService } from "@Pick2Me/shared/redis";
import { connectDB } from "@Pick2Me/shared/mongo";
import "./jobs/worker";

// server
const startServer = async () => {
  try {
    // check all env are defined
    isEnvDefined();

    // connect to db
    connectDB(process.env.MONGO_URL!);

    //creating redis server
    createRedisService(process.env.REDIS_URL as string);

    //start rabbit consumer
    // consumer.start()

    //listen to port
    app.listen(process.env.PORT, () =>
      console.log(`Driver service running on port ${process.env.PORT}`)
    );
  } catch (err: unknown) {
    console.log(err);
  }
};

startServer();
