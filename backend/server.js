import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { JSONPreset } from 'lowdb/node'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

const defaultData = {
  eventTypes: [
    {
      id: 'quick',
      name: 'Быстрая встреча',
      description: 'Короткая встреча на 15 минут для оперативных вопросов.',
      duration: 15,
    },
    {
      id: 'full',
      name: 'Полноценная встреча',
      description: 'Полноценная встреча на 30 минут для детального обсуждения.',
      duration: 30,
    },
  ],
  slots: [],
  events: [],
}

const db = await JSONPreset('db.json', defaultData)

// ── Event Types ──

app.get('/api/event-types', (_req, res) => {
  res.json(db.data.eventTypes)
})

app.post('/api/event-types', (req, res) => {
  const body = req.body
  const et = {
    id: body.id,
    name: body.name,
    description: body.description,
    duration: body.duration,
  }
  db.data.eventTypes.push(et)
  db.write()
  res.status(201).json(et)
})

app.put('/api/event-types/:id', (req, res) => {
  const idx = db.data.eventTypes.findIndex((e) => e.id === req.params.id)
  if (idx === -1) return res.status(404).json({ code: 404, message: 'Not found' })
  const body = req.body
  db.data.eventTypes[idx] = {
    id: req.params.id,
    name: body.name,
    description: body.description,
    duration: body.duration,
  }
  db.write()
  res.json(db.data.eventTypes[idx])
})

app.delete('/api/event-types/:id', (req, res) => {
  const idx = db.data.eventTypes.findIndex((e) => e.id === req.params.id)
  if (idx === -1) return res.status(404).json({ code: 404, message: 'Not found' })
  db.data.eventTypes.splice(idx, 1)
  db.write()
  res.status(204).end()
})

// ── Slots ──

app.get('/api/slots', (_req, res) => {
  res.json(db.data.slots)
})

app.post('/api/slots', (req, res) => {
  const body = req.body
  if (!body.startTime || !body.endTime) {
    return res.status(400).json({ code: 400, message: 'startTime and endTime required' })
  }
  const slot = {
    id: `slot-${Date.now()}`,
    startTime: body.startTime,
    endTime: body.endTime,
  }
  db.data.slots.push(slot)
  db.write()
  res.status(201).json(slot)
})

app.put('/api/slots/:id', (req, res) => {
  const idx = db.data.slots.findIndex((s) => s.id === req.params.id)
  if (idx === -1) return res.status(404).json({ code: 404, message: 'Not found' })
  const body = req.body
  db.data.slots[idx] = {
    id: req.params.id,
    startTime: body.startTime,
    endTime: body.endTime,
  }
  db.write()
  res.json(db.data.slots[idx])
})

app.delete('/api/slots/:id', (req, res) => {
  const idx = db.data.slots.findIndex((s) => s.id === req.params.id)
  if (idx === -1) return res.status(404).json({ code: 404, message: 'Not found' })
  db.data.slots.splice(idx, 1)
  db.write()
  res.status(204).end()
})

app.post('/api/slots/generate', (req, res) => {
  const { startDate, endDate } = req.body
  if (!startDate || !endDate) {
    return res.status(400).json({ code: 400, message: 'startDate and endDate required' })
  }
  const start = new Date(startDate)
  const end = new Date(endDate)
  const generated = []
  let idCounter = db.data.slots.length + 1
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) continue
    const iso = (h, m) => {
      const dt = new Date(d)
      dt.setHours(h, m, 0, 0)
      return dt.toISOString()
    }
    generated.push({ id: `slot-${idCounter++}`, startTime: iso(9, 0), endTime: iso(11, 0) })
    generated.push({ id: `slot-${idCounter++}`, startTime: iso(13, 0), endTime: iso(15, 0) })
    generated.push({ id: `slot-${idCounter++}`, startTime: iso(16, 0), endTime: iso(18, 0) })
  }
  db.data.slots.push(...generated)
  db.write()
  res.status(201).json(generated)
})

// ── Events ──

app.get('/api/events', (_req, res) => {
  res.json(db.data.events)
})

