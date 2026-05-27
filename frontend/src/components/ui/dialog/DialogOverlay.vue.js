/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { reactiveOmit } from '@vueuse/core';
import { DialogOverlay } from 'reka-ui';
import { cn } from '@/lib/utils';
const props = defineProps();
const delegatedProps = reactiveOmit(props, 'class');
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
/** @ts-ignore @type { | typeof __VLS_components.DialogOverlay | typeof __VLS_components.DialogOverlay} */
DialogOverlay;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    dataSlot: "dialog-overlay",
    ...(__VLS_ctx.delegatedProps),
    ...{ class: (__VLS_ctx.cn('data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 isolate z-50', props.class)) },
}));
const __VLS_2 = __VLS_1({
    dataSlot: "dialog-overlay",
    ...(__VLS_ctx.delegatedProps),
    ...{ class: (__VLS_ctx.cn('data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 isolate z-50', props.class)) },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
var __VLS_7 = {};
// @ts-ignore
[delegatedProps, cn,];
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
