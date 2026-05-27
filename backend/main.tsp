import "@typespec/http";
import "@typespec/rest";

using TypeSpec.Http;
using TypeSpec.Rest;

@service(#{title: "Booking API"})
@server("/api", "API for booking meeting slots")
namespace BookingAPI;

// ──── Models ────

model Owner {
  id: string;
  name: string;
}

model Guest {
  id: string;
  name: string;
}

model EventType {
  id: string;
  name: string;
  description: string;
  duration: int32;
}

model Slot {
  id: string;
  startTime: utcDateTime;
  endTime: utcDateTime;
}

model Event {
  id: string;
  slotId: string;
  guestName: string;
  eventTypeId: string;
  startTime: utcDateTime;
  endTime: utcDateTime;
  description: string;
}

// ──── Request / Response models ────

model CreateEventRequest {
  slotId: string;
  guestName: string;
  eventTypeId: string;
  startTime: utcDateTime;
  endTime: utcDateTime;
  description: string;
}

model CreateEventTypeRequest {
  id: string;
  name: string;
  description: string;
  duration: int32;
}

model UpdateEventTypeRequest {
  name: string;
  description: string;
  duration: int32;
}

model CreateSlotRequest {
  startTime: utcDateTime;
  endTime: utcDateTime;
}

model UpdateSlotRequest {
  startTime: utcDateTime;
  endTime: utcDateTime;
}

model GenerateSlotsRequest {
  startDate: utcDateTime;
  endDate: utcDateTime;
}

// ──── Event Types ────

@route("event-types")
namespace EventTypes {
  @get
  op list(): EventType[];

  @post
  op create(@body body: CreateEventTypeRequest): EventType | ErrorResponse;

  @route("{id}")
  namespace EventTypeById {
    @put
    op update(@path id: string, @body body: UpdateEventTypeRequest): EventType | ErrorResponse;

    @delete
    op delete(@path id: string): void | ErrorResponse;
  }
}

// ──── Slots ────

@route("slots")
namespace Slots {
  @get
  op list(): Slot[];

  @post
  op create(@body body: CreateSlotRequest): Slot | ErrorResponse;

  @route("{id}")
  namespace SlotById {
    @put
    op update(@path id: string, @body body: UpdateSlotRequest): Slot | ErrorResponse;

    @delete
    op delete(@path id: string): void | ErrorResponse;
  }

  @post
  @route("generate")
  op generate(@body body: GenerateSlotsRequest): Slot[] | ErrorResponse;
}

// ──── Events ────

@route("events")
namespace Events {
  @get
  op list(): Event[];

  @post
  op create(@body body: CreateEventRequest): Event | ErrorResponse;

  @route("{id}")
  namespace EventById {
    @delete
    op delete(@path id: string): void | ErrorResponse;
  }
}

// ──── Errors ────

@error
model ErrorResponse {
  code: int32;
  message: string;
}
