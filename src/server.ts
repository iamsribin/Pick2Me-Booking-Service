import "dotenv/config";
import app from "./app";
import { isEnvDefined } from "./utils/evenChecker";
import { createRedisService } from "@Pick2Me/shared/redis";
import { connectDB } from "@Pick2Me/shared/mongo";
import { EventConsumer } from "./events/consumer";

const startServer = async () => {
  try {
    isEnvDefined();

    connectDB(process.env.MONGO_URL!);

    createRedisService(process.env.REDIS_URL as string);

    EventConsumer.init();

    app.listen(process.env.PORT, () =>
      console.log(`Driver service running on port ${process.env.PORT}`)
    );
  } catch (err: unknown) {
    console.log(err);
  }
};

startServer();
