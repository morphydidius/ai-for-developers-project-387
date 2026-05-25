import type { Event } from '../types/api'

export function generateMockEvents(): Event[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const base = (offset: number, h: number, m: number) => {
    const d = new Date(today)
    d.setDate(d.getDate() + offset)
    d.setHours(h, m, 0, 0)
    return d.toISOString()
  }

  return [
    {
      id: 'event-1',
      slotId: 'slot-1',
      guestName: 'Анна Петрова',
      eventTypeId: 'quick',
      startTime: base(0, 9, 0),
      endTime: base(0, 9, 15),
      description: '',
    },
    {
      id: 'event-2',
      slotId: 'slot-2',
      guestName: 'Иван Сидоров',
      eventTypeId: 'full',
      startTime: base(1, 13, 0),
      endTime: base(1, 13, 30),
      description: 'Обсуждение проекта',
    },
    {
      id: 'event-3',
      slotId: 'slot-5',
      guestName: 'Мария Иванова',
      eventTypeId: 'quick',
      startTime: base(3, 16, 0),
      endTime: base(3, 16, 15),
      description: '',
    },
  ]
}
