import express from 'express';
import { startConsumer } from './consumer';
import { getTelemetryData } from './utils/utils';
import { TelemetryStore } from './types/types';
import { PORT } from './config/config';

export const app = express();

app.get('/telemetry', async (req, res) => {
  const { start, end } = req.query;

  const telemetryData: TelemetryStore[] = await getTelemetryData(
    start as string,
    end as string,
  );

  res.json(telemetryData);
});

app.listen(PORT, () => {});

startConsumer();
