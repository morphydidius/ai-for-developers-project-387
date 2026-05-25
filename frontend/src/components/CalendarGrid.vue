<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import type { Slot } from '@/types/api'

const props = defineProps<{
  slots: Slot[]
  modelValue: Date | null
}>()

const emit = defineEmits<{
  'update:modelValue': [date: Date]
}>()

const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function localDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const today = new Date()
today.setHours(0, 0, 0, 0)
const todayIso = localDateStr(today)

const rangeEnd = new Date(today)
rangeEnd.setDate(rangeEnd.getDate() + 13)
const rangeEndIso = localDateStr(rangeEnd)

const gridStart = new Date(today)
const dow = gridStart.getDay()
gridStart.setDate(gridStart.getDate() + (dow === 0 ? -6 : 1 - dow))

const gridEnd = new Date(rangeEnd)
const endDow = gridEnd.getDay()
gridEnd.setDate(gridEnd.getDate() + (endDow === 0 ? 0 : 7 - endDow))

const days = computed(() => {
  const result: { date: Date; day: number; iso: string }[] = []
  const cur = new Date(gridStart)
  while (cur <= gridEnd) {
    result.push({ date: new Date(cur), day: cur.getDate(), iso: localDateStr(cur) })
    cur.setDate(cur.getDate() + 1)
  }
  return result
})

const datesWithSlots = computed(() => {
  const set = new Set<string>()
  for (const s of props.slots) {
    set.add(s.startTime.slice(0, 10))
  }
  return set
})

function hasSlots(iso: string) {
  return datesWithSlots.value.has(iso)
}

function isPast(iso: string) {
  return iso < todayIso
}

function isBeyond(iso: string) {
  return iso > rangeEndIso
}

function isSelected(iso: string) {
  return props.modelValue ? localDateStr(props.modelValue) === iso : false
}

function isToday(iso: string) {
  return todayIso === iso
}

function isBlocked(iso: string) {
  return isPast(iso) || isBeyond(iso)
}

function select(date: Date) {
  if (!isBlocked(localDateStr(date))) {
    emit('update:modelValue', date)
  }
}
</script>

<template>
  <div>
    <div class="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-1">
      <div v-for="d in dayNames" :key="d">{{ d }}</div>
    </div>
    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="day in days"
        :key="day.iso"
        :data-testid="`day-${day.iso}`"
        type="button"
        :disabled="isBlocked(day.iso) || !hasSlots(day.iso)"
        :class="cn(
          'rounded-md text-sm py-2 transition-colors',
          isBlocked(day.iso) && 'text-muted-foreground/30 cursor-not-allowed',
          !isBlocked(day.iso) && !hasSlots(day.iso) && 'text-muted-foreground/40 cursor-not-allowed',
          !isBlocked(day.iso) && hasSlots(day.iso) && !isSelected(day.iso) && 'hover:bg-accent cursor-pointer',
          isSelected(day.iso) && 'bg-primary text-primary-foreground',
          isToday(day.iso) && !isSelected(day.iso) && 'ring-1 ring-inset ring-primary',
          !isBlocked(day.iso) && hasSlots(day.iso) && !isSelected(day.iso) && !isToday(day.iso) && 'bg-muted/50',
        )"
        @click="select(day.date)"
      >
        {{ day.day }}
      </button>
    </div>
  </div>
</template>
