/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { reactiveOmit } from '@vueuse/core';
import { ChevronDownIcon } from 'lucide-vue-next';
import { SelectScrollDownButton, useForwardProps } from 'reka-ui';
import { cn } from '@/lib/utils';
const props = defineProps();
const delegatedProps = reactiveOmit(props, 'class');
const forwardedProps = useForwardProps(delegatedProps);
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.SelectScrollDownButton | typeof __VLS_components.SelectScrollDownButton} */
SelectScrollDownButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    dataSlot: "select-scroll-down-button",
    ...(__VLS_ctx.forwardedProps),
    ...{ class: (__VLS_ctx.cn('bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*=size-])]:size-4', props.class)) },
}));
const __VLS_2 = __VLS_1({
    dataSlot: "select-scroll-down-button",
    ...(__VLS_ctx.forwardedProps),
    ...{ class: (__VLS_ctx.cn('bg-popover z-10 flex cursor-default items-center justify-center py-1 [&_svg:not([class*=size-])]:size-4', props.class)) },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
var __VLS_7 = {};
let __VLS_9;
/** @ts-ignore @type { | typeof __VLS_components.ChevronDownIcon} */
ChevronDownIcon;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({}));
const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
// @ts-ignore
[forwardedProps, cn,];
var __VLS_3;
// @ts-ignore
var __VLS_8 = __VLS_7;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    __typeProps: {},
});
const __VLS_export = {};
export default {};