app.post('/api/events', (req, res) => {
  const body = req.body

  if (!body.startTime || !body.endTime || body.startTime >= body.endTime) {
    return res.status(400).json({ code: 400, message: 'Invalid startTime or endTime' })
  }

  // Найти слот, который вмещает событие
  const slot = db.data.slots.find(
    (s) => s.startTime <= body.startTime && s.endTime >= body.endTime,
  )
  if (!slot) {
    return res.status(400).json({ code: 400, message: 'No slot found for the given time range' })
  }

  // Проверить пересечения с другими событиями в этом слоте
  const overlapping = db.data.events.some(
    (e) => e.slotId === slot.id && e.startTime < body.endTime && e.endTime > body.startTime,
  )
  if (overlapping) {
    return res.status(409).json({ code: 409, message: 'Event overlaps with an existing booking in this slot' })
  }

  const ev = {
    id: `event-${Date.now()}`,
    slotId: slot.id,
    guestName: body.guestName,
    eventTypeId: body.eventTypeId,
    startTime: body.startTime,
    endTime: body.endTime,
    description: body.description ?? '',
  }

  // Получить длительность типа события
  const eventType = db.data.eventTypes.find((t) => t.id === body.eventTypeId)
  const minDurMs = eventType ? eventType.duration * 60_000 : 15 * 60_000

  const origStart = slot.startTime
  const origEnd = slot.endTime
  const beforeGap = new Date(body.startTime).getTime() - new Date(origStart).getTime()
  const afterGap = new Date(origEnd).getTime() - new Date(body.endTime).getTime()

  // Создать свободные слоты из остатков, если они достаточны для встречи
  if (beforeGap >= minDurMs) {
    const freeSlot = {
      id: `slot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      startTime: origStart,
      endTime: body.startTime,
    }
    db.data.slots.push(freeSlot)
  }
  if (afterGap >= minDurMs) {
    const freeSlot = {
      id: `slot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      startTime: body.endTime,
      endTime: origEnd,
    }
    db.data.slots.push(freeSlot)
  }

  // Сузить исходный слот до границ события
  slot.startTime = body.startTime
  slot.endTime = body.endTime

  db.data.events.push(ev)
  db.write()
  res.status(201).json(ev)
})

app.delete('/api/events/:id', (req, res) => {
  const idx = db.data.events.findIndex((e) => e.id === req.params.id)
  if (idx === -1) return res.status(404).json({ code: 404, message: 'Not found' })

  const removed = db.data.events[idx]
  db.data.events.splice(idx, 1)

  // Проверить, остались ли ещё события в этом слоте
  const slot = db.data.slots.find((s) => s.id === removed.slotId)
  if (slot) {
    const hasOtherEvents = db.data.events.some((e) => e.slotId === slot.id)
    if (!hasOtherEvents) {
      // Слот пуст — схлопнуть с соседними свободными слотами
      const beforeIdx = db.data.slots.findIndex(
        (s) => s.endTime === slot.startTime && !db.data.events.some((e) => e.slotId === s.id),
      )
      const afterIdx = db.data.slots.findIndex(
        (s) => s.startTime === slot.endTime && !db.data.events.some((e) => e.slotId === s.id),
      )

      let newStart = slot.startTime
      let newEnd = slot.endTime

      // Удаляем before (с конца, чтобы индексы не съехали)
      const toRemove = []
      if (afterIdx !== -1) {
        newEnd = db.data.slots[afterIdx].endTime
        toRemove.push(afterIdx)
      }
      if (beforeIdx !== -1) {
        newStart = db.data.slots[beforeIdx].startTime
        toRemove.push(beforeIdx)
      }

      // Сортируем индексы по убыванию для безопасного удаления
      toRemove.sort((a, b) => b - a)
      for (const i of toRemove) {
        db.data.slots.splice(i, 1)
      }

      slot.startTime = newStart
      slot.endTime = newEnd
    }
  }

  db.write()
  res.status(204).end()
})

// ── Static files (frontend SPA) ──

const distPath = path.join(__dirname, '../frontend/dist')
app.use(express.static(distPath))
app.get('/{*path}', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

// ── Start ──

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Booking API running on port ${PORT}`)
})
