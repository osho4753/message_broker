import { connectToRabbitMQ } from './rabbitConf/rabbit';
import { generateTelemetryData } from './utils/utils';
import { ChannelWrapper } from 'amqp-connection-manager';
import { QUEUE } from './config/config';

export async function sendTelemetryData(
  channel: ChannelWrapper,
  message: string = JSON.stringify(generateTelemetryData()),
): Promise<void> {
  try {
    channel.sendToQueue(QUEUE, Buffer.from(message), { persistent: true });
  } catch (error) {
    console.error('Error sending telemetry:', error);
  }
}

async function main() {
  const channel = await connectToRabbitMQ();

  if (channel) {
    setInterval(() => sendTelemetryData(channel), 10_000);
  } else {
    console.error('Failed to connect to RabbitMQ');
  }
}

main();
