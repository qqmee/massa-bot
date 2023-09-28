import 'dotenv/config';
import fs from 'node:fs';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

import { Environment } from '@env';
import { BotModule } from './bot.module';
import { Logger } from '@nestjs/common';

const logger = new Logger('BotApplication');

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);
process.on('uncaughtException', exitHandler);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    BotModule,
    // remember src/shared/telegram/services/telegram.service.ts webhookCallback:express
    new ExpressAdapter(),
    [443, 8443].includes(Environment.PORT)
      ? {
          httpsOptions: {
            cert: fs.readFileSync(`${Environment.WORKDIR}/public.pem`),
            key: fs.readFileSync(`${Environment.WORKDIR}/private.key`),
          },
        }
      : {},
  );

  await app.listen(Environment.PORT, '0.0.0.0');
}

bootstrap().catch((err) => {
  logger.error(err, err.stack);
});

function exitHandler(error?: Error) {
  if (error instanceof Error) {
    logger.error(error, error.stack);
  }

  logger.log('Shutting down..');
  process.exit();
}