import { CronExpression } from '@nestjs/schedule';

export const MAIN_RELEASE_TAG = 'DEVN';
export const REGEXP_RELEASE = /^(TEST|DEVN)\.([\d]{1,3})\.([\d]{1,3})$/;

export const CRON_INTERVAL_RELEASE = CronExpression.EVERY_30_MINUTES;
export const CRON_INTERVAL_STUCK = CronExpression.EVERY_30_MINUTES;
export const CRON_INTERVAL_STAKERS = CronExpression.EVERY_30_MINUTES;
export const CRON_INTERVAL_NODES = CronExpression.EVERY_HOUR;
export const CRON_INTERVAL_GEOIP = CronExpression.EVERY_HOUR;

export const LOCKER = 'LOCKER';
