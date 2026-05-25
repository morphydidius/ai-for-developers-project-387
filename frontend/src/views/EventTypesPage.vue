<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { api } from '@/api/client'
import type { EventType } from '@/types/api'

const router = useRouter()
const eventTypes = ref<EventType[]>([])

onMounted(async () => {
  try {
    eventTypes.value = await api.eventTypes.list()
  } catch {
    eventTypes.value = []
  }
})

function goToBooking(eventTypeId: string) {
  router.push(`/event/${eventTypeId}`)
}
</script>

<template>
  <div class="min-h-dvh py-12 px-4">
    <h1 class="text-3xl font-bold text-center mb-10">
      Выберите тип встречи
    </h1>

    <div v-if="eventTypes.length === 0" class="text-center text-muted-foreground text-sm">
      Нет доступных типов встреч
    </div>

    <div v-else class="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
      <div
        v-for="et in eventTypes"
        :key="et.id"
        class="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xl font-semibold">{{ et.name }}</h2>
          <span class="text-sm text-muted-foreground font-mono tabular-nums">
            {{ et.duration }} мин
          </span>
        </div>
        <p class="text-muted-foreground text-sm mb-6 flex-1">
          {{ et.description }}
        </p>
        <Button class="w-full" :data-testid="`book-${et.id}`" @click="goToBooking(et.id)">
          Забронировать
        </Button>
      </div>
    </div>
  </div>
</template>
