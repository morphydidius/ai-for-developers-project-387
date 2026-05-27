<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CalendarGrid from '@/components/CalendarGrid.vue'
import { api } from '@/api/client'
import type { EventType, Slot, Event } from '@/types/api'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const route = useRoute()
const router = useRouter()

const eventTypeId = computed(() => route.params.eventTypeId as string)

const selectedType = computed({
  get: () => eventTypeId.value,
  set: (val: unknown) => {
    if (typeof val === 'string') router.push(`/event/${val}`)
  },
})

const eventTypes = ref<EventType[]>([])
const slots = ref<Slot[]>([])
const events = ref<Event[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const [ets, sls, evs] = await Promise.all([
      api.eventTypes.list(),
      api.slots.list(),
      api.events.list(),
    ])
    eventTypes.value = ets
    slots.value = sls
    events.value = evs
  } catch {
    error.value = 'Не удалось загрузить данные'
  } finally {
    loading.value = false
  }
})

const selectedDay = ref<Date | null>(new Date())

function localDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function isoToLocalTime(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function combineDateTime(date: Date, time: string): string {
  const [h, m] = time.split(':').map(Number)
  const d = new Date(date)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'short',
  })
}

const bookedSlotIds = computed(() => new Set(events.value.map((e) => e.slotId)))

function eventsForSlot(slotId: string): Event[] {
  return events.value.filter((e) => e.slotId === slotId)
}

const slotsForDay = computed(() => {
  if (!selectedDay.value) return []
  const day = localDateStr(selectedDay.value)
  return slots.value.filter((s) => s.startTime.slice(0, 10) === day)
})

// ── Dialog state ──

const dialogOpen = ref(false)
const selectedSlotId = ref<string | null>(null)

const selectedSlot = computed(() =>
  slots.value.find((s) => s.id === selectedSlotId.value) ?? null,
)

const guestName = ref('')
const customTime = ref('')
const submitting = ref(false)

