import { BookRideResponseDto } from '@/dto/booking.dto';
import { EXCHANGES, RabbitMQ, ROUTING_KEYS } from '@Pick2Me/shared/messaging';

const url = process.env.RABBIT_URL!;

export class EventProducer {
  static async publishRideRequest(rideData: BookRideResponseDto) {
    await RabbitMQ.connect({ url, serviceName: 'driver-service' });
    await RabbitMQ.setupExchange(EXCHANGES.DRIVER, 'topic');

    const notificationPayload = {
      data: rideData,
      type: ROUTING_KEYS.NOTIFY_DOCUMENT_EXPIRE,
    };

    await RabbitMQ.publish(
      EXCHANGES.BOOKING,
      ROUTING_KEYS.NOTIFY_BOOK_RIDE_DRIVER,
      notificationPayload
    );
    console.log(`[] 📤 Published  → ${notificationPayload}`);
  }
}
