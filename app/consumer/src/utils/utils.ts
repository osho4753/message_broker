import { TelemetryStore } from '../types/types';
import Redis from 'ioredis';
import { REDIS_HOST, REDIS_PORT } from '../config/config';

const redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT });

export const saveTelemetryData = async (
  telemetry: TelemetryStore,
): Promise<void> => {
  const oneDay = 86_400;

  try {
    await redis.set(
      `telemetry:${telemetry.deviceId}`,
      JSON.stringify(telemetry),
      'EX',
      oneDay,
    );
  } catch (error) {
    console.error('Error saving telemetry data:', error);
  }
};

export async function getTelemetryData(
  startDate?: string,
  endDate?: string,
): Promise<TelemetryStore[]> {
  try {
    const keys: string[] = await redis.keys('telemetry:*');

    const telemetryData = await Promise.all(
      keys.map(async (key) => {
        const data = await redis.get(key);

        return data ? JSON.parse(data) : null;
      }),
    );

    return telemetryData.filter((telemetry) => {
      if (!telemetry) return false;

      const timestamp = new Date(telemetry.timestamp);

      const start = startDate ? new Date(startDate) : null;

      const end = endDate ? new Date(endDate) : null;

      return (!start || timestamp >= start) && (!end || timestamp <= end);
    });
  } catch (error) {
    console.error('Error getting telemetry data:', error);
    return [];
  }
}
