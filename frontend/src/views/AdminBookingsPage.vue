<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api/client'
import type { Slot, Event } from '@/types/api'

function isoToLocalTime(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'short',
  })
}

const slots = ref<Slot[]>([])
const events = ref<Event[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [sls, evs] = await Promise.all([
      api.slots.list(),
      api.events.list(),
    ])
    slots.value = sls
    events.value = evs
  } catch {
    // данные остаются пустыми
  } finally {
    loading.value = false
  }
})

const bookedSlotIds = computed(() => new Set(events.value.map((e) => e.slotId)))

function eventsForSlot(slotId: string): Event[] {
  return events.value.filter((e) => e.slotId === slotId)
}

interface DayGroup {
  date: Date
  label: string
  iso: string
  slots: Slot[]
}

const dayGroups = computed(() => {
  const map = new Map<string, Slot[]>()
  for (const s of slots.value) {
    const iso = s.startTime.slice(0, 10)
    if (!map.has(iso)) map.set(iso, [])
    map.get(iso)!.push(s)
  }
  const groups: DayGroup[] = []
  for (const [iso, daySlots] of map) {
    const d = new Date(daySlots[0].startTime)
    groups.push({
      date: d,
      label: formatDateLabel(d),
      iso,
      slots: daySlots,
    })
  }
  return groups.sort((a, b) => a.iso.localeCompare(b.iso))
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Бронирования</h1>

    <div v-if="loading" class="text-muted-foreground text-sm py-8 text-center">
      Загрузка...
    </div>

    <div v-else-if="dayGroups.length === 0" class="text-muted-foreground text-sm">
      Нет доступных слотов
    </div>

    <div v-else class="space-y-6">
      <div v-for="group in dayGroups" :key="group.iso">
        <h2 class="text-sm font-medium text-muted-foreground mb-2">{{ group.label }}</h2>
        <div class="space-y-2">
          <div
            v-for="slot in group.slots"
            :key="slot.id"
            :class="[
              'rounded-lg border px-4 py-3 text-sm transition-colors',
              bookedSlotIds.has(slot.id)
                ? 'bg-amber-50 border-amber-200'
                : 'bg-green-50 border-green-200',
            ]"
          >
            <div class="flex items-center gap-3">
              <span class="font-mono tabular-nums">
                {{ isoToLocalTime(slot.startTime) }} – {{ isoToLocalTime(slot.endTime) }}
              </span>
              <span
                :class="[
                  'text-xs font-medium px-2 py-0.5 rounded-full',
                  bookedSlotIds.has(slot.id)
                    ? 'bg-amber-200 text-amber-800'
                    : 'bg-green-200 text-green-800',
                ]"
              >
                {{ bookedSlotIds.has(slot.id) ? 'Занято' : 'Свободно' }}
              </span>
            </div>
            <div v-if="bookedSlotIds.has(slot.id)" class="mt-2 space-y-1">
              <div
                v-for="ev in eventsForSlot(slot.id)"
                :key="ev.id"
                class="text-xs text-muted-foreground pl-2 border-l-2 border-amber-300"
              >
                {{ isoToLocalTime(ev.startTime) }}–{{ isoToLocalTime(ev.endTime) }}
                <span class="font-medium">{{ ev.guestName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
