export interface Owner {
  id: string
  name: string
}

export interface Guest {
  id: string
  name: string
}

export interface EventType {
  id: string
  name: string
  description: string
  duration: number
}

export interface Slot {
  id: string
  startTime: string
  endTime: string
}

export interface Event {
  id: string
  slotId: string
  guestName: string
  eventTypeId: string
  startTime: string
  endTime: string
  description: string
}

export interface CreateEventRequest {
  slotId: string
  guestName: string
  eventTypeId: string
  startTime: string
  endTime: string
  description: string
}

export interface CreateEventTypeRequest {
  id: string
  name: string
  description: string
  duration: number
}

export interface UpdateEventTypeRequest {
  name: string
  description: string
  duration: number
}

export interface CreateSlotRequest {
  startTime: string
  endTime: string
}

export interface UpdateSlotRequest {
  startTime: string
  endTime: string
}

export interface GenerateSlotsRequest {
  startDate: string
  endDate: string
}

export interface ErrorResponse {
  code: number
  message: string
}