const currentEventType = computed(() =>
  eventTypes.value.find((t) => t.id === eventTypeId.value) ?? null,
)

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + mins
  const nh = Math.floor(total / 60)
  const nm = total % 60
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`
}

function timeGt(a: string, b: string): boolean {
  return a > b
}

const timeValidation = computed(() => {
  if (!selectedSlot.value || !currentEventType.value || !customTime.value) {
    return { valid: true, message: '' }
  }
  const slotStart = isoToLocalTime(selectedSlot.value.startTime)
  const slotEnd = isoToLocalTime(selectedSlot.value.endTime)
  const computedEnd = addMinutes(customTime.value, currentEventType.value.duration)

  if (timeGt(slotStart, customTime.value)) {
    return {
      valid: false,
      message: `Время начала (${customTime.value}) раньше начала слота (${slotStart})`,
    }
  }
  if (timeGt(computedEnd, slotEnd)) {
    return {
      valid: false,
      message: `Встреча закончится в ${computedEnd}, что выходит за пределы слота (до ${slotEnd})`,
    }
  }
  return { valid: true, message: '' }
})

function openBooking(slotId: string) {
  selectedSlotId.value = slotId
  const slot = slots.value.find((s) => s.id === slotId)
  if (slot) {
    customTime.value = isoToLocalTime(slot.startTime)
  }
  guestName.value = ''
  dialogOpen.value = true
}

async function submitBooking() {
  if (!selectedSlot.value || !currentEventType.value || !guestName.value) return

  submitting.value = true
  const startTime = combineDateTime(selectedDay.value!, customTime.value)
  const endTime = combineDateTime(selectedDay.value!, addMinutes(customTime.value, currentEventType.value.duration))

  try {
    await api.events.create({
      slotId: selectedSlot.value.id,
      guestName: guestName.value,
      eventTypeId: eventTypeId.value,
      startTime,
      endTime,
      description: '',
    })
    dialogOpen.value = false
    guestName.value = ''
    const [sls, evs] = await Promise.all([
      api.slots.list(),
      api.events.list(),
    ])
    slots.value = sls
    events.value = evs
  } catch {
    error.value = 'Ошибка при создании бронирования'
  } finally {
    submitting.value = false
  }
}

function timeMin() {
  return selectedSlot.value ? isoToLocalTime(selectedSlot.value.startTime) : ''
}

function timeMax() {
  return selectedSlot.value ? isoToLocalTime(selectedSlot.value.endTime) : ''
}
</script>

<template>
  <div class="py-8 px-4">
    <!-- Loading state -->
    <div v-if="loading" class="text-center text-sm text-muted-foreground py-12">
      Загрузка...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center text-sm text-destructive py-12">
      {{ error }}
    </div>

    <template v-else>
    <!-- Event type selector -->
    <div class="max-w-sm mb-8">
      <Label class="mb-1.5 block">Тип встречи</Label>
      <Select :model-value="selectedType" @update:model-value="selectedType = $event as string">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Выберите тип" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="et in eventTypes"
            :key="et.id"
            :value="et.id"
          >
            {{ et.name }} ({{ et.duration }} мин)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div class="grid md:grid-cols-2 gap-8 items-start">
      <!-- Calendar -->
      <div>
        <CalendarGrid
          :slots="slots"
          v-model="selectedDay"
        />
      </div>

      <!-- Slot list -->
      <div v-if="selectedDay">
        <p class="text-sm text-muted-foreground mb-3">
          Слоты на {{ formatDateLabel(selectedDay) }}
        </p>
      <div v-if="slotsForDay.length === 0" class="text-sm text-muted-foreground">
        Нет доступных слотов
      </div>
      <div v-else class="space-y-2">
        <div
          v-for="slot in slotsForDay"
          :key="slot.id"
          :class="[
            'rounded-lg border px-4 py-3 transition-colors',
            bookedSlotIds.has(slot.id)
              ? 'bg-amber-50 border-amber-200'
              : 'bg-card border',
          ]"
        >
          <button
            type="button"
            :data-testid="`slot-${slot.id}`"
            :disabled="bookedSlotIds.has(slot.id)"
            :class="[
              'w-full text-left text-sm transition-colors',
              bookedSlotIds.has(slot.id)
                ? 'cursor-default'
                : 'hover:text-primary cursor-pointer',
            ]"
            @click="openBooking(slot.id)"
          >
            {{ formatTime(slot.startTime) }} – {{ formatTime(slot.endTime) }}
            <span v-if="bookedSlotIds.has(slot.id)" :data-testid="`booked-${slot.id}`" class="ml-2 text-xs text-muted-foreground">
              занято
            </span>
          </button>
          <div v-if="bookedSlotIds.has(slot.id)" class="mt-2 space-y-1">
            <div
              v-for="ev in eventsForSlot(slot.id)"
              :key="ev.id"
              class="text-xs text-muted-foreground pl-2 border-l-2 border-amber-300"
            >
              {{ formatTime(ev.startTime) }}–{{ formatTime(ev.endTime) }}
              <span class="font-medium">{{ ev.guestName }}</span>
              <span v-if="ev.eventTypeId" class="ml-1">
                ({{ eventTypes.find(t => t.id === ev.eventTypeId)?.name ?? ev.eventTypeId }})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-sm text-muted-foreground">
      Выберите день в календаре
    </div>
  </div>
  </template>

    <!-- Booking dialog -->
    <Dialog v-model:open="dialogOpen">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Бронирование —
            {{ eventTypes.find((t) => t.id === eventTypeId)?.name ?? eventTypeId }},
            {{ selectedDay ? formatDateLabel(selectedDay) : '' }}
          </DialogTitle>
        </DialogHeader>

        <div class="space-y-4">
          <div class="space-y-1.5" v-if="selectedSlot">
            <Label>Слот</Label>
            <p class="text-sm font-mono text-muted-foreground">
              {{ formatTime(selectedSlot.startTime) }} – {{ formatTime(selectedSlot.endTime) }}
            </p>
          </div>

          <div class="space-y-1.5">
            <Label>Время начала</Label>
            <Input
              v-model="customTime"
              type="time"
              :min="timeMin()"
              :max="timeMax()"
            />
            <p v-if="!timeValidation.valid" class="text-xs text-destructive mt-1">
              {{ timeValidation.message }}
            </p>
          </div>

          <div class="space-y-1.5">
            <Label>Имя гостя</Label>
            <Input v-model="guestName" placeholder="Введите имя" data-testid="guest-name" />
          </div>
        </div>

        <DialogFooter class="mt-4">
          <Button data-testid="submit-booking" @click="submitBooking" :disabled="!timeValidation.valid || submitting">
            {{ submitting ? 'Бронирование...' : 'Забронировать' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
