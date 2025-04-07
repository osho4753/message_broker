import amqp, {
  AmqpConnectionManager,
  ChannelWrapper,
  Channel,
} from 'amqp-connection-manager';
import { sendTelemetryData } from '../../src/producer';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
const TEST_QUEUE = process.env.QUEUE_NAME || 'testQueue';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'testQueue';

describe('RabbitMQ Producer', () => {
  const connection: AmqpConnectionManager = amqp.connect([RABBITMQ_URL]);

  const channel: ChannelWrapper = connection.createChannel({
    setup: async (channel: Channel) => {
      await channel.assertQueue(TEST_QUEUE, { durable: true });
    },
  });

  beforeAll(async () => {
    await channel.waitForConnect();
  }, 10_000);

  afterAll(async () => {
    await connection.close();

    await channel.close();
  }, 10_000);

  test('should connect to RabbitMQ', async () => {
    expect(channel).toBeDefined();
  });

  test('should send a message to the queue', async () => {
    const message = {
      deviceId: 'test-device',
      timestamp: '2021-01-01T00:00:00.000Z',
      temperature: 24.5,
      humidity: 45.3,
    };

    await sendTelemetryData(channel, JSON.stringify(message));

    const msg = await new Promise<string>((resolve, reject) => {
      channel.consume(
        TEST_QUEUE,
        (message) => {
          if (message) {
            resolve(message.content.toString());
            channel.ack(message);
          } else {
            reject(new Error('No message received'));
          }
        },
        { noAck: false },
      );
    });

    expect(msg).toBe(JSON.stringify(message));
  });
});
