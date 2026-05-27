/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, onMounted } from 'vue';
import { api } from '@/api/client';
function isoToLocalTime(iso) {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
function formatDateLabel(date) {
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        weekday: 'short',
    });
}
const slots = ref([]);
const events = ref([]);
const loading = ref(true);
onMounted(async () => {
    try {
        const [sls, evs] = await Promise.all([
            api.slots.list(),
            api.events.list(),
        ]);
        slots.value = sls;
        events.value = evs;
    }
    catch {
        // данные остаются пустыми
    }
    finally {
        loading.value = false;
    }
});
const bookedSlotIds = computed(() => new Set(events.value.map((e) => e.slotId)));
function eventsForSlot(slotId) {
    return events.value.filter((e) => e.slotId === slotId);
}
const dayGroups = computed(() => {
    const map = new Map();
    for (const s of slots.value) {
        const iso = s.startTime.slice(0, 10);
        if (!map.has(iso))
            map.set(iso, []);
        map.get(iso).push(s);
    }
    const groups = [];
    for (const [iso, daySlots] of map) {
        const d = new Date(daySlots[0].startTime);
        groups.push({
            date: d,
            label: formatDateLabel(d),
            iso,
            slots: daySlots,
        });
    }
    return groups.sort((a, b) => a.iso.localeCompare(b.iso));
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "text-2xl font-bold mb-6" },
});
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-muted-foreground text-sm py-8 text-center" },
    });
    /** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
}
else if (__VLS_ctx.dayGroups.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-muted-foreground text-sm" },
    });
    /** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "space-y-6" },
    });
    /** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
    for (const [group] of __VLS_vFor((__VLS_ctx.dayGroups))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (group.iso),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
            ...{ class: "text-sm font-medium text-muted-foreground mb-2" },
        });
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
        (group.label);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "space-y-2" },
        });
        /** @type {__VLS_StyleScopedClasses['space-y-2']} */ ;
        for (const [slot] of __VLS_vFor((group.slots))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                key: (slot.id),
                ...{ class: ([
                        'rounded-lg border px-4 py-3 text-sm transition-colors',
                        __VLS_ctx.bookedSlotIds.has(slot.id)
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-green-50 border-green-200',
                    ]) },
            });
            /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
            /** @type {__VLS_StyleScopedClasses['border']} */ ;
            /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex items-center gap-3" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "font-mono tabular-nums" },
            });
            /** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
            /** @type {__VLS_StyleScopedClasses['tabular-nums']} */ ;
            (__VLS_ctx.isoToLocalTime(slot.startTime));
            (__VLS_ctx.isoToLocalTime(slot.endTime));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: ([
                        'text-xs font-medium px-2 py-0.5 rounded-full',
                        __VLS_ctx.bookedSlotIds.has(slot.id)
                            ? 'bg-amber-200 text-amber-800'
                            : 'bg-green-200 text-green-800',
                    ]) },
            });
            /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
            /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
            /** @type {__VLS_StyleScopedClasses['px-2']} */ ;
            /** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
            /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
            (__VLS_ctx.bookedSlotIds.has(slot.id) ? 'Занято' : 'Свободно');
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
                    (__VLS_ctx.isoToLocalTime(ev.startTime));
                    (__VLS_ctx.isoToLocalTime(ev.endTime));
                    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                        ...{ class: "font-medium" },
                    });
                    /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
                    (ev.guestName);
                    // @ts-ignore
                    [loading, dayGroups, dayGroups, bookedSlotIds, bookedSlotIds, bookedSlotIds, bookedSlotIds, isoToLocalTime, isoToLocalTime, isoToLocalTime, isoToLocalTime, eventsForSlot,];
                }
            }
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
    }
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
