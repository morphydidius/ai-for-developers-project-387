# AGENTS.md — Booking Project

## Stack

- **Frontend:** Vue 3 (Composition API, `<script setup>`), Vite, TypeScript, Tailwind CSS v4, shadcn-vue (reka-ui)
- **Backend:** Express 5, lowdb (JSON file DB)
- **Testing:** Playwright
- **API proxy:** Vite dev server proxies `/api` → `http://localhost:3001`

## Project structure

```
├── backend/
│   ├── server.js          # Express API (port 3001)
│   ├── db.json            # lowdb database
│   ├── main.tsp           # TypeSpec API definition
│   └── tsp-output/        # Generated OpenAPI spec
└── frontend/
    ├── src/
    │   ├── api/client.ts          # Typed API client
    │   ├── types/api.ts           # API model types
    │   ├── router/index.ts        # Vue Router config
    │   ├── views/                 # Page components
    │   ├── components/            # Reusable components
    │   └── mocks/                 # Mock data (legacy)
    ├── e2e/                       # Playwright tests
    └── playwright.config.ts
```

## Commands

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | frontend/ | Start Vite dev server (port 5173) |
| `npm run build` | frontend/ | TypeScript check + Vite production build |
| `npm run test:e2e` | frontend/ | Run Playwright tests (headless) |
| `npm run test:e2e:ui` | frontend/ | Run Playwright tests with UI mode |
| `node server.js` | backend/ | Start Express API server (port 3001) |

## API client pattern

All API calls go through `src/api/client.ts`:

```typescript
import { api } from '@/api/client'

// Fetch
const types = await api.eventTypes.list()
const slots = await api.slots.list()
const events = await api.events.list()

// Mutate
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

## Routes

| Path | Name | Page |
|------|------|------|
| `/` | `event-types` | EventTypesPage |
| `/event/:eventTypeId` | `booking` | BookingPage |
| `/admin/bookings` | `admin-bookings` | AdminBookingsPage |
| `/admin/slots` | `admin-slots` | AdminSlotsPage |
| `/admin/event-types` | `admin-event-types` | AdminEventTypesPage |

## Conventions

### Imports
- Use `@/` path alias for src imports (e.g. `import { api } from '@/api/client'`)
- Import types from `@/types/api`

### Async state pattern
```typescript
const data = ref<DataType[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    data.value = await api.some.list()
  } catch {
    // handle silently
  } finally {
    loading.value = false
  }
})
```

### Mutations (create/update/delete)
```typescript
const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true
  try {
    await api.some.create({ ... })
    data.value = await api.some.list()  // refresh
  } finally {
    submitting.value = false
  }
}
```

### Test IDs
Add `data-testid` attributes for Playwright selectors:
- `data-testid="book-${eventType.id}"` — booking buttons on event cards
- `data-testid="day-${iso}"` — calendar day buttons
- `data-testid="slot-${slot.id}"` — slot buttons
- `data-testid="booked-${slot.id}"` — "занято" labels
- `data-testid="guest-name"` — guest name input in booking dialog
- `data-testid="submit-booking"` — submit booking button

### Date handling
- Backend stores dates as ISO strings (`new Date().toISOString()`)
- Frontend displays using `toLocaleTimeString('ru-RU', ...)`
- Combine date + time: `combineDateTime(date: Date, time: string): string`
- Extract local time from ISO: `isoToLocalTime(iso: string): string`

### Backend endpoints (auto-generated from TypeSpec)

See `backend/main.tsp` or `backend/tsp-output/openapi.yaml` for full spec.
