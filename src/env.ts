import * as fs from 'node:fs';
import * as path from 'node:path';
import { parseEnv, z, port } from 'znv';

import { TelegramBotConfiguration } from '@shared/telegram/telegram.interfaces';

const FALLBACK_LOCALE = 'en';

const BOT_MIRRORS = fs
  .readFileSync(__dirname + '/../static/mirrors.txt', 'utf8')
  .trim();

const BOT_COMMUNITIES = fs
  .readFileSync(__dirname + '/../static/communities.txt', 'utf8')
  .trim();

const LOCALES = fs
  .readdirSync(__dirname + '/../locales')
  .map((file) => path.parse(file).name);

const loadEnvironment = () => {
  return parseEnv(process.env, {
    MYSQL_HOST: z.string().default('db'),
    MYSQL_PORT: port().default(3306),
    MYSQL_DATABASE: z.string().default('massa'),
    MYSQL_USER: z.string().default('massa'),
    MYSQL_PASSWORD: z.string().min(16),
    REDIS_HOST: z.string().default('redis'),
    REDIS_PORT: z.number().default(6379),
    REDIS_PASSWORD: z.string().optional(),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    GEOIP_RPC: z.string().default('http://geoip:3050'),
    MASSA_RPC: z.string().transform((value) => parseRPC(value)),
    PORT: z.number().default(3000),
    BOTS: z.string().transform((value) => parseEnvBots(value)),
    BOT_ADMINS: z.string().transform((value) => parseEnvBotAdmins(value)),
    WEBHOOK_URL: z.string(),
    CRON_STAKERS: z.boolean().default(false),
  });
};

const env = loadEnvironment();

export const Environment = {
  ...env,
  FALLBACK_LOCALE,
  BOT_MIRRORS,
  BOT_COMMUNITIES,
  LOCALES,
  WORKDIR: process.cwd(),
  SSL_ENABLED: env.NODE_ENV === 'production' && [443, 8443].includes(env.PORT),
};

// export type Environment = ReturnType<typeof loadEnvironment>;

function parseEnvBots(value: string): TelegramBotConfiguration[] {
  return value.split(',').map((token) => {
    const id = token.split(':')[0];

    return {
      id,
      token,
    };
  });
}

function parseEnvBotAdmins(value: string): number[] {
  return value.split(',').map((id) => parseInt(id, 10));
}

function parseRPC(value: string) {
  const values = value.split(',').map((url) => {
    const schema = url.startsWith('http') ? '' : 'http://';
    return `${schema}${url}`;
  });

  return Array.from([...new Set(values)]);
}
