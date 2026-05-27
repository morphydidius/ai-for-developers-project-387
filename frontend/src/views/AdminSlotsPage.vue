<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api/client'
import type { Slot, Event, EventType } from '@/types/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const todayStr = new Date().toISOString().slice(0, 10)

const maxDateStr = (() => {
  const d = new Date()
  d.setDate(d.getDate() + 13)
  return d.toISOString().slice(0, 10)
})()

const selectedDate = ref(todayStr)

const allSlots = ref<Slot[]>([])
const events = ref<Event[]>([])
const eventTypes = ref<EventType[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [sls, evs, ets] = await Promise.all([
      api.slots.list(),
      api.events.list(),
      api.eventTypes.list(),
    ])
    allSlots.value = sls
    events.value = evs
    eventTypes.value = ets
  } catch {
    // данные остаются пустыми
  } finally {
    loading.value = false
  }
})

const bookedSlotIds = computed(() => new Set(events.value.map((e) => e.slotId)))
const isDeletingBookedSlot = computed(() =>
  deletingSlotId.value ? bookedSlotIds.value.has(deletingSlotId.value) : false,
)

function eventsForSlot(slotId: string): Event[] {
  return events.value.filter((e) => e.slotId === slotId)
}

const slotsForDate = computed(() =>
  allSlots.value.filter((s) => s.startTime.slice(0, 10) === selectedDate.value),
)

function combineDateTime(dateStr: string, timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number)
  const d = new Date(`${dateStr}T00:00:00`)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

