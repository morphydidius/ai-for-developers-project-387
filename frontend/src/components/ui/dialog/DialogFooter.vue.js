/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { DialogClose } from 'reka-ui';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
const props = withDefaults(defineProps(), {
    showCloseButton: false,
});
const __VLS_defaults = {
    showCloseButton: false,
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    'data-slot': "dialog-footer",
    ...{ class: (__VLS_ctx.cn('bg-muted/50 -mx-4 -mb-4 rounded-b-xl border-t p-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', props.class)) },
});
var __VLS_0 = {};
if (__VLS_ctx.showCloseButton) {
    let __VLS_2;
    /** @ts-ignore @type { | typeof __VLS_components.DialogClose | typeof __VLS_components.DialogClose} */
    DialogClose;
    // @ts-ignore
    const __VLS_3 = __VLS_asFunctionalComponent1(__VLS_2, new __VLS_2({
        asChild: true,
    }));
    const __VLS_4 = __VLS_3({
        asChild: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_3));
    const { default: __VLS_7 } = __VLS_5.slots;
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.Button | typeof __VLS_components.Button} */
    Button;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        variant: "outline",
    }));
    const __VLS_10 = __VLS_9({
        variant: "outline",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    const { default: __VLS_13 } = __VLS_11.slots;
    // @ts-ignore
    [cn, showCloseButton,];
    var __VLS_11;
    // @ts-ignore
    [];
    var __VLS_5;
}
// @ts-ignore
var __VLS_1 = __VLS_0;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
const __VLS_export = {};
export default {};
