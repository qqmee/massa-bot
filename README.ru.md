# Massa паукан

🇺🇸 [English](./README.ru) | 🇷🇺 Русский

Исходники телеграм бота https://t.me/hekumatiarubot для [Massa](https://massa.net/)

- выдает свободные локации для установки ноды
- поиск нод по IP
- отправляет уведомления о продажах роллов

**Содержание**

- [Что под капотом](#что-под-капотом)
- [Команды](#команды)
- [Системные требования](#системные-требования)
- [Установка](#установка)
- [Установка (разработка)](#разработка)
- [Настройка](#настройка)
- [Зеркала](#зеркала)

## Что под капотом

- [NestJS](https://nestjs.com/) - Node.js фреймворк
- [grammY](https://github.com/grammyjs/grammY) - Telegram Bot фреймворк
- [Fluent](https://projectfluent.org/) - система локализации / синтаксис разметки
- [TypeORM](https://typeorm.io/) (MySQL) - ORM
- [Docker](https://www.docker.com/)

## Команды

| Команда    | Описание                       | Пример            |
| ---------- | ------------------------------ | ----------------- |
| /start     | Основное меню                  |                   |
| /help      | Список всех команд             |                   |
| /hosting   | Промокоды                      |                   |
| /add       | Добавить ноду                  | `/add abcdef tag` |
| /delete    | Удалить ноду                   | `/delete abcdef`  |
| /ip        | Поиск по маске IP              | `/ip 65`          |
| /community | Ссылки на сообщества           |                   |
| /free      | Страны без нод                 |                   |
| /company   | Хостинг компании с кол-вом нод |                   |
| /country   | Страны с нодами                |                   |
| /version   | По версиям                     |                   |
| /stats     | Статистика сети                |                   |
| /release   | Получить бинарники с GitHub    |                   |
| /mirror    | Зеркала                        |                   |
| /en        | 🇺🇸 English language            |                   |
| /ru        | 🇷🇺 Русский язык                |                   |
| /whoami    | ID для отладки                 |                   |

## Системные требования

| Hardware | Value                      |
| -------- | -------------------------- |
| CPU      | 2 core                     |
| RAM      | 1 Gb                       |
| Storage  | 1.2 Gb (images & database) |

## Установка

Нужен [Docker](https://docs.docker.com/desktop/install/linux-install/).
В корне репы лежит готовый `docker-compose.yml`. Чтобы запустить нужно выполнить команды ниже

```
curl -sSL https://raw.githubusercontent.com/qqmee/massa-telegram-bot/main/docker-compose.yml > docker-compose.yml
mkdir -p .data/hek-db/{lib,log}
```

Используется self-signed сертификат https://core.telegram.org/bots/self-signed
Сгенерируем его командой, но сначала замени `IP_адрес`

```
openssl req -newkey rsa:2048 -sha256 -nodes -keyout .data/private.key -x509 -days 3650 -out .data/public.pem -subj "/C=US/ST=New York/L=Brooklyn/O=Example Brooklyn Company/CN=IP_адрес"

# для private.key чтение не ок, но сегодня разрешаю
chmod 444 .data/{private.key,public.pem}
```

Запуск

```
# WARN: перед тем, как запускать - измени все переменные окружения на свои. Ниже инструкция - затем следующая команда
## docker compose up -d
```

## Настройка

Установки переменные редактируя файл `docker-compose.yml`

| Env            | Scope          | Пример                                              | Описание                                      |
| -------------- | -------------- | --------------------------------------------------- | --------------------------------------------- |
| MYSQL_HOST     | db,bot,cron    | massa                                               |                                               |
| MYSQL_PORT     | db,bot,cron    | 3306                                                |                                               |
| MYSQL_USER     | db,bot,cron    | massa                                               |                                               |
| MYSQL_PASSWORD | db,bot,cron    | bVrsy                                               |                                               |
| MYSQL_DATABASE | db,bot,cron    | massa                                               |                                               |
| REDIS_HOST     | redis,bot,cron | redis                                               |                                               |
| REDIS_PORT     | redis,bot,cron | 6379                                                |                                               |
| REDIS_PASSWORD | redis,bot,cron | guest                                               |                                               |
| MASSA_RPC      | bot            | https://buildnet.massa.net/api/v2,198.27.74.5:33035 | api endpoint, через запятую                   |
| GEOIP_RPC      | bot,cron       | http://127.0.0.1:3050                               | api endpoint                                  |
| BOTS           | bot,cron       | 1:PPrreevvee,32:DDMMeeDDVveEdd                      | ключи от [@BotFather](https://t.me/BotFather) |
| BOT_ADMINS     | bot,cron       | 1,2                                                 | для отправки о локах планировщика             |
| PORT           | bot            | 3000                                                | webhook port                                  |
| WEBHOOK_URL    | bot            | https://abcdef.loca.lt                              | webhook domain                                |

## Разработка

```
git clone https://github.com/qqmee/massa-bot
cd massa-bot

# сначала измени переменные .env файла на свои
cp .env.example .env

# запуск бд
## docker compose up -d db redis

# установка зависимостей
npm i

# при запуске будут созданы таблицы в бд (или дропнуты)
npm run dev

# необязательно: запуск планировщика задач
npm run dev::cron

# запуск https tunnel используя бесплатный сыр, чтобы не настраивать ssl сертификат (замени 'abcdef' на свой сабдомен)
npx localtunnel --port 3000 --subdomain abcdef # выдаст такой: https://abcdef.loca.lt
```

## Зеркала

[Тут](./static/mirrors.txt)
