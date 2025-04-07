import amqp, {
  ChannelWrapper,
  AmqpConnectionManager,
} from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { TelemetryStore } from './types/types';
import { saveTelemetryData } from './utils/utils';
import { RABBITMQ_URL, QUEUE } from './config/config';

const connection: AmqpConnectionManager = amqp.connect([RABBITMQ_URL]);

connection.on('connect', () => {
  console.log('RabbitMQ Connected');
});

connection.on('disconnect', (err) => {
  console.error('RabbitMQ Disconnected', err);
});

const channel: ChannelWrapper = connection.createChannel({
  setup: async (channel: Channel) => {
    try {
      await channel.assertQueue(QUEUE, { durable: true });

      await channel.consume(QUEUE, (msg) => {
        if (msg) {
          try {
            const telemetry: TelemetryStore = JSON.parse(
              msg.content.toString(),
            );

            saveTelemetryData(telemetry);

            channel.ack(msg);
          } catch (parseError) {
            console.error('Error parsing message:', parseError);

            channel.nack(msg);
          }
        }
      });
    } catch (error) {
      console.error('Error in queue setup:', error);
    }
  },
});

export const startConsumer = async (): Promise<void> => {
  try {
    await channel.waitForConnect();
  } catch (error) {
    console.error('Error in consumer:', error);
  }
};
