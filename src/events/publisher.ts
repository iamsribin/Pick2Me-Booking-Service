import { BookRideResponseDto } from "@/dto/booking.dto";
import { EXCHANGES, RabbitMQ, ROUTING_KEYS } from "@Pick2Me/shared/messaging";

const url = process.env.RABBIT_URL!;

export class EventProducer {
  static async publishRideRequest(rideData: BookRideResponseDto) {
    await RabbitMQ.connect({ url, serviceName: "booking-service" });
    await RabbitMQ.setupExchange(EXCHANGES.BOOKING, "topic");

    const notificationPayload = {
      data: rideData,
      type: ROUTING_KEYS.NOTIFY_BOOK_RIDE_DRIVER,
    };

    await RabbitMQ.publish(
      EXCHANGES.BOOKING,
      ROUTING_KEYS.NOTIFY_BOOK_RIDE_DRIVER,
      notificationPayload,
    );
    console.log(`[] 📤 Published  → ${notificationPayload}`);
  }

  static async publishRideStart(rideData: any) {
    await RabbitMQ.connect({ url, serviceName: "booking-service" });
    await RabbitMQ.setupExchange(EXCHANGES.BOOKING, "topic");

    const notificationPayload = {
      data: rideData,
      type: ROUTING_KEYS.NOTIFY_RIDE_START,
    };

    await RabbitMQ.publish(
      EXCHANGES.BOOKING,
      ROUTING_KEYS.NOTIFY_RIDE_START,
      notificationPayload,
    );
    console.log(`[] 📤 Published  → ${notificationPayload}`);
  }

  static async publishRideCompleted(rideData: any) {
    await RabbitMQ.connect({ url, serviceName: "booking-service" });
    await RabbitMQ.setupExchange(EXCHANGES.BOOKING, "topic");

    const notificationPayload = {
      data: rideData,
      type: ROUTING_KEYS.RIDE_COMPLETED,
    };

    await RabbitMQ.publish(
      EXCHANGES.BOOKING,
      ROUTING_KEYS.RIDE_COMPLETED,
      notificationPayload,
    );
    console.log(`[] 📤 Published  → ${notificationPayload}`);
  }
}

export const eventProducer = new EventProducer();
