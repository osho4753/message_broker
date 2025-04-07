import * as dotenv from 'dotenv';

export const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

export const QUEUE = process.env.QUEUE_NAME || 'default_queue';

export const RABBITMQ_URL =
  process.env.RABBITMQ_URL || 'amqp://user:password@localhost:5672';

export const PORT = process.env.PORT;

export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = Number(process.env.REDIS_PORT);
