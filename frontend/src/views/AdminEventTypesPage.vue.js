/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted } from 'vue';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
const eventTypes = ref([]);
const loading = ref(true);
onMounted(async () => {
    try {
        eventTypes.value = await api.eventTypes.list();
    }
    finally {
        loading.value = false;
    }
});
const dialogOpen = ref(false);
const editingItem = ref(null);
const isCreate = ref(true);
const submitting = ref(false);
const formId = ref('');
const formName = ref('');
const formDescription = ref('');
const formDuration = ref(15);
function openCreate() {
    isCreate.value = true;
    editingItem.value = null;
    formId.value = '';
    formName.value = '';
    formDescription.value = '';
    formDuration.value = 15;
    dialogOpen.value = true;
}
function openEdit(item) {
    isCreate.value = false;
    editingItem.value = item;
    formId.value = item.id;
    formName.value = item.name;
    formDescription.value = item.description;
    formDuration.value = item.duration;
    dialogOpen.value = true;
}
async function handleSubmit() {
    submitting.value = true;
    try {
        if (isCreate.value) {
            await api.eventTypes.create({
                id: formId.value,
                name: formName.value,
                description: formDescription.value,
                duration: formDuration.value,
            });
        }
        else {
            await api.eventTypes.update(formId.value, {
                name: formName.value,
                description: formDescription.value,
                duration: formDuration.value,
            });
        }
        dialogOpen.value = false;
        eventTypes.value = await api.eventTypes.list();
    }
    catch {
        // ошибка
    }
    finally {
        submitting.value = false;
    }
}
async function handleDelete() {
    if (!editingItem.value)
        return;
    submitting.value = true;
    try {
        await api.eventTypes.delete(editingItem.value.id);
        dialogOpen.value = false;
        eventTypes.value = await api.eventTypes.list();
    }
    catch {
        // ошибка
    }
    finally {
        submitting.value = false;
    }
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex items-center justify-between mb-6" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-6']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "text-2xl font-bold" },
});
/** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.Button | typeof __VLS_components.Button} */
Button;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = ({ click: {} },
    { onClick: (__VLS_ctx.openCreate) });
