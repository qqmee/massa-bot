# Massa Spider Bot

🇺🇸 English | 🇷🇺 [Русский](./README.ru.md)

> Sources of Telegram bot https://t.me/hekumatiarubot for [Massa Blockchain](https://massa.net/)

**Table of contents**

- [Under the hood](#under-the-hood)
- [Commands](#commands)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Installation (development)](#installation-development)
- [Configuration](#configuration-through-environment-variables)
- [Mirrors](#mirrors)

## Under the hood

- [NestJS](https://nestjs.com/) - Node.js framework
- [grammY](https://github.com/grammyjs/grammY) - Telegram Bot Framework
- [Fluent](https://projectfluent.org/) - Localization system
- [TypeORM](https://typeorm.io/) (MySQL) - ORM
- [Docker](https://www.docker.com/)

## Commands

| Command    | Description                     | Example           |
| ---------- | ------------------------------- | ----------------- |
| /start     | Main Menu                       |                   |
| /help      | List all available commands     |                   |
| /hosting   | Hosting promocodes              |                   |
| /add       | Add your node                   | `/add abcdef tag` |
| /delete    | Delete your node                | `/delete abcdef`  |
| /ip        | Search by IP                    | `/ip 65`          |
| /community | Community links                 |                   |
| /free      | Countries without nodes         |                   |
| /company   | Companies with node populations |                   |
| /country   | Countries with node population  |                   |
| /version   | Version with node population    |                   |
| /stats     | Stakers, cycle, version         |                   |
| /release   | Grab release Massa from GitHub  |                   |
| /mirror    | Telegram bot mirror links       |                   |
| /en        | 🇺🇸 English language             |                   |
| /ru        | 🇷🇺 Русский язык                 |                   |
| /whoami    | Your id                         |                   |

## System Requirements

Minimal server requirements

| Hardware | Value                      |
| -------- | -------------------------- |
| CPU      | 2 core                     |
| RAM      | 1 Gb                       |
| Storage  | 1.2 Gb (images & database) |

## Installation

Requires [Docker](https://docs.docker.com/desktop/install/linux-install/).
The main folder of this repository contains a functional docker-compose.yml file. Run the application using it as shown below:

```
curl -sSL https://raw.githubusercontent.com/qqmee/massa-telegram-bot/main/docker-compose.yml > docker-compose.yml
mkdir -p .data/hek-db/{lib,log}

# WARN: edit your env variables (goto configuration) before command below
## docker compose up -d
```

## Installation (development)

```
git clone https://github.com
cd massa-bot

# WARN: edit your env variables (goto configuration) before command below
# Launch database
## docker compose up -d db redis

# install deps
npm i

# run webhook listener
npm run dev &

# optional: launch cron tasks
npm run dev::cron

# launch https tunnel for webhook (replace 'abcdef' with your subdomain)
npx localtunnel --port 3000 --subdomain abcdef # aka https://abcdef.loca.lt
```

## Configuration (through Environment Variables)

Generate [self-signed](https://core.telegram.org/bots/self-signed) certificates &

Set environment variables in `docker-compose.yml`

| Env            | Scope          | Example                                             | Description                                          |
| -------------- | -------------- | --------------------------------------------------- | ---------------------------------------------------- |
| MYSQL_HOST     | db,bot,cron    | massa                                               |                                                      |
| MYSQL_PORT     | db,bot,cron    | 3306                                                |                                                      |
| MYSQL_USER     | db,bot,cron    | massa                                               |                                                      |
| MYSQL_PASSWORD | db,bot,cron    | bVrsy                                               |                                                      |
| MYSQL_DATABASE | db,bot,cron    | massa                                               |                                                      |
| REDIS_HOST     | redis,bot,cron | redis                                               |                                                      |
| REDIS_PORT     | redis,bot,cron | 6379                                                |                                                      |
| REDIS_PASSWORD | redis,bot,cron | guest                                               |                                                      |
| MASSA_RPC      | bot            | https://buildnet.massa.net/api/v2,198.27.74.5:33035 | api endpoint, comma separated                        |
| GEOIP_RPC      | bot,cron       | http://127.0.0.1:3050                               | api endpoint                                         |
| BOTS           | bot,cron       | 1:PPrreevvee,32:DDMMeeDDVveEdd                      | keys from [@BotFather](https://t.me/BotFather)       |
| BOT_ADMINS     | bot,cron       | 1,2                                                 | admin id for cronjob notifications (/whoami command) |
| PORT           | bot            | 3000                                                | webhook port                                         |
| WEBHOOK_URL    | bot            | https://abcdef.loca.lt                              | webhook domain                                       |

## Mirrors

[Here](./data/mirrors.txt)
