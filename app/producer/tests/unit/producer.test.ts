import { generateTelemetryData } from '../../src/utils/utils';

describe('generateTelemetryData', () => {
  it('should return telemetry data with valid structure', () => {
    const data = generateTelemetryData();

    expect(data).toHaveProperty('deviceId');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('temperature');
    expect(data).toHaveProperty('humidity');
    expect(typeof data.deviceId).toBe('string');
    expect(typeof data.timestamp).toBe('string');
    expect(typeof data.temperature).toBe('number');
    expect(typeof data.humidity).toBe('number');
  });
});