const { default: __VLS_7 } = __VLS_3.slots;
// @ts-ignore
[openCreate,];
var __VLS_3;
var __VLS_4;
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
        ...{ class: "space-y-3" },
    });
    /** @type {__VLS_StyleScopedClasses['space-y-3']} */ ;
    for (const [et] of __VLS_vFor((__VLS_ctx.eventTypes))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (et.id),
            ...{ class: "rounded-lg border bg-card text-card-foreground px-4 py-3 flex items-center justify-between" },
        });
        /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-card']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-card-foreground']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-1 min-w-0" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "font-medium" },
        });
        /** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
        (et.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "text-sm text-muted-foreground truncate" },
        });
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
        /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
        (et.description);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex items-center gap-2 shrink-0 ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "text-sm text-muted-foreground font-mono tabular-nums" },
        });
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-muted-foreground']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
        /** @type {__VLS_StyleScopedClasses['tabular-nums']} */ ;
        (et.duration);
        let __VLS_8;
        /** @ts-ignore @type { | typeof __VLS_components.Button | typeof __VLS_components.Button} */
        Button;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
            ...{ 'onClick': {} },
            variant: "outline",
            size: "sm",
        }));
        const __VLS_10 = __VLS_9({
            ...{ 'onClick': {} },
            variant: "outline",
            size: "sm",
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        let __VLS_13;
        const __VLS_14 = ({ click: {} },
            { onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.loading))
                        return;
                    __VLS_ctx.openEdit(et);
                    // @ts-ignore
                    [loading, eventTypes, openEdit,];
                } });
        const { default: __VLS_15 } = __VLS_11.slots;
        // @ts-ignore
        [];
        var __VLS_11;
        var __VLS_12;
        // @ts-ignore
        [];
    }
}
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.Dialog | typeof __VLS_components.Dialog} */
Dialog;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    open: (__VLS_ctx.dialogOpen),
}));
const __VLS_18 = __VLS_17({
    open: (__VLS_ctx.dialogOpen),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const { default: __VLS_21 } = __VLS_19.slots;
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.DialogContent | typeof __VLS_components.DialogContent} */
DialogContent;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    ...{ class: "sm:max-w-md" },
}));
const __VLS_24 = __VLS_23({
    ...{ class: "sm:max-w-md" },
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
/** @type {__VLS_StyleScopedClasses['sm:max-w-md']} */ ;
const { default: __VLS_27 } = __VLS_25.slots;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.DialogHeader | typeof __VLS_components.DialogHeader} */
DialogHeader;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_33 } = __VLS_31.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.DialogTitle | typeof __VLS_components.DialogTitle} */
DialogTitle;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({}));
const __VLS_36 = __VLS_35({}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_39 } = __VLS_37.slots;
(__VLS_ctx.isCreate ? 'Новый тип события' : 'Редактирование типа события');
// @ts-ignore
[dialogOpen, isCreate,];
var __VLS_37;
// @ts-ignore
[];
var __VLS_31;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "space-y-4" },
});
/** @type {__VLS_StyleScopedClasses['space-y-4']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "space-y-1.5" },
});
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.Label | typeof __VLS_components.Label} */
Label;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({}));
const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const { default: __VLS_45 } = __VLS_43.slots;
// @ts-ignore
[];
var __VLS_43;
let __VLS_46;
/** @ts-ignore @type { | typeof __VLS_components.Input} */
Input;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
    modelValue: (__VLS_ctx.formId),
    placeholder: "Уникальный идентификатор",
}));
const __VLS_48 = __VLS_47({
    modelValue: (__VLS_ctx.formId),
    placeholder: "Уникальный идентификатор",
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "space-y-1.5" },
});
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.Label | typeof __VLS_components.Label} */
Label;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({}));
const __VLS_53 = __VLS_52({}, ...__VLS_functionalComponentArgsRest(__VLS_52));
const { default: __VLS_56 } = __VLS_54.slots;
// @ts-ignore
[formId,];
var __VLS_54;
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.Input} */
Input;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    modelValue: (__VLS_ctx.formName),
    placeholder: "Например: Быстрая встреча",
}));
const __VLS_59 = __VLS_58({
    modelValue: (__VLS_ctx.formName),
    placeholder: "Например: Быстрая встреча",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "space-y-1.5" },
});
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.Label | typeof __VLS_components.Label} */
Label;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({}));
const __VLS_64 = __VLS_63({}, ...__VLS_functionalComponentArgsRest(__VLS_63));
const { default: __VLS_67 } = __VLS_65.slots;
// @ts-ignore
[formName,];
var __VLS_65;
let __VLS_68;
/** @ts-ignore @type { | typeof __VLS_components.Input} */
Input;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
    modelValue: (__VLS_ctx.formDescription),
    placeholder: "Описание типа встречи",
}));
const __VLS_70 = __VLS_69({
    modelValue: (__VLS_ctx.formDescription),
    placeholder: "Описание типа встречи",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "space-y-1.5" },
});
/** @type {__VLS_StyleScopedClasses['space-y-1.5']} */ ;
let __VLS_73;
/** @ts-ignore @type { | typeof __VLS_components.Label | typeof __VLS_components.Label} */
Label;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({}));
const __VLS_75 = __VLS_74({}, ...__VLS_functionalComponentArgsRest(__VLS_74));
const { default: __VLS_78 } = __VLS_76.slots;
// @ts-ignore
[formDescription,];
var __VLS_76;
let __VLS_79;
/** @ts-ignore @type { | typeof __VLS_components.Input} */
Input;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
    modelValue: (__VLS_ctx.formDuration),
    modelModifiers: { number: true, },
    type: "number",
    min: "5",
    step: "5",
}));
const __VLS_81 = __VLS_80({
    modelValue: (__VLS_ctx.formDuration),
    modelModifiers: { number: true, },
    type: "number",
    min: "5",
    step: "5",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
let __VLS_84;
/** @ts-ignore @type { | typeof __VLS_components.DialogFooter | typeof __VLS_components.DialogFooter} */
DialogFooter;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
    ...{ class: "mt-4 gap-2" },
}));
const __VLS_86 = __VLS_85({
    ...{ class: "mt-4 gap-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
const { default: __VLS_89 } = __VLS_87.slots;
if (__VLS_ctx.isCreate) {
    let __VLS_90;
    /** @ts-ignore @type { | typeof __VLS_components.Button | typeof __VLS_components.Button} */
    Button;
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
        ...{ 'onClick': {} },
        variant: "default",
        disabled: (__VLS_ctx.submitting),
    }));
    const __VLS_92 = __VLS_91({
        ...{ 'onClick': {} },
        variant: "default",
        disabled: (__VLS_ctx.submitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_91));
    let __VLS_95;
    const __VLS_96 = ({ click: {} },
        { onClick: (__VLS_ctx.handleSubmit) });
    const { default: __VLS_97 } = __VLS_93.slots;
    (__VLS_ctx.submitting ? 'Создание...' : 'Создать');
    // @ts-ignore
    [isCreate, formDuration, submitting, submitting, handleSubmit,];
    var __VLS_93;
    var __VLS_94;
}
else {
    let __VLS_98;
    /** @ts-ignore @type { | typeof __VLS_components.Button | typeof __VLS_components.Button} */
    Button;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
        ...{ 'onClick': {} },
        variant: "default",
        disabled: (__VLS_ctx.submitting),
    }));
    const __VLS_100 = __VLS_99({
        ...{ 'onClick': {} },
        variant: "default",
        disabled: (__VLS_ctx.submitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    let __VLS_103;
    const __VLS_104 = ({ click: {} },
        { onClick: (__VLS_ctx.handleSubmit) });
    const { default: __VLS_105 } = __VLS_101.slots;
    (__VLS_ctx.submitting ? 'Обновление...' : 'Обновить');
    // @ts-ignore
    [submitting, submitting, handleSubmit,];
    var __VLS_101;
    var __VLS_102;
    let __VLS_106;
    /** @ts-ignore @type { | typeof __VLS_components.Button | typeof __VLS_components.Button} */
    Button;
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
        ...{ 'onClick': {} },
        variant: "destructive",
        disabled: (__VLS_ctx.submitting),
    }));
    const __VLS_108 = __VLS_107({
        ...{ 'onClick': {} },
        variant: "destructive",
        disabled: (__VLS_ctx.submitting),
    }, ...__VLS_functionalComponentArgsRest(__VLS_107));
    let __VLS_111;
    const __VLS_112 = ({ click: {} },
        { onClick: (__VLS_ctx.handleDelete) });
    const { default: __VLS_113 } = __VLS_109.slots;
    (__VLS_ctx.submitting ? 'Удаление...' : 'Удалить');
    // @ts-ignore
    [submitting, submitting, handleDelete,];
    var __VLS_109;
    var __VLS_110;
}
let __VLS_114;
/** @ts-ignore @type { | typeof __VLS_components.Button | typeof __VLS_components.Button} */
Button;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
    ...{ 'onClick': {} },
    variant: "outline",
}));
const __VLS_116 = __VLS_115({
    ...{ 'onClick': {} },
    variant: "outline",
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
let __VLS_119;
const __VLS_120 = ({ click: {} },
    { onClick: (...[$event]) => {
            __VLS_ctx.dialogOpen = false;
            // @ts-ignore
            [dialogOpen,];
        } });
const { default: __VLS_121 } = __VLS_117.slots;
// @ts-ignore
[];
var __VLS_117;
var __VLS_118;
// @ts-ignore
[];
var __VLS_87;
// @ts-ignore
[];
var __VLS_25;
// @ts-ignore
[];
var __VLS_19;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
