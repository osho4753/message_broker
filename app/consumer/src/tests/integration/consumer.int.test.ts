import amqp, { AmqpConnectionManager } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import * as dotenv from 'dotenv';
import { app } from '../../server';

import * as utils from '../../utils/utils';
import * as request from 'supertest';
import { TelemetryStore } from '../../types/types';

dotenv.config({ path: '.env.test' });
const TEST_QUEUE =
  process.env.QUEUE_NAME || 'amqp://user:password@localhost:5672';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'defaultQueueName';

jest.mock('../../utils/utils', () => ({
  getTelemetryData: jest.fn(),
}));

describe('Consumer', () => {
  const connection: AmqpConnectionManager = amqp.connect([RABBITMQ_URL]);

  const channel = connection.createChannel({
    setup: async (channel: Channel) => {
      await channel.assertQueue(TEST_QUEUE, { durable: true });
      await channel.consume(TEST_QUEUE, jest.fn());
    },
  });

  beforeAll(async () => {
    await channel.waitForConnect();
  });

  afterAll(async () => {
    await channel.close();

    await connection.close();
  });

  test('should connect to RabbitMQ and create a channel', async () => {
    expect(connection).toBeDefined();
    expect(channel).toBeDefined();
  });
});

describe('Telemetry API', () => {
  const mockData: TelemetryStore[] = [
    {
      deviceId: '1',
      timestamp: '2023-01-01T10:00:00Z',
      temperature: 22,
      humidity: 56,
    },
    {
      deviceId: '2',
      timestamp: '2023-01-02T10:00:00Z',
      temperature: 23,
      humidity: 46,
    },
    {
      deviceId: '3',
      timestamp: '2023-01-03T10:00:00Z',
      temperature: 24,
      humidity: 53,
    },
  ];

  beforeEach(() => {
    (utils.getTelemetryData as jest.Mock).mockImplementation(
      async (start, end) => {
        return mockData.filter((t: TelemetryStore) => {
          const date = new Date(t.timestamp);
          return (
            (!start || date >= new Date(start)) &&
            (!end || date <= new Date(end))
          );
        });
      },
    );
  });

  it('should return telemetry data', async () => {
    const res = await request.default(app).get('/telemetry');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
    expect(utils.getTelemetryData).toHaveBeenCalledTimes(1);
  });

  it('should return filtered telemetry data', async () => {
    const res = await request
      .default(app)
      .get('/telemetry?start=2023-01-02T00:00:00Z&end=2023-01-03T00:00:00Z');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].deviceId).toBe('2');
  });

  it('should return telemetry data filtered by start date', async () => {
    const res = await request
      .default(app)
      .get('/telemetry?start=2023-01-02T00:00:00Z');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].deviceId).toBe('2');
  });

  it('should return telemetry data filtered by end date', async () => {
    const res = await request
      .default(app)
      .get('/telemetry?end=2023-01-01T23:59:59Z');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].deviceId).toBe('1');
  });
});
