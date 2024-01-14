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
        type: Function as PropType<(props: SVGAttributes) => any> || null,
        default: null
    },
    appendIcon: {
        type: Function as PropType<(props: SVGAttributes) => any> || null,
        default: null
    },
    fullText: {
        type: Boolean as PropType<boolean>,
        default: false
    }
})

const { modelValue, id, name, placeholder, forPassword, prependIcon, appendIcon, disabled, invalid, readonly, fullText } = toRefs(props)
const onDisabled = computed(() => disabled.value ? 'bg-slate-300 cursor-not-allowed' : 'bg-white')
const onInvalid = computed(() => {
    if (invalid.value) return 'border-fill-1/80 hover:border-fill-1/90 focus:border-fill-1'
    else return 'border-slate-500/80 hover:border-slate-500/90 focus:border-slate-600/90'
})

const iconStyle = 'h-[18px] w-[18px] [&>*]:stroke-[3] [&>*]:stroke-slate-500/90'
const onModel = ({ target }: any) => emit('update:modelValue', target.value)
const inputStyle = computed(() => [appendIcon.value == null ? 'pr-3' : 'pr-9', prependIcon.value == null ? 'pl-3' : 'pl-9', onDisabled.value, onInvalid.value, { 'max-w-[480px] xs:focus:w-80 sm:w-full sm:focus:w-full md:min-w-full': !fullText.value }])
</script>

<template>
    <div class="relative w-full [&>i]:absolute [&>i]:text-slate-500/90 overflow-hidden rounded-[20px]">
        <input :id="id" :type="forPassword ? 'password' : 'text'" :readonly="readonly" :disabled="disabled" :name="name"
            @focus="emit('onFocus')" @blur="emit('onBlur')" @keyup.enter="emit('onEnter')" :value="modelValue"
            spellcheck="false" :placeholder="placeholder" @input="onModel" :class="inputStyle" autocomplete="new-password"
            class="h-[40px] w-full outline-none border-2 transition duration-1000 pr-3 pl-9 rounded-full text-[15px] text-slate-800" />
        <i class="left-3 pointer-events-none top-[calc(50%-9px)]" v-if="prependIcon !== null">
            <component :is="prependIcon" :class="iconStyle"></component>
        </i>
        <i v-if="appendIcon !== null" @click="emit('appendClick')" class="group right-0 transition duration-300 cursor-pointer
            flex items-center justify-center inset-y-0 w-10">
            <component :is="appendIcon" :class="iconStyle"
                class="[&>*]:transition [&>*]:duration-[.4s] group-hover:[&>*]:stroke-slate-500 group-active:[&>*]:stroke-slate-500/90">
            </component>
        </i>
    </div>
</template>