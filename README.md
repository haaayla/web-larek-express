# Web-ларёк

Учебный проект: интернет-магазин «Web-ларёк». Фронтенд на React (папка `frontend`) и бэкенд на Express + TypeScript + MongoDB (папка `backend`). Проект состоит в реализации бэкенда.

## Что в репозитории

| Папка / файл | Назначение |
|---|---|
| `backend/` | Сервер на Express + TypeScript |
| `frontend/` | Фронтенд на React, нужен для проверки бэкенда |
| `.dump/` | Тестовые товары (`product.json`) и картинки к ним |
| `WebLarek.postman_collection.json` | Коллекция запросов для Postman |

## Технологии бэкенда

- TypeScript, Node.js и Express
- MongoDB и ODM Mongoose
- `celebrate` + `joi` — валидация входящих запросов
- `winston` + `express-winston` — логирование запросов и ошибок
- `@faker-js/faker` — генерация идентификатора заказа
- ESLint (Airbnb) — стиль кода

## Требования

- Node.js 22 (подходят также 20.19+ и 24+)
- npm
- MongoDB (проверено на версии 9.0; адрес по умолчанию `mongodb://127.0.0.1:27017`)

## Быстрый старт

**1. Запустите MongoDB.** Например, на macOS через Homebrew:

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services run mongodb-community
```

**2. Запустите бэкенд.** В новой вкладке терминала:

```bash
cd backend
npm ci
cp .env.example .env
npm run dev
```

Сервер стартует на порту из `.env` (по умолчанию `3000`) и подключается к базе по `DB_ADDRESS`.

**3. Добавьте товары.** База изначально пустая. Товары из файла `.dump/product.json` создаются запросами `POST /product` (в Postman: импортируйте `WebLarek.postman_collection.json`, запрос «Create new product»). Картинки уже лежат в `backend/src/public/images`.

**4. Запустите фронтенд.** В ещё одной вкладке терминала:

```bash
cd frontend
npm ci
cp .env.example .env
npm run dev
```

Откройте <http://localhost:5173>. В `frontend/.env` переменная `VITE_API_ORIGIN` должна указывать на бэкенд (`http://localhost:3000`).

## Команды бэкенда (папка `backend`)

| Команда | Что делает |
|---|---|
| `npm run dev` | Запуск с автоперезапуском при изменении файлов (`ts-node-dev`) |
| `npm run start` | Запуск без сборки (`ts-node`) |
| `npm run build` | Сборка TypeScript в папку `dist` |
| `npm run lint` | Проверка кода линтером |

## Переменные окружения бэкенда

Файл `backend/.env` создаётся копированием `backend/.env.example`. Все параметры приложения берутся только оттуда; при отсутствии `PORT` или `DB_ADDRESS` сервер не запустится.

| Переменная | Назначение |
|---|---|
| `PORT` | Порт сервера |
| `DB_ADDRESS` | Адрес базы MongoDB (имя переменной менять нельзя) |
| `UPLOAD_PATH`, `UPLOAD_PATH_TEMP`, `ORIGIN_ALLOW`, `AUTH_REFRESH_TOKEN_EXPIRY`, `AUTH_ACCESS_TOKEN_EXPIRY` | Зарезервированы для расширенной части проекта (загрузка файлов и авторизация) |

## API

| Метод и адрес | Описание | Успех | Ошибки |
|---|---|---|---|
| `GET /product` | Список всех товаров: `{ items, total }` | 200 | 500 |
| `POST /product` | Создание товара | 201, созданный товар | 400, 409, 500 |
| `POST /order` | Оформление заказа: `{ id, total }` | 200 | 400, 500 |
| любой другой адрес | — | — | 404 |

Ошибки возвращаются в формате `{ "message": "..." }`. Ошибки валидации, перехваченные `celebrate`, имеют его собственный формат (`statusCode`, `error`, `message`, `validation`).

**Товар** (`POST /product`):

```json
{
  "title": "Мамка-таймер",
  "image": { "fileName": "/images/Asterisk_2.png", "originalName": "Asterisk_2.png" },
  "category": "софт-скил",
  "description": "Будет стоять над душой и не давать прокрастинировать.",
  "price": null
}
```

`title` — от 2 до 30 символов, уникальный. `description` и `price` необязательные, `price` по умолчанию `null` (товар не продаётся).

**Заказ** (`POST /order`):

```json
{
  "payment": "card",
  "email": "admin@ya.ru",
  "phone": "+79999999999",
  "address": "Санкт-Петербург, Восстания 1",
  "total": 2200,
  "items": ["<_id товара>", "<_id товара>"]
}
```

`payment` — `card` или `online`. Все товары из `items` должны существовать и продаваться (`price` не `null`), а их суммарная цена — совпадать с `total`. Иначе ответ 400.

## Структура `backend/src`

| Путь | Назначение |
|---|---|
| `app.ts` | Точка входа: настройка Express, подключение к базе, запуск сервера |
| `config.ts` | Чтение параметров из `.env` |
| `constants.ts` | Общие константы (границы длины названия товара) |
| `models/` | Схема и модель товара |
| `controllers/` | Логика обработки запросов (товары, заказ) |
| `routes/` | Адреса и привязка к контроллерам |
| `middlewares/` | Валидация запросов, логгеры, централизованный обработчик ошибок |
| `errors/` | Классы ошибок: 400, 404, 409 |
| `public/` | Раздаваемые клиентам файлы (картинки товаров в `public/images`) |

## Логи

В папке, откуда запущен сервер (при запуске через `npm` это `backend`), создаются файлы в формате JSON: `request.log` (все запросы к API) и `error.log` (все ошибки, в том числе ошибка подключения к базе).
