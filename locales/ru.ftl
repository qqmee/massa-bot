action-menu = 🔝 Меню
action-back = ◀️ Назад
action-try-later = Попробуй позже
action-saved = Сохранено

locale = Язык
locale-ru = 🇷🇺 Русский
locale-en = 🇺🇸 English
locale-ru-selected = 🇷🇺 выбран русский язык
locale-en-selected = English! Do you speak it?

root = Меню

ip-invalid = Адрес неправильный, отправь правильный. Пример: `/ip 65.10`
ip-not-found = Хорошие новости, ты один.
ip-more = И еще { $more }

stats = Статистика
stats-no-data = Нет данных или эпизод завершен
stats-network = Статус сети
stats-network-detail =
  Скорость
  => { $throughput_tx } tx/s
  => { $throughput_block } b/s

  { $period } *Период*
  { $cycle } *Цикл*
  { $rolls } *Роллы*
  { $stakers } *Стейкеры*
  { $cliques } *Форки*
stats-company = Хостеры
stats-country = Страны
stats-version = Версии

display-node-mode = Режим отображения
display-mode-detail =
  Выберите режим отображения уведомлений (сейчас __{ $current }__).
  Добавить тег можно командой `/add A12ZAK my-node`

  {"*"}Тег*
  ❗️ my-node
  Роллы (candidate / final): 0 / 0
  {"..."}

  {"*"}Адрес*
  ❗️ A12ZAKMICMSIi2iMCUTJSSJSJSJSJJSJSJS
  {"..."}
display-mode-address = Адрес
display-mode-tag = Тег

notifications = Уведомления
notifications-rolls = Роллы
notifications-github = Новый релиз на GitHub

help = Помощь
help-detail-main = __Меню__
help-detail-node = __Нода__
help-detail-stats = __Информация о сети__
help-detail-extra = __Дополнительно__
help-detail =
  Машина от сообщества, поддержка - @hcligroup
  Бот может работать в каналах.

community = Сообщества
community-detail =
  __Официальные__
  Сайт: https://massa.net
  Брендбук: https://massa.net/press
  Обозреватель: https://massa.net/testnet
  Telegram: @massanetwork
  Канал с новостями: @massa\_latest\_news
  Discord: https://discord.gg/massa
  Medium: https://massalabs.medium.com
  Twitter: https://twitter.com/massalabs
  GitHub: https://github.com/massalabs/massa
  LinkedIn: https://www.linkedin.com/company/massa-labs/
  Technical paper: https://arxiv.org/pdf/1803.09029

  __Боты__
  @MassaHelperBot - мониторинг ноды, статистика по странам
  @paramassa\_bot - небольшая wiki про проект

  __Неофициальные сообщества__
  { $unofficial }

address-invalid =
  Невозможно разобрать адрес. Убедить в правильности ввода команды, пример:
  `/add AU1EQeYwEWzixmLY2MLbSdp4QsWTzYTeN3XqH2t9yqrjBeXN3Mug natasha`

  natasha - это тег для удобства, можно не указывать. Выключается в /mode

address-exists = Адрес уже добавлен
address-not-deleted = Не удален. Проверь формат `/delete AEZAKMI`
address-deleted = Адрес удален
address-not-found =
  Нет сохраненных адресов, отправь адрес.
  Пример команды:

  `/add AU1EQeYwEWzixmLY2MLbSdp4QsWTzYTeN3XqH2t9yqrjBeXN3Mug natasha`
address-no-data = ❗️{ $address } Не удалось получить информацию с ноды RPC
address-info =
  { $status ->
  [fine] {"✅ "}
  *[other] {"❗️ "}
}{ $address }
  Роллы (final / candidate): { $rolls_final} / { $rolls_candidate }
  Баланс (final / candidate): { $balance_final} / { $balance_candidate }
  __Статистика последних циклов__
  { $cycles }
address-info-cycle = { NUMBER($nok) ->
  [0] {""}
  *[other] {"❗️ "}
 }{ $cycle } (произведено / пропущено): { $ok } / { $nok }

release = Последний релиз GitHub
release-changelog = Изменения
release-detail =
  __{ $name }__ // { $date }
  { $url }

  {"*"}Бинарники*
  { $assets }

release-detail-changelog =
  {"*"}Изменения*
  { $changelog }

release-detail-asset =
  { $name } \- { $size }
  { $url }

cronjob-stuck =
  __{ $job }__ // { $started }
  Time: { $age } of { $limit }

stats-free = Страны без нод
stats-free-ads = А еще тут есть /hosting промокоды и VPN сервисы
stats-free-hosting = Хостинг

hosting = 🎁 Хостинг промокоды
ads-hosting =
  __Провайдеры__ \(•ᴗ•,, \)

  🇷🇺 Принимающие карты МИР
  { $mir }

  ₿ Оплата криптой
  { $crypto }

  🕵️ __VPN__
  { $vpn }

mirror = Зеркало
mirror-detail =
  Бота можно добавить в группу или использовать зеркало:

  { $mirror }

command-my = Показать информацию о нодах
command-start = Меню
command-help = Список всех доступных команд
command-hosting = Хостинг промокоды
command-add = Добавить ноду, пример: /add abcdef
command-delete = Удалить ноду, пример: /delete abcdef
command-ip = Поиск по IP, пример: /ip 65.10
command-community = Сообщество
command-free = Страны без нод
command-country = Список стран с нодами
command-company = Список компаний с нодами
command-version = Список версий с нодами
command-stats = Информация о сети
command-ru = Русский язык
command-en = English language
command-mirror = Зеркала
command-release = Получить последний релиз Massa
command-locale = Изменить язык
command-mode = Изменить режим отображения адресов
command-admin = Админ меню

exception-unknown = Внутренняя ошибка сервера. Попробуй еще раз
exception-gateway-unavailable = Сервис `{ $gateway }` недоступен.
exception-rpc-unavailable = RPC недоступен. Попробуй позже
exception-rpc-timeout = Превышено время ожидания ответа от RPC. Попробуй еще раз
exception-access-denied = You are not admin 😡
