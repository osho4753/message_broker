import { Redis as RedisClient } from 'ioredis';
import Redis from 'ioredis';

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      set: jest.fn().mockResolvedValue('OK'),
      get: jest.fn().mockResolvedValue(
        JSON.stringify({
          deviceId: 'test-device',
          timestamp: '2025-03-25T12:00:00.000Z',
          temperature: 25.5,
          humidity: 45.0,
        }),
      ),
    };
  });
});

describe('Redis Operations', () => {
  let redisInstance: RedisClient;

  beforeAll(() => {
    redisInstance = new Redis();
  });

  it('should mock redis set method', async () => {
    const result = await redisInstance.set('key', 'value');
    expect(result).toBe('OK');
  });

  it('should mock redis get method', async () => {
    const result = await redisInstance.get('key');
    expect(result).toBe(
      JSON.stringify({
        deviceId: 'test-device',
        timestamp: '2025-03-25T12:00:00.000Z',
        temperature: 25.5,
        humidity: 45.0,
      }),
    );
  });
});
