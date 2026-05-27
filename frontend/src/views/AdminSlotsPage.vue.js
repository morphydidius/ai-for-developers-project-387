/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, onMounted } from 'vue';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
const todayStr = new Date().toISOString().slice(0, 10);
const maxDateStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 13);
    return d.toISOString().slice(0, 10);
})();
const selectedDate = ref(todayStr);
const allSlots = ref([]);
const events = ref([]);
const eventTypes = ref([]);
const loading = ref(true);
onMounted(async () => {
    try {
        const [sls, evs, ets] = await Promise.all([
            api.slots.list(),
            api.events.list(),
            api.eventTypes.list(),
        ]);
        allSlots.value = sls;
        events.value = evs;
        eventTypes.value = ets;
    }
    catch {
        // данные остаются пустыми
    }
    finally {
        loading.value = false;
    }
});
const bookedSlotIds = computed(() => new Set(events.value.map((e) => e.slotId)));
const isDeletingBookedSlot = computed(() => deletingSlotId.value ? bookedSlotIds.value.has(deletingSlotId.value) : false);
function eventsForSlot(slotId) {
    return events.value.filter((e) => e.slotId === slotId);
}
const slotsForDate = computed(() => allSlots.value.filter((s) => s.startTime.slice(0, 10) === selectedDate.value));
function combineDateTime(dateStr, timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date(`${dateStr}T00:00:00`);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
}
function isoToLocalTime(iso) {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
function formatTime(iso) {
    const d = new Date(iso);
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}
// ── Slot dialog (create / edit) ──
const slotDialogOpen = ref(false);
const editingSlotId = ref(null);
const formStartTime = ref('09:00');
const formEndTime = ref('10:00');
const submitting = ref(false);
const isEditMode = computed(() => editingSlotId.value !== null);
function checkOverlap(start, end) {
    const result = [];
    for (const s of slotsForDate.value) {
        if (s.id === editingSlotId.value)
            continue;
        const sStart = isoToLocalTime(s.startTime);
        const sEnd = isoToLocalTime(s.endTime);
        if (start < sEnd && end > sStart) {
            result.push(`${sStart}–${sEnd}`);
        }
    }
    return result;
}
function openAdd() {
    editingSlotId.value = null;
    formStartTime.value = '09:00';
    formEndTime.value = '10:00';
    slotDialogOpen.value = true;
}
function openEdit(slotId) {
    const slot = allSlots.value.find((s) => s.id === slotId);
    if (!slot)
        return;
    editingSlotId.value = slotId;
    formStartTime.value = isoToLocalTime(slot.startTime);
    formEndTime.value = isoToLocalTime(slot.endTime);
    slotDialogOpen.value = true;
}
async function handleSubmit() {
    if (!formStartTime.value || !formEndTime.value)
        return;
    submitting.value = true;
    try {
        const startTime = combineDateTime(selectedDate.value, formStartTime.value);
        const endTime = combineDateTime(selectedDate.value, formEndTime.value);
        if (isEditMode.value && editingSlotId.value) {
            await api.slots.update(editingSlotId.value, { startTime, endTime });
        }
        else {
            await api.slots.create({ startTime, endTime });
        }
        slotDialogOpen.value = false;
        const [sls, evs, ets] = await Promise.all([
            api.slots.list(),
            api.events.list(),
            api.eventTypes.list(),
        ]);
        allSlots.value = sls;
        events.value = evs;
        eventTypes.value = ets;
    }
    catch {
        // ошибка
    }
    finally {
        submitting.value = false;
    }
}
// ── Delete dialog ──
const deleteDialogOpen = ref(false);
const deletingSlotId = ref(null);
const deletingSlotLabel = ref('');
const deleting = ref(false);
function openDelete(slotId, iso) {
    deletingSlotId.value = slotId;
    deletingSlotLabel.value = `${isoToLocalTime(iso)}`;
    deleteDialogOpen.value = true;
}
async function handleDelete() {
    if (!deletingSlotId.value)
        return;
    deleting.value = true;
    try {
        await api.slots.delete(deletingSlotId.value);
        deleteDialogOpen.value = false;
        const [sls, evs, ets] = await Promise.all([
            api.slots.list(),
            api.events.list(),
            api.eventTypes.list(),
        ]);
        allSlots.value = sls;
        events.value = evs;
        eventTypes.value = ets;
    }
    catch {
        // ошибка
    }
    finally {
        deleting.value = false;
    }
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "max-w-[1000px]" },
});
/** @type {__VLS_StyleScopedClasses['max-w-[1000px]']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "text-2xl font-bold mb-6" },
});
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-sm text-muted-foreground py-8 text-center" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-end gap-4 mb-6" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-end']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "space-y-1.5" },
    });
    /** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.Label | typeof __VLS_components.Label} */
    Label;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_5 } = __VLS_3.slots;
    // @ts-ignore
    [loading,];
    var __VLS_3;
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.Input} */
    Input;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        modelValue: (__VLS_ctx.selectedDate),
        type: "date",
        max: (__VLS_ctx.maxDateStr),
    }));
    const __VLS_8 = __VLS_7({
        modelValue: (__VLS_ctx.selectedDate),
        type: "date",
        max: (__VLS_ctx.maxDateStr),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "space-y-3" },
    });
    /** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center justify-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-sm text-muted-foreground" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
    (__VLS_ctx.slotsForDate.length);
    let __VLS_11;
    /** @ts-ignore @type { | typeof __VLS_components.Button | typeof __VLS_components.Button} */
    Button;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        ...{ 'onClick': {} },
        size: "sm",
    }));
    const __VLS_13 = __VLS_12({
        ...{ 'onClick': {} },
        size: "sm",
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    let __VLS_16;
    const __VLS_17 = ({ click: {} },
        { onClick: (__VLS_ctx.openAdd) });
    const { default: __VLS_18 } = __VLS_14.slots;
    // @ts-ignore
    [selectedDate, maxDateStr, slotsForDate, openAdd,];
    var __VLS_14;
    var __VLS_15;
    if (__VLS_ctx.slotsForDate.length === 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-sm text-muted-foreground py-8 text-center border rounded-lg" },
        });
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "space-y-2" },
        });
        /** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
        for (const [slot] of __VLS_vFor((__VLS_ctx.slotsForDate))) {
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
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex items-center justify-between" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "text-sm font-mono tabular-nums" },
            });
            /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
            /** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
            /** @type {__VLS_StyleScopedClasses['tabular-nums']} */ ;
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
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex gap-2" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
            let __VLS_19;
            /** @ts-ignore @type { | typeof __VLS_components.Button | typeof __VLS_components.Button} */
            Button;
            // @ts-ignore
            const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
                ...{ 'onClick': {} },
                variant: "outline",
                size: "sm",
            }));
            const __VLS_21 = __VLS_20({
                ...{ 'onClick': {} },
                variant: "outline",
                size: "sm",
            }, ...__VLS_functionalComponentArgsRest(__VLS_20));
            let __VLS_24;
            const __VLS_25 = ({ click: {} },
                { onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(__VLS_ctx.slotsForDate.length === 0))
                            return;
                        __VLS_ctx.openEdit(slot.id);
                        // @ts-ignore
                        [slotsForDate, slotsForDate, bookedSlotIds, bookedSlotIds, formatTime, formatTime, openEdit,];
                    } });
            const { default: __VLS_26 } = __VLS_22.slots;
            // @ts-ignore
            [];
            var __VLS_22;
            var __VLS_23;
            let __VLS_27;
            /** @ts-ignore @type { | typeof __VLS_components.Button | typeof __VLS_components.Button} */
            Button;
            // @ts-ignore
            const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
                ...{ 'onClick': {} },
                variant: "destructive",
                size: "sm",
            }));
            const __VLS_29 = __VLS_28({
                ...{ 'onClick': {} },
                variant: "destructive",
                size: "sm",
            }, ...__VLS_functionalComponentArgsRest(__VLS_28));
            let __VLS_32;
            const __VLS_33 = ({ click: {} },
                { onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        if (!!(__VLS_ctx.slotsForDate.length === 0))
                            return;
                        __VLS_ctx.openDelete(slot.id, slot.startTime);
                        // @ts-ignore
                        [openDelete,];
                    } });
            const { default: __VLS_34 } = __VLS_30.slots;
            // @ts-ignore
            [];
            var __VLS_30;
            var __VLS_31;
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
                    [bookedSlotIds, formatTime, formatTime, eventsForSlot, eventTypes,];
                }
            }
            // @ts-ignore
            [];
        }
    }
}
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.Dialog | typeof __VLS_components.Dialog} */
Dialog;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    open: (__VLS_ctx.slotDialogOpen),
}));
const __VLS_37 = __VLS_36({
    open: (__VLS_ctx.slotDialogOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
const { default: __VLS_40 } = __VLS_38.slots;
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.DialogContent | typeof __VLS_components.DialogContent} */
DialogContent;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    ...{ class: "sm:max-w-sm" },
}));
const __VLS_43 = __VLS_42({
    ...{ class: "sm:max-w-sm" },
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
/** @type {__VLS_StyleScopedClasses['sm:max-w-sm']} */ ;
const { default: __VLS_46 } = __VLS_44.slots;
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.DialogHeader | typeof __VLS_components.DialogHeader} */
DialogHeader;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({}));
const __VLS_49 = __VLS_48({}, ...__VLS_functionalComponentArgsRest(__VLS_48));
const { default: __VLS_52 } = __VLS_50.slots;
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.DialogTitle | typeof __VLS_components.DialogTitle} */
DialogTitle;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({}));
const __VLS_55 = __VLS_54({}, ...__VLS_functionalComponentArgsRest(__VLS_54));
const { default: __VLS_58 } = __VLS_56.slots;
(__VLS_ctx.isEditMode ? 'Редактирование слота' : 'Новый слот');
// @ts-ignore
[slotDialogOpen, isEditMode,];
var __VLS_56;
// @ts-ignore
[];
var __VLS_50;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "space-y-4" },
});
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "space-y-1.5" },
});
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
let __VLS_59;
/** @ts-ignore @type { | typeof __VLS_components.Label | typeof __VLS_components.Label} */
Label;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({}));
const __VLS_61 = __VLS_60({}, ...__VLS_functionalComponentArgsRest(__VLS_60));
const { default: __VLS_64 } = __VLS_62.slots;
// @ts-ignore
[];
var __VLS_62;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    ...{ onInput: (...[$event]) => {
            __VLS_ctx.formStartTime = $event.target.value;
            // @ts-ignore
            [formStartTime,];
        } },
    value: (__VLS_ctx.formStartTime),
    type: "time",
    ...{ class: "border-input dark:bg-input/30 h-8 w-full rounded-lg border bg-transparent px-2.5 py-1 text-base outline-none md:text-sm" },
});
/** @type {__VLS_StyleScopedClasses['border-input']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-input/30']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "space-y-1.5" },
});
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
let __VLS_65;
/** @ts-ignore @type { | typeof __VLS_components.Label | typeof __VLS_components.Label} */
Label;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({}));
const __VLS_67 = __VLS_66({}, ...__VLS_functionalComponentArgsRest(__VLS_66));
const { default: __VLS_70 } = __VLS_68.slots;
// @ts-ignore
[formStartTime,];
var __VLS_68;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    ...{ onInput: (...[$event]) => {
            __VLS_ctx.formEndTime = $event.target.value;
            // @ts-ignore
            [formEndTime,];
        } },
    value: (__VLS_ctx.formEndTime),
    type: "time",
    ...{ class: "border-input dark:bg-input/30 h-8 w-full rounded-lg border bg-transparent px-2.5 py-1 text-base outline-none md:text-sm" },
});
/** @type {__VLS_StyleScopedClasses['border-input']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-input/30']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['md:text-sm']} */ ;
if (__VLS_ctx.formStartTime && __VLS_ctx.formEndTime) {
    if (__VLS_ctx.formStartTime >= __VLS_ctx.formEndTime) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-xs text-destructive" },
        });
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-destructive']} */ ;
    }
    else if (__VLS_ctx.checkOverlap(__VLS_ctx.formStartTime, __VLS_ctx.formEndTime).length > 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-xs text-destructive" },
        });
        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-destructive']} */ ;
        (__VLS_ctx.checkOverlap(__VLS_ctx.formStartTime, __VLS_ctx.formEndTime).join(', '));
    }
}
let __VLS_71;
/** @ts-ignore @type { | typeof __VLS_components.DialogFooter | typeof __VLS_components.DialogFooter} */
DialogFooter;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    ...{ class: "mt-4 gap-2" },
}));
const __VLS_73 = __VLS_72({
    ...{ class: "mt-4 gap-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
const { default: __VLS_76 } = __VLS_74.slots;
let __VLS_77;
/** @ts-ignore @type { | typeof __VLS_components.Button | typeof __VLS_components.Button} */
Button;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    ...{ 'onClick': {} },
    variant: "default",
    disabled: (!__VLS_ctx.formStartTime || !__VLS_ctx.formEndTime || __VLS_ctx.formStartTime >= __VLS_ctx.formEndTime || __VLS_ctx.checkOverlap(__VLS_ctx.formStartTime, __VLS_ctx.formEndTime).length > 0 || __VLS_ctx.submitting),
}));
const __VLS_79 = __VLS_78({
    ...{ 'onClick': {} },
    variant: "default",
    disabled: (!__VLS_ctx.formStartTime || !__VLS_ctx.formEndTime || __VLS_ctx.formStartTime >= __VLS_ctx.formEndTime || __VLS_ctx.checkOverlap(__VLS_ctx.formStartTime, __VLS_ctx.formEndTime).length > 0 || __VLS_ctx.submitting),
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
let __VLS_82;
const __VLS_83 = ({ click: {} },
    { onClick: (__VLS_ctx.handleSubmit) });
const { default: __VLS_84 } = __VLS_80.slots;
(__VLS_ctx.submitting ? (__VLS_ctx.isEditMode ? 'Обновление...' : 'Создание...') : (__VLS_ctx.isEditMode ? 'Обновить' : 'Создать'));
// @ts-ignore
[isEditMode, isEditMode, formStartTime, formStartTime, formStartTime, formStartTime, formStartTime, formStartTime, formStartTime, formEndTime, formEndTime, formEndTime, formEndTime, formEndTime, formEndTime, formEndTime, formEndTime, checkOverlap, checkOverlap, checkOverlap, submitting, submitting, handleSubmit,];
var __VLS_80;
var __VLS_81;
let __VLS_85;
/** @ts-ignore @type { | typeof __VLS_components.Button | typeof __VLS_components.Button} */
Button;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
    ...{ 'onClick': {} },
    variant: "outline",
}));
const __VLS_87 = __VLS_86({
    ...{ 'onClick': {} },
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
let __VLS_90;
const __VLS_91 = ({ click: {} },
    { onClick: (...[$event]) => {
            __VLS_ctx.slotDialogOpen = false;
            // @ts-ignore
            [slotDialogOpen,];
        } });
const { default: __VLS_92 } = __VLS_88.slots;
// @ts-ignore
[];
var __VLS_88;
var __VLS_89;
// @ts-ignore
[];
var __VLS_74;
// @ts-ignore
[];
var __VLS_44;
// @ts-ignore
[];
var __VLS_38;
let __VLS_93;
/** @ts-ignore @type { | typeof __VLS_components.Dialog | typeof __VLS_components.Dialog} */
Dialog;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
    open: (__VLS_ctx.deleteDialogOpen),
}));
const __VLS_95 = __VLS_94({
    open: (__VLS_ctx.deleteDialogOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
const { default: __VLS_98 } = __VLS_96.slots;
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.DialogContent | typeof __VLS_components.DialogContent} */
DialogContent;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    ...{ class: "sm:max-w-sm" },
}));
const __VLS_101 = __VLS_100({
    ...{ class: "sm:max-w-sm" },
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
/** @type {__VLS_StyleScopedClasses['sm:max-w-sm']} */ ;
const { default: __VLS_104 } = __VLS_102.slots;
let __VLS_105;
/** @ts-ignore @type { | typeof __VLS_components.DialogHeader | typeof __VLS_components.DialogHeader} */
DialogHeader;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({}));
const __VLS_107 = __VLS_106({}, ...__VLS_functionalComponentArgsRest(__VLS_106));
const { default: __VLS_110 } = __VLS_108.slots;
let __VLS_111;
/** @ts-ignore @type { | typeof __VLS_components.DialogTitle | typeof __VLS_components.DialogTitle} */
DialogTitle;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
    ...{ class: (__VLS_ctx.isDeletingBookedSlot ? 'text-destructive' : '') },
}));
const __VLS_113 = __VLS_112({
    ...{ class: (__VLS_ctx.isDeletingBookedSlot ? 'text-destructive' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
const { default: __VLS_116 } = __VLS_114.slots;
(__VLS_ctx.isDeletingBookedSlot ? 'Вы пытаетесь удалить занятый слот!' : 'Удаление слота');
// @ts-ignore
[deleteDialogOpen, isDeletingBookedSlot, isDeletingBookedSlot,];
var __VLS_114;
// @ts-ignore
[];
var __VLS_108;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "text-sm text-muted-foreground" },
});
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
(__VLS_ctx.deletingSlotLabel);
let __VLS_117;
/** @ts-ignore @type { | typeof __VLS_components.DialogFooter | typeof __VLS_components.DialogFooter} */
DialogFooter;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
    ...{ class: "mt-4 gap-2" },
}));
const __VLS_119 = __VLS_118({
    ...{ class: "mt-4 gap-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
const { default: __VLS_122 } = __VLS_120.slots;
let __VLS_123;
/** @ts-ignore @type { | typeof __VLS_components.Button | typeof __VLS_components.Button} */
Button;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
    ...{ 'onClick': {} },
    variant: "destructive",
    disabled: (__VLS_ctx.deleting),
}));
const __VLS_125 = __VLS_124({
    ...{ 'onClick': {} },
    variant: "destructive",
    disabled: (__VLS_ctx.deleting),
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
let __VLS_128;
const __VLS_129 = ({ click: {} },
    { onClick: (__VLS_ctx.handleDelete) });
const { default: __VLS_130 } = __VLS_126.slots;
(__VLS_ctx.deleting ? 'Удаление...' : 'Удалить');
// @ts-ignore
[deletingSlotLabel, deleting, deleting, handleDelete,];
var __VLS_126;
var __VLS_127;
let __VLS_131;
/** @ts-ignore @type { | typeof __VLS_components.Button | typeof __VLS_components.Button} */
Button;
// @ts-ignore
const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
    ...{ 'onClick': {} },
    variant: "outline",
}));
const __VLS_133 = __VLS_132({
    ...{ 'onClick': {} },
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_132));
let __VLS_136;
const __VLS_137 = ({ click: {} },
    { onClick: (...[$event]) => {
            __VLS_ctx.deleteDialogOpen = false;
            // @ts-ignore
            [deleteDialogOpen,];
        } });
const { default: __VLS_138 } = __VLS_134.slots;
// @ts-ignore
[];
var __VLS_134;
var __VLS_135;
// @ts-ignore
[];
var __VLS_120;
// @ts-ignore
[];
var __VLS_102;
// @ts-ignore
[];
var __VLS_96;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
