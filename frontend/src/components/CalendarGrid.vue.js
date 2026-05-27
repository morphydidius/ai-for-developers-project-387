/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { cn } from '@/lib/utils';
const props = defineProps();
const emit = defineEmits();
const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
function localDateStr(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayIso = localDateStr(today);
const rangeEnd = new Date(today);
rangeEnd.setDate(rangeEnd.getDate() + 13);
const rangeEndIso = localDateStr(rangeEnd);
const gridStart = new Date(today);
const dow = gridStart.getDay();
gridStart.setDate(gridStart.getDate() + (dow === 0 ? -6 : 1 - dow));
const gridEnd = new Date(rangeEnd);
const endDow = gridEnd.getDay();
gridEnd.setDate(gridEnd.getDate() + (endDow === 0 ? 0 : 7 - endDow));
const days = computed(() => {
    const result = [];
    const cur = new Date(gridStart);
    while (cur <= gridEnd) {
        result.push({ date: new Date(cur), day: cur.getDate(), iso: localDateStr(cur) });
        cur.setDate(cur.getDate() + 1);
    }
    return result;
});
const datesWithSlots = computed(() => {
    const set = new Set();
    for (const s of props.slots) {
        set.add(s.startTime.slice(0, 10));
    }
    return set;
});
function hasSlots(iso) {
    return datesWithSlots.value.has(iso);
}
function isPast(iso) {
    return iso < todayIso;
}
function isBeyond(iso) {
    return iso > rangeEndIso;
}
function isSelected(iso) {
    return props.modelValue ? localDateStr(props.modelValue) === iso : false;
}
function isToday(iso) {
    return todayIso === iso;
}
function isBlocked(iso) {
    return isPast(iso) || isBeyond(iso);
}
function select(date) {
    if (!isBlocked(localDateStr(date))) {
        emit('update:modelValue', date);
    }
}
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-1" },
});
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-7']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-1']} */ ;
for (const [d] of __VLS_vFor((__VLS_ctx.dayNames))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (d),
    });
    (d);
    // @ts-ignore
    [dayNames,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "grid grid-cols-7 gap-1" },
});
/** @type {__VLS_StyleScopedClasses['grid']} */ ;
/** @type {__VLS_StyleScopedClasses['grid-cols-7']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
for (const [day] of __VLS_vFor((__VLS_ctx.days))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.select(day.date);
                // @ts-ignore
                [days, select,];
            } },
        key: (day.iso),
        'data-testid': (`day-${day.iso}`),
        type: "button",
        disabled: (__VLS_ctx.isBlocked(day.iso) || !__VLS_ctx.hasSlots(day.iso)),
        ...{ class: (__VLS_ctx.cn('rounded-md text-sm py-2 transition-colors', __VLS_ctx.isBlocked(day.iso) && 'text-muted-foreground/30 cursor-not-allowed', !__VLS_ctx.isBlocked(day.iso) && !__VLS_ctx.hasSlots(day.iso) && 'text-muted-foreground/40 cursor-not-allowed', !__VLS_ctx.isBlocked(day.iso) && __VLS_ctx.hasSlots(day.iso) && !__VLS_ctx.isSelected(day.iso) && 'hover:bg-accent cursor-pointer', __VLS_ctx.isSelected(day.iso) && 'bg-primary text-primary-foreground', __VLS_ctx.isToday(day.iso) && !__VLS_ctx.isSelected(day.iso) && 'ring-1 ring-inset ring-primary', !__VLS_ctx.isBlocked(day.iso) && __VLS_ctx.hasSlots(day.iso) && !__VLS_ctx.isSelected(day.iso) && !__VLS_ctx.isToday(day.iso) && 'bg-muted/50')) },
    });
    (day.day);
    // @ts-ignore
    [isBlocked, isBlocked, isBlocked, isBlocked, isBlocked, hasSlots, hasSlots, hasSlots, hasSlots, cn, isSelected, isSelected, isSelected, isSelected, isToday, isToday,];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
