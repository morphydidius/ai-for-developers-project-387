<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()

const items = [
  { label: 'Бронирования', path: '/admin/bookings' },
  { label: 'Типы событий', path: '/admin/event-types' },
  { label: 'Слоты', path: '/admin/slots' },
]

function isActive(path: string) {
  return route.path === path
}

function go(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="flex min-h-dvh">
    <aside class="w-56 shrink-0 border-r bg-card p-4 flex flex-col gap-1">
      <h2 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
        Администрирование
      </h2>
      <Button
        v-for="item in items"
        :key="item.path"
        :variant="isActive(item.path) ? 'secondary' : 'ghost'"
        class="justify-start"
        @click="go(item.path)"
      >
        {{ item.label }}
      </Button>
    </aside>
    <main class="flex-1 p-6">
      <router-view />
    </main>
  </div>
</template>