function isoToLocalTime(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

// ── Slot dialog (create / edit) ──

const slotDialogOpen = ref(false)
const editingSlotId = ref<string | null>(null)
const formStartTime = ref('09:00')
const formEndTime = ref('10:00')
const submitting = ref(false)

const isEditMode = computed(() => editingSlotId.value !== null)

function checkOverlap(start: string, end: string): string[] {
  const result: string[] = []
  for (const s of slotsForDate.value) {
    if (s.id === editingSlotId.value) continue
    const sStart = isoToLocalTime(s.startTime)
    const sEnd = isoToLocalTime(s.endTime)
    if (start < sEnd && end > sStart) {
      result.push(`${sStart}–${sEnd}`)
    }
  }
  return result
}

function openAdd() {
  editingSlotId.value = null
  formStartTime.value = '09:00'
  formEndTime.value = '10:00'
  slotDialogOpen.value = true
}

function openEdit(slotId: string) {
  const slot = allSlots.value.find((s) => s.id === slotId)
  if (!slot) return
  editingSlotId.value = slotId
  formStartTime.value = isoToLocalTime(slot.startTime)
  formEndTime.value = isoToLocalTime(slot.endTime)
  slotDialogOpen.value = true
}

async function handleSubmit() {
  if (!formStartTime.value || !formEndTime.value) return
  submitting.value = true
  try {
    const startTime = combineDateTime(selectedDate.value, formStartTime.value)
    const endTime = combineDateTime(selectedDate.value, formEndTime.value)
    if (isEditMode.value && editingSlotId.value) {
      await api.slots.update(editingSlotId.value, { startTime, endTime })
    } else {
      await api.slots.create({ startTime, endTime })
    }
    slotDialogOpen.value = false
    const [sls, evs, ets] = await Promise.all([
      api.slots.list(),
      api.events.list(),
      api.eventTypes.list(),
    ])
    allSlots.value = sls
    events.value = evs
    eventTypes.value = ets
  } catch {
    // ошибка
  } finally {
    submitting.value = false
  }
}

// ── Delete dialog ──

const deleteDialogOpen = ref(false)
const deletingSlotId = ref<string | null>(null)
const deletingSlotLabel = ref('')
const deleting = ref(false)

function openDelete(slotId: string, iso: string) {
  deletingSlotId.value = slotId
  deletingSlotLabel.value = `${isoToLocalTime(iso)}`
  deleteDialogOpen.value = true
}

async function handleDelete() {
  if (!deletingSlotId.value) return
  deleting.value = true
  try {
    await api.slots.delete(deletingSlotId.value)
    deleteDialogOpen.value = false
    const [sls, evs, ets] = await Promise.all([
      api.slots.list(),
      api.events.list(),
      api.eventTypes.list(),
    ])
    allSlots.value = sls
    events.value = evs
    eventTypes.value = ets
  } catch {
    // ошибка
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="max-w-[1000px]">
    <h1 class="text-2xl font-bold mb-6">Слоты</h1>

    <div v-if="loading" class="text-sm text-muted-foreground py-8 text-center">
      Загрузка...
    </div>

    <template v-else>
    <div class="flex items-end gap-4 mb-6">
      <div class="space-y-1.5">
        <Label>Дата</Label>
        <Input v-model="selectedDate" type="date" :max="maxDateStr" />
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <p class="text-sm text-muted-foreground">
          Слотов на выбранную дату: {{ slotsForDate.length }}
        </p>
        <Button size="sm" @click="openAdd">Добавить слот</Button>
      </div>

      <div
        v-if="slotsForDate.length === 0"
        class="text-sm text-muted-foreground py-8 text-center border rounded-lg"
      >
        Нет слотов на эту дату
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="slot in slotsForDate"
          :key="slot.id"
          :class="[
            'rounded-lg border px-4 py-3 transition-colors',
            bookedSlotIds.has(slot.id)
              ? 'bg-amber-50 border-amber-200'
              : 'bg-card border',
          ]"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm font-mono tabular-nums">
              {{ formatTime(slot.startTime) }} – {{ formatTime(slot.endTime) }}
              <span v-if="bookedSlotIds.has(slot.id)" :data-testid="`booked-${slot.id}`" class="ml-2 text-xs text-muted-foreground">
                занято
              </span>
            </span>
            <div class="flex gap-2">
              <Button variant="outline" size="sm" @click="openEdit(slot.id)">Редактировать</Button>
              <Button variant="destructive" size="sm" @click="openDelete(slot.id, slot.startTime)">
                Удалить
              </Button>
            </div>
          </div>
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
    </template>

    <!-- Slot dialog (create / edit) -->
    <Dialog v-model:open="slotDialogOpen">
      <DialogContent class="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{{ isEditMode ? 'Редактирование слота' : 'Новый слот' }}</DialogTitle>
        </DialogHeader>

        <div class="space-y-4">
          <div class="space-y-1.5">
            <Label>Время начала</Label>
            <input
              :value="formStartTime"
              @input="formStartTime = ($event.target as HTMLInputElement).value"
              type="time"
              class="border-input dark:bg-input/30 h-8 w-full rounded-lg border bg-transparent px-2.5 py-1 text-base outline-none md:text-sm"
            />
          </div>
          <div class="space-y-1.5">
            <Label>Время окончания</Label>
            <input
              :value="formEndTime"
              @input="formEndTime = ($event.target as HTMLInputElement).value"
              type="time"
              class="border-input dark:bg-input/30 h-8 w-full rounded-lg border bg-transparent px-2.5 py-1 text-base outline-none md:text-sm"
            />
          </div>
        </div>

        <!-- in-dialog validation -->
        <template v-if="formStartTime && formEndTime">
          <p v-if="formStartTime >= formEndTime" class="text-xs text-destructive">
            Время окончания должно быть позже времени начала
          </p>
          <p
            v-else-if="checkOverlap(formStartTime, formEndTime).length > 0"
            class="text-xs text-destructive"
          >
            Слот пересекается с:
            {{ checkOverlap(formStartTime, formEndTime).join(', ') }}
          </p>
        </template>

        <DialogFooter class="mt-4 gap-2">
          <Button
            variant="default"
            :disabled="!formStartTime || !formEndTime || formStartTime >= formEndTime || checkOverlap(formStartTime, formEndTime).length > 0 || submitting"
            @click="handleSubmit"
          >
            {{ submitting ? (isEditMode ? 'Обновление...' : 'Создание...') : (isEditMode ? 'Обновить' : 'Создать') }}
          </Button>
          <Button variant="outline" @click="slotDialogOpen = false">Отмена</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete dialog -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent class="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle :class="isDeletingBookedSlot ? 'text-destructive' : ''">
            {{ isDeletingBookedSlot ? 'Вы пытаетесь удалить занятый слот!' : 'Удаление слота' }}
          </DialogTitle>
        </DialogHeader>
        <p class="text-sm text-muted-foreground">Удалить слот {{ deletingSlotLabel }}?</p>
        <DialogFooter class="mt-4 gap-2">
          <Button variant="destructive" :disabled="deleting" @click="handleDelete">
            {{ deleting ? 'Удаление...' : 'Удалить' }}
          </Button>
          <Button variant="outline" @click="deleteDialogOpen = false">Отмена</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
