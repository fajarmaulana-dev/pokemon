<script setup lang="ts">
import { toRefs, computed } from "@vue/reactivity";
import type { PropType, SVGAttributes } from "vue";

const emit = defineEmits(['update:modelValue', 'appendClick', 'onEnter', 'onFocus', 'onBlur']);
const props = defineProps({
    modelValue: {
        type: String as PropType<string>,
        default: ''
    },
    id: String,
    name: {
        type: String as PropType<string>,
        default: '',
    },
    placeholder: {
        type: String as PropType<string>,
        default: 'Nama',
    },
    forPassword: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    disabled: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    invalid: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    readonly: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    prependIcon: {
        type: Object as PropType<(props: SVGAttributes) => any>,
        default: null
    },
    appendIcon: {
        type: Object as PropType<(props: SVGAttributes) => any>,
        default: null
    }
})

const { modelValue, id, name, placeholder, forPassword, prependIcon, appendIcon, disabled, invalid, readonly } = toRefs(props)
const onDisabled = computed(() => disabled.value ? 'bg-slate-300' : 'bg-white')
const onInvalid = computed(() => {
    if (invalid.value) return 'border-rose-500/80 hover:border-rose-500/90 focus:border-rose-600/90'
    else return 'border-slate-500/80 hover:border-slate-500/90 focus:border-slate-600/90'
})
</script>

<template>
    <div class="relative w-full [&>i]:absolute [&>i]:text-slate-500/90 overflow-hidden rounded-[20px]">
        <input :id="id" :type="forPassword ? 'password' : 'text'" :readonly="readonly" :disabled="disabled" :name="name"
            @focus="emit('onFocus')" @blur="emit('onBlur')" @keyup.enter="emit('onEnter')" :value="modelValue"
            spellcheck="false" :placeholder="placeholder"
            @input="({ target }: any) => emit('update:modelValue', target.value)"
            :class="[appendIcon == null ? 'pr-3' : 'pr-9', prependIcon == null ? 'pl-3' : 'pl-9', onDisabled, onInvalid]"
            class="h-[40px] w-full max-w-[480px] xs:focus:w-80 sm:w-full sm:focus:w-full outline-none border-2 transition
            duration-1000 pr-3 pl-9 rounded-full text-[15px] text-slate-800" />
        <i class="left-3 pointer-events-none top-[calc(50%-9px)]" v-if="prependIcon !== null">
            <component :is="prependIcon" color="rgba(100,116,139,0.9)" height="18" width="18" stroke-width="3"></component>
        </i>
        <i v-if="appendIcon !== null" @click="emit('appendClick')" class="append right-0 transition duration-300 cursor-pointer
            flex items-center justify-center inset-y-0 w-10">
            <component :is="appendIcon" height="18" width="18" stroke-width="3"></component>
        </i>
    </div>
</template>

<style scoped>
.append:deep(path) {
    stroke: rgba(100, 116, 139, 0.9);
    transition: .4s;
}

.append:hover :deep(path) {
    stroke: rgb(100, 116, 139);
}

.append:active :deep(path) {
    stroke: rgba(100, 116, 139, 0.9);
}
</style>