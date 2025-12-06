import { container } from "@/config/inversify-config";
import { IBookingService } from "@/services/interfaces/i-booking-service";
import { TYPES } from "@/types/inversify-types";
import {
  EXCHANGES,
  QUEUES,
  RabbitMQ,
  ROUTING_KEYS,
} from "@Pick2Me/shared/messaging";

const bookingService = container.get<IBookingService>(TYPES.BookingService);
export class EventConsumer {
  static async init() {
    await RabbitMQ.connect({
      url: process.env.RABBIT_URL!,
      serviceName: "booking-service",
    });

    await RabbitMQ.setupExchange(EXCHANGES.NOTIFICATION, "topic");

    await RabbitMQ.bindQueueToExchanges(QUEUES.BOOKING_QUEUE, [
      {
        exchange: EXCHANGES.NOTIFICATION,
        routingKeys: ["realtime-booking.#"],
      },
    ]);

    await RabbitMQ.consume(QUEUES.BOOKING_QUEUE, async (msg) => {
      switch (msg.type) {
        case ROUTING_KEYS.RIDE_ACCEPTED:
            console.log("RIDE_ACCEPTED:",msg.data);
            bookingService.rideAccept(msg.data);
          break;

        case ROUTING_KEYS.CANCEL_RIDE:
          bookingService.cancelRide(msg._id);
          break;
        default:
          console.warn("Unknown message:", msg);
      }
    });
  }
}
