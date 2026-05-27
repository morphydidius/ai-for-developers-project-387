function toISO(date, hours, minutes) {
    const d = new Date(date);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
}
export function generateMockSlots(_eventTypeId) {
    const slots = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let idCounter = 1;
    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
        const date = new Date(today);
        date.setDate(date.getDate() + dayOffset);
        const dayOfWeek = date.getDay();
        if (dayOffset > 0 && (dayOfWeek === 0 || dayOfWeek === 6))
            continue;
        slots.push({
            id: 'slot-' + idCounter++,
            startTime: toISO(date, 9, 0),
            endTime: toISO(date, 11, 0),
        });
        slots.push({
            id: 'slot-' + idCounter++,
            startTime: toISO(date, 13, 0),
            endTime: toISO(date, 15, 0),
        });
        slots.push({
            id: 'slot-' + idCounter++,
            startTime: toISO(date, 16, 0),
            endTime: toISO(date, 18, 0),
        });
    }
    return slots;
}
