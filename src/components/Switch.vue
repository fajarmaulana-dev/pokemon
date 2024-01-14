<script setup lang="ts">
import { toRefs, ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import type { PropType } from "vue";

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    disabled: {
        type: Boolean as PropType<boolean>,
        default: false
    }
})

const { modelValue, disabled } = toRefs(props)

const onModel = () => emit('update:modelValue', !modelValue.value)
const color = (col: string) => disabled.value ? `bg-${col}-300` : `bg-${col}-400 group-hover:bg-${col}-500 group-active:bg-${col}-600`
const delay = ref(false)
watch(modelValue, () => {
    delay.value = true;
    setTimeout(() => { delay.value = false }, 700)
})
</script>

<template>
    <button :disabled="disabled || delay" aria-label="switch" @click="onModel"
        class="relative w-fit flex items-center group cursor-pointer border-none bg-transparent">
        <div class="w-[54px] h-4 rounded-lg transition-colors duration-700"
            :class="`bg-${modelValue ? 'rose' : 'slate'}-${disabled ? '100' : '200'}`">
        </div>
        <span style="transition: left .7s, background-color .4s;" class="absolute w-6 h-6 rounded-full"
            :class="[color(modelValue ? 'rose' : 'slate'), modelValue ? 'left-[calc(100%-1.5rem)]' : 'left-0']"></span>
    </button>
</template>