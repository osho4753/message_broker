import amqp, {
  ChannelWrapper,
  AmqpConnectionManager,
} from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { RABBITMQ_URL, QUEUE } from '../config/config';

const connection: AmqpConnectionManager = amqp.connect([RABBITMQ_URL]);

connection.on('connect', () => {
  console.log('RabbitMQ Connected');
});

connection.on('disconnect', (err) => {
  console.error('RabbitMQ Disconnected', err);
});

const channel: ChannelWrapper = connection.createChannel({
  setup: async (channel: Channel) => {
    await channel.assertQueue(QUEUE, { durable: true });
  },
});
export async function connectToRabbitMQ(): Promise<ChannelWrapper> {
  try {
    await channel.waitForConnect();

    return channel;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw new Error('Failed to connect to RabbitMQ');
  }
}
