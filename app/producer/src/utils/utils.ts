import { v4 as uuidv4 } from 'uuid';
import { TelemetryData } from '../types/types';

export const generateTelemetryData = (): TelemetryData => ({
  deviceId: uuidv4(),
  timestamp: new Date().toISOString(),
  temperature: parseFloat((20 + Math.random() * 10).toFixed(2)),
  humidity: parseFloat((30 + Math.random() * 30).toFixed(2)),
});
