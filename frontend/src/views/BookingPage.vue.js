/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CalendarGrid from '@/components/CalendarGrid.vue';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
const route = useRoute();
const router = useRouter();
const eventTypeId = computed(() => route.params.eventTypeId);
const selectedType = computed({
    get: () => eventTypeId.value,
    set: (val) => {
        if (typeof val === 'string')
            router.push(`/event/${val}`);
    },
});
const eventTypes = ref([]);
const slots = ref([]);
const events = ref([]);
const loading = ref(true);
const error = ref('');
onMounted(async () => {
    try {
        const [ets, sls, evs] = await Promise.all([
            api.eventTypes.list(),
            api.slots.list(),
            api.events.list(),
        ]);
        eventTypes.value = ets;
        slots.value = sls;
        events.value = evs;
    }
    catch {
        error.value = 'Не удалось загрузить данные';
    }
    finally {
        loading.value = false;
    }
});
const selectedDay = ref(new Date());
function localDateStr(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}
function isoToLocalTime(iso) {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
function combineDateTime(date, time) {
    const [h, m] = time.split(':').map(Number);
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
}
function formatTime(iso) {
    const d = new Date(iso);
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}
function formatDateLabel(date) {
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        weekday: 'short',
    });
}
const bookedSlotIds = computed(() => new Set(events.value.map((e) => e.slotId)));
function eventsForSlot(slotId) {
    return events.value.filter((e) => e.slotId === slotId);
}
const slotsForDay = computed(() => {
    if (!selectedDay.value)
        return [];
    const day = localDateStr(selectedDay.value);
    return slots.value.filter((s) => s.startTime.slice(0, 10) === day);
});
// ── Dialog state ──
const dialogOpen = ref(false);
const selectedSlotId = ref(null);
const selectedSlot = computed(() => slots.value.find((s) => s.id === selectedSlotId.value) ?? null);
const guestName = ref('');
const customTime = ref('');
const submitting = ref(false);
const currentEventType = computed(() => eventTypes.value.find((t) => t.id === eventTypeId.value) ?? null);
function addMinutes(time, mins) {
    const [h, m] = time.split(':').map(Number);
    const total = h * 60 + m + mins;
    const nh = Math.floor(total / 60);
    const nm = total % 60;
    return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
}
function timeGt(a, b) {
    return a > b;
}
const timeValidation = computed(() => {
    if (!selectedSlot.value || !currentEventType.value || !customTime.value) {
        return { valid: true, message: '' };
    }
    const slotStart = isoToLocalTime(selectedSlot.value.startTime);
    const slotEnd = isoToLocalTime(selectedSlot.value.endTime);
    const computedEnd = addMinutes(customTime.value, currentEventType.value.duration);
    if (timeGt(slotStart, customTime.value)) {
        return {
            valid: false,
            message: `Время начала (${customTime.value}) раньше начала слота (${slotStart})`,
        };
    }
    if (timeGt(computedEnd, slotEnd)) {
        return {
            valid: false,
            message: `Встреча закончится в ${computedEnd}, что выходит за пределы слота (до ${slotEnd})`,
        };
    }
    return { valid: true, message: '' };
});
function openBooking(slotId) {
    selectedSlotId.value = slotId;
    const slot = slots.value.find((s) => s.id === slotId);
    if (slot) {
        customTime.value = isoToLocalTime(slot.startTime);
    }
    guestName.value = '';
    dialogOpen.value = true;
}
async function submitBooking() {
    if (!selectedSlot.value || !currentEventType.value || !guestName.value)
        return;
    submitting.value = true;
    const startTime = combineDateTime(selectedDay.value, customTime.value);
    const endTime = combineDateTime(selectedDay.value, addMinutes(customTime.value, currentEventType.value.duration));
    try {
        await api.events.create({
            slotId: selectedSlot.value.id,
            guestName: guestName.value,
            eventTypeId: eventTypeId.value,
            startTime,
            endTime,
            description: '',
        });
        dialogOpen.value = false;
        guestName.value = '';
        const [sls, evs] = await Promise.all([
            api.slots.list(),
            api.events.list(),
        ]);
        slots.value = sls;
        events.value = evs;
    }
    catch {
        error.value = 'Ошибка при создании бронирования';
    }
    finally {
        submitting.value = false;
    }
}
function timeMin() {
    return selectedSlot.value ? isoToLocalTime(selectedSlot.value.startTime) : '';
}
function timeMax() {
    return selectedSlot.value ? isoToLocalTime(selectedSlot.value.endTime) : '';
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "py-8 px-4" },
});
/** @type {__VLS_StyleScopedClasses['py-8']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-center text-sm text-muted-foreground py-12" },
    });
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-12']} */ ;
}
else if (__VLS_ctx.error) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-center text-sm text-destructive py-12" },
    });
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-destructive']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-12']} */ ;
    (__VLS_ctx.error);
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "max-w-sm mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['max-w-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.Label | typeof __VLS_components.Label} */
    Label;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ...{ class: "mb-1.5 block" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "mb-1.5 block" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['mb-1.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['block']} */ ;
    const { default: __VLS_5 } = __VLS_3.slots;
    // @ts-ignore
    [loading, error, error,];
    var __VLS_3;
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.Select | typeof __VLS_components.Select} */
    Select;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        ...{ 'onUpdate:modelValue': {} },
        modelValue: (__VLS_ctx.selectedType),
    }));
    const __VLS_8 = __VLS_7({
        ...{ 'onUpdate:modelValue': {} },
        modelValue: (__VLS_ctx.selectedType),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    let __VLS_11;
    const __VLS_12 = ({ 'update:modelValue': {} },
        { 'onUpdate:modelValue': (...[$event]) => {
                if (!!(__VLS_ctx.loading))
                    return;
                if (!!(__VLS_ctx.error))
                    return;
                __VLS_ctx.selectedType = $event;
                // @ts-ignore
                [selectedType, selectedType,];
            } });
    const { default: __VLS_13 } = __VLS_9.slots;
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.SelectTrigger | typeof __VLS_components.SelectTrigger} */
    SelectTrigger;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        ...{ class: "w-full" },
    }));
    const __VLS_16 = __VLS_15({
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_19 } = __VLS_17.slots;
    let __VLS_20;
    /** @ts-ignore @type { | typeof __VLS_components.SelectValue} */
    SelectValue;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
        placeholder: "Выберите тип",
    }));
    const __VLS_22 = __VLS_21({
        placeholder: "Выберите тип",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    // @ts-ignore
    [];
    var __VLS_17;
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.SelectContent | typeof __VLS_components.SelectContent} */
    SelectContent;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({}));
    const __VLS_27 = __VLS_26({}, ...__VLS_functionalComponentArgsRest(__VLS_26));
    const { default: __VLS_30 } = __VLS_28.slots;
    for (const [et] of __VLS_vFor((__VLS_ctx.eventTypes))) {
        let __VLS_31;
        /** @ts-ignore @type { | typeof __VLS_components.SelectItem | typeof __VLS_components.SelectItem} */
        SelectItem;
        // @ts-ignore
        const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
            key: (et.id),
            value: (et.id),
        }));
        const __VLS_33 = __VLS_32({
            key: (et.id),
            value: (et.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_32));
        const { default: __VLS_36 } = __VLS_34.slots;
        (et.name);
        (et.duration);
        // @ts-ignore
        [eventTypes,];
        var __VLS_34;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_28;
    // @ts-ignore
    [];
    var __VLS_9;
    var __VLS_10;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "grid md:grid-cols-2 gap-8 items-start" },
    });
    /** @type {__VLS_StyleScopedClasses['grid']} */ ;
    /** @type {__VLS_StyleScopedClasses['md:grid-cols-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-start']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    const __VLS_37 = CalendarGrid;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
        slots: (__VLS_ctx.slots),
        modelValue: (__VLS_ctx.selectedDay),
    }));
    const __VLS_39 = __VLS_38({
        slots: (__VLS_ctx.slots),
        modelValue: (__VLS_ctx.selectedDay),
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    if (__VLS_ctx.selectedDay) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-sm text-muted-foreground mb-3" },
        });
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-3']} */ ;
        (__VLS_ctx.formatDateLabel(__VLS_ctx.selectedDay));
        if (__VLS_ctx.slotsForDay.length === 0) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "text-sm text-muted-foreground" },
            });
            /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "space-y-2" },
            });
            /** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
            for (const [slot] of __VLS_vFor((__VLS_ctx.slotsForDay))) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    key: (slot.id),
                    ...{ class: ([
                            'rounded-lg border px-4 py-3 transition-colors',
                            __VLS_ctx.bookedSlotIds.has(slot.id)
                                ? 'bg-amber-50 border-amber-200'
                                : 'bg-card border',
                        ]) },
                });
                /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
                /** @type {__VLS_StyleScopedClasses['border']} */ ;
                /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
                    ...{ onClick: (...[$event]) => {
                            if (!!(__VLS_ctx.loading))
                                return;
                            if (!!(__VLS_ctx.error))
                                return;
                            if (!(__VLS_ctx.selectedDay))
                                return;
                            if (!!(__VLS_ctx.slotsForDay.length === 0))
                                return;
                            __VLS_ctx.openBooking(slot.id);
                            // @ts-ignore
                            [slots, selectedDay, selectedDay, selectedDay, formatDateLabel, slotsForDay, slotsForDay, bookedSlotIds, openBooking,];
                        } },
                    type: "button",
                    'data-testid': (`slot-${slot.id}`),
                    disabled: (__VLS_ctx.bookedSlotIds.has(slot.id)),
                    ...{ class: ([
                            'w-full text-left text-sm transition-colors',
                            __VLS_ctx.bookedSlotIds.has(slot.id)
                                ? 'cursor-default'
                                : 'hover:text-primary cursor-pointer',
                        ]) },
                });
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-left']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
                /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
                (__VLS_ctx.formatTime(slot.startTime));
                (__VLS_ctx.formatTime(slot.endTime));
                if (__VLS_ctx.bookedSlotIds.has(slot.id)) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                        'data-testid': (`booked-${slot.id}`),
                        ...{ class: "ml-2 text-xs text-muted-foreground" },
                    });
                    /** @type {__VLS_StyleScopedClasses['ml-2']} */ ;
                    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
                    /** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
                }
                if (__VLS_ctx.bookedSlotIds.has(slot.id)) {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "mt-2 space-y-1" },
                    });
                    /** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
                    /** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
                    for (const [ev] of __VLS_vFor((__VLS_ctx.eventsForSlot(slot.id)))) {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                            key: (ev.id),
                            ...{ class: "text-xs text-muted-foreground pl-2 border-l-2 border-amber-300" },
                        });
                        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
                        /** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
                        /** @type {__VLS_StyleScopedClasses['pl-2']} */ ;
                        /** @type {__VLS_StyleScopedClasses['border-l-2']} */ ;
                        /** @type {__VLS_StyleScopedClasses['border-amber-300']} */ ;
                        (__VLS_ctx.formatTime(ev.startTime));
                        (__VLS_ctx.formatTime(ev.endTime));
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                            ...{ class: "font-medium" },
                        });
                        /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
                        (ev.guestName);
                        if (ev.eventTypeId) {
                            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                                ...{ class: "ml-1" },
                            });
                            /** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
                            (__VLS_ctx.eventTypes.find(t => t.id === ev.eventTypeId)?.name ?? ev.eventTypeId);
                        }
                        // @ts-ignore
                        [eventTypes, bookedSlotIds, bookedSlotIds, bookedSlotIds, bookedSlotIds, formatTime, formatTime, formatTime, formatTime, eventsForSlot,];
                    }
                }
                // @ts-ignore
                [];
            }
        }
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-sm text-muted-foreground" },
        });
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
    }
}
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.Dialog | typeof __VLS_components.Dialog} */
Dialog;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    open: (__VLS_ctx.dialogOpen),
}));
const __VLS_44 = __VLS_43({
    open: (__VLS_ctx.dialogOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
const { default: __VLS_47 } = __VLS_45.slots;
let __VLS_48;
/** @ts-ignore @type { | typeof __VLS_components.DialogContent | typeof __VLS_components.DialogContent} */
DialogContent;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
    ...{ class: "sm:max-w-lg" },
}));
const __VLS_50 = __VLS_49({
    ...{ class: "sm:max-w-lg" },
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
/** @type {__VLS_StyleScopedClasses['sm:max-w-lg']} */ ;
const { default: __VLS_53 } = __VLS_51.slots;
let __VLS_54;
/** @ts-ignore @type { | typeof __VLS_components.DialogHeader | typeof __VLS_components.DialogHeader} */
DialogHeader;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({}));
const __VLS_56 = __VLS_55({}, ...__VLS_functionalComponentArgsRest(__VLS_55));
const { default: __VLS_59 } = __VLS_57.slots;
let __VLS_60;
/** @ts-ignore @type { | typeof __VLS_components.DialogTitle | typeof __VLS_components.DialogTitle} */
DialogTitle;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({}));
const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const { default: __VLS_65 } = __VLS_63.slots;
(__VLS_ctx.eventTypes.find((t) => t.id === __VLS_ctx.eventTypeId)?.name ?? __VLS_ctx.eventTypeId);
(__VLS_ctx.selectedDay ? __VLS_ctx.formatDateLabel(__VLS_ctx.selectedDay) : '');
// @ts-ignore
[eventTypes, selectedDay, selectedDay, formatDateLabel, dialogOpen, eventTypeId, eventTypeId,];
var __VLS_63;
// @ts-ignore
[];
var __VLS_57;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "space-y-4" },
});
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
if (__VLS_ctx.selectedSlot) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "space-y-1.5" },
    });
    /** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
    let __VLS_66;
    /** @ts-ignore @type { | typeof __VLS_components.Label | typeof __VLS_components.Label} */
    Label;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({}));
    const __VLS_68 = __VLS_67({}, ...__VLS_functionalComponentArgsRest(__VLS_67));
    const { default: __VLS_71 } = __VLS_69.slots;
    // @ts-ignore
    [selectedSlot,];
    var __VLS_69;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-sm font-mono text-muted-foreground" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
    (__VLS_ctx.formatTime(__VLS_ctx.selectedSlot.startTime));
    (__VLS_ctx.formatTime(__VLS_ctx.selectedSlot.endTime));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "space-y-1.5" },
});
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
let __VLS_72;
/** @ts-ignore @type { | typeof __VLS_components.Label | typeof __VLS_components.Label} */
Label;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({}));
const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
const { default: __VLS_77 } = __VLS_75.slots;
// @ts-ignore
[formatTime, formatTime, selectedSlot, selectedSlot,];
var __VLS_75;
let __VLS_78;
/** @ts-ignore @type { | typeof __VLS_components.Input} */
Input;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
    modelValue: (__VLS_ctx.customTime),
    type: "time",
    min: (__VLS_ctx.timeMin()),
    max: (__VLS_ctx.timeMax()),
}));
const __VLS_80 = __VLS_79({
    modelValue: (__VLS_ctx.customTime),
    type: "time",
    min: (__VLS_ctx.timeMin()),
    max: (__VLS_ctx.timeMax()),
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
if (!__VLS_ctx.timeValidation.valid) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-xs text-destructive mt-1" },
    });
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-destructive']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
    (__VLS_ctx.timeValidation.message);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "space-y-1.5" },
});
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
let __VLS_83;
/** @ts-ignore @type { | typeof __VLS_components.Label | typeof __VLS_components.Label} */
Label;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({}));
const __VLS_85 = __VLS_84({}, ...__VLS_functionalComponentArgsRest(__VLS_84));
const { default: __VLS_88 } = __VLS_86.slots;
// @ts-ignore
[customTime, timeMin, timeMax, timeValidation, timeValidation,];
var __VLS_86;
let __VLS_89;
/** @ts-ignore @type { | typeof __VLS_components.Input} */
Input;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
    modelValue: (__VLS_ctx.guestName),
    placeholder: "Введите имя",
    dataTestid: "guest-name",
}));
const __VLS_91 = __VLS_90({
    modelValue: (__VLS_ctx.guestName),
    placeholder: "Введите имя",
    dataTestid: "guest-name",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
let __VLS_94;
/** @ts-ignore @type { | typeof __VLS_components.DialogFooter | typeof __VLS_components.DialogFooter} */
DialogFooter;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
    ...{ class: "mt-4" },
}));
const __VLS_96 = __VLS_95({
    ...{ class: "mt-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
const { default: __VLS_99 } = __VLS_97.slots;
let __VLS_100;
/** @ts-ignore @type { | typeof __VLS_components.Button | typeof __VLS_components.Button} */
Button;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
    ...{ 'onClick': {} },
    dataTestid: "submit-booking",
    disabled: (!__VLS_ctx.timeValidation.valid || __VLS_ctx.submitting),
}));
const __VLS_102 = __VLS_101({
    ...{ 'onClick': {} },
    dataTestid: "submit-booking",
    disabled: (!__VLS_ctx.timeValidation.valid || __VLS_ctx.submitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
let __VLS_105;
const __VLS_106 = ({ click: {} },
    { onClick: (__VLS_ctx.submitBooking) });
const { default: __VLS_107 } = __VLS_103.slots;
(__VLS_ctx.submitting ? 'Бронирование...' : 'Забронировать');
// @ts-ignore
[timeValidation, guestName, submitting, submitting, submitBooking,];
var __VLS_103;
var __VLS_104;
// @ts-ignore
[];
var __VLS_97;
// @ts-ignore
[];
var __VLS_51;
// @ts-ignore
[];
var __VLS_45;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
