# Backend Developer Programming Assignment

## Overview

This project consists of two microservices: a **Simulated IoT Device** (Producer) and a **Consumer**, communicating over RabbitMQ. The services are built using **TypeScript** and run locally via **Docker Compose**.

## Requirements

### Simulated IoT Device (Producer)

- Producer sending telemetry data at regular intervals (every 10 seconds).
- Generates and sends payloads containing:
  - `deviceId` (UUID)
  - `timestamp` (current time)
  - `temperature` (random number within 20-30°C)
  - `humidity` (random number within 30-60%)
- Sends telemetry data to a RabbitMQ queue.

### Consumer Service

- Listens to the RabbitMQ queue and processes telemetry payloads.
  - Stores telemetry data in Redis for quick retrieval.
  - Exposes a REST API with the following endpoint:
  - `GET /telemetry`: Returns stored telemetry data with optional date range filtering.

Docker Compose:

Configures RabbitMQ, Redis, and both services for a local setup.

### Running the Services

1. Start services using Docker Compose:
   ```sh
   docker-compose up --build
   ```
2. The services will be accessible at:
   - RabbitMQ Management UI: `http://localhost:15672` (default user/pass: guest/guest)
   - Consumer API: `http://localhost:3000/telemetry`

### Running Tests

To execute unit tests, run:

```sh
npm run test:unit
```

To execute integration tests, run:

1. At first prepare test containers

```sh
docker-compose -f docker-compose.test.yml up
```

2.  Run integration tests after all container are up

```sh
npm run test:int
```

3. You can run all tests by

```sh
npm run test
```

## API Documentation

### `GET /telemetry`

#### Request Parameters

- `start` (optional, ISO string)
- `end` (optional, ISO string)

#### Example Request

- GET http://localhost:3000/telemetry?start=2025-03-25T00:00:00.000Z&end=2025-03-26T23:59:59.999Z

#### Example Response

```json
[
  {
    "deviceId": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2025-03-26T12:00:00.000Z",
    "temperature": 25.3,
    "humidity": 45.2
  }
]
```
