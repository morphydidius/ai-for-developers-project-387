# AGENTS.md — Booking Project

## Stack

- **Frontend:** Vue 3 (Composition API, `<script setup>`), Vite, TypeScript, Tailwind CSS v4, shadcn-vue (reka-ui)
- **Backend:** Express 5, lowdb (JSON-файл БД)
- **Testing:** Playwright
- **API proxy:** Vite dev server проксирует `/api` → `http://localhost:3001`

## Project structure

```
├── backend/
│   ├── server.js          # Express API (порт 3001)
│   ├── db.json            # lowdb база данных
│   ├── main.tsp           # TypeSpec описание API
│   └── tsp-output/        # Сгенерированная OpenAPI спецификация
└── frontend/
    ├── src/
    │   ├── api/client.ts          # Типизированный API клиент
    │   ├── types/api.ts           # Типы API моделей
    │   ├── router/index.ts        # Vue Router конфигурация
    │   ├── views/                 # Компоненты страниц
    │   ├── components/            # Переиспользуемые компоненты
    │   └── mocks/                 # Mock-данные (legacy)
    ├── e2e/                       # Playwright тесты
    └── playwright.config.ts
```

## Commands

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | frontend/ | Запуск Vite dev server (порт 5173) |
| `npm run build` | frontend/ | TypeScript проверка + Vite production сборка |
| `npm run test:e2e` | frontend/ | Запуск Playwright тестов (headless) |
| `npm run test:e2e:ui` | frontend/ | Запуск Playwright тестов с UI режимом |
| `node server.js` | backend/ | Запуск Express API server (порт 3001) |

## Паттерн API-клиента

Все API-вызовы проходят через `src/api/client.ts`:

```typescript
import { api } from '@/api/client'

// Получение данных
const types = await api.eventTypes.list()
const slots = await api.slots.list()
const events = await api.events.list()

// Мутация
await api.eventTypes.create({ id, name, description, duration })
await api.eventTypes.update(id, { name, description, duration })
await api.eventTypes.delete(id)

await api.slots.create({ startTime, endTime })
await api.slots.update(id, { startTime, endTime })
await api.slots.delete(id)
await api.slots.generate({ startDate, endDate })

await api.events.create({ slotId, guestName, eventTypeId, startTime, endTime, description })
await api.events.delete(id)
```

## Маршруты (Routes)

| Path | Name | Page |
|------|------|------|
| `/` | `event-types` | EventTypesPage |
| `/event/:eventTypeId` | `booking` | BookingPage |
| `/admin/bookings` | `admin-bookings` | AdminBookingsPage |
| `/admin/slots` | `admin-slots` | AdminSlotsPage |
| `/admin/event-types` | `admin-event-types` | AdminEventTypesPage |

## Соглашения (Conventions)

### Импорты
- Используйте `@/` алиас для импортов из src (например, `import { api } from '@/api/client'`)
- Импортируйте типы из `@/types/api`

### Асинхронное состояние
```typescript
const data = ref<DataType[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    data.value = await api.some.list()
  } catch {
    // игнорируем
  } finally {
    loading.value = false
  }
})
```

### Мутации (create/update/delete)
```typescript
const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true
  try {
    await api.some.create({ ... })
    data.value = await api.some.list()  // обновление
  } finally {
    submitting.value = false
  }
}
```

### Тестовые ID (data-testid)
Добавляйте `data-testid` атрибуты для Playwright селекторов:
- `data-testid="book-${eventType.id}"` — кнопки бронирования на карточках событий
- `data-testid="day-${iso}"` — кнопки дней календаря
- `data-testid="slot-${slot.id}"` — кнопки слотов
- `data-testid="booked-${slot.id}"` — подписи "занято"
- `data-testid="guest-name"` — поле ввода имени гостя в диалоге бронирования
- `data-testid="submit-booking"` — кнопка подтверждения бронирования

### Работа с датами
- Backend хранит даты как ISO-строки (`new Date().toISOString()`)
- Frontend отображает через `toLocaleTimeString('ru-RU', ...)`
- Склеивание даты и времени: `combineDateTime(date: Date, time: string): string`
- Извлечение локального времени из ISO: `isoToLocalTime(iso: string): string`

### Backend endpoints (auto-generated из TypeSpec)

Смотрите `backend/main.tsp` или `backend/tsp-output/openapi.yaml` для полной спецификации.

## Язык

- Всегда отвечай по-русски
