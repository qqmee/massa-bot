import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { CronModule } from './cron.module';
import { Logger } from '@nestjs/common';

const logger = new Logger('CronApplication');

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);
process.on('uncaughtException', exitHandler);

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(CronModule);
  await app.init();
}

bootstrap().catch((error) => {
  logger.error(error, error.stack);
});

function exitHandler(error?: Error) {
  if (error instanceof Error) {
    logger.error(error, error.stack);
  }

  logger.log('Shutting down..');
  process.exit();
}
