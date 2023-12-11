<script setup lang="ts">
import { toRefs, computed, ref } from '@vue/reactivity';
import { watch } from "@vue/runtime-core";
import type { PropType } from 'vue';

const emit = defineEmits(['update:open', 'confirm', 'close'])
const props = defineProps({
    mode: {
        type: String as PropType<string>,
        default: 'normal'
    },
    theme: {
        type: String as PropType<string>,
        default: 'normal'
    },
    confirmText: {
        type: String as PropType<string>,
        default: 'Konfirmasi'
    },
    closeText: {
        type: String as PropType<string>,
        default: 'Batalkan'
    },
    open: {
        type: Boolean as PropType<boolean>,
        default: false
    },
})

const { mode, theme, confirmText, closeText, open } = toRefs(props)

const color = computed(() => {
    if (theme.value == 'danger') return 'bg-fighting-1/80 hover:bg-fighting-1/90 active:bg-fighting-1'
    else if (theme.value == 'success') return 'bg-grass-1/80 hover:bg-grass-1/90 active:bg-grass-1'
    else if (theme.value == 'warning') return 'bg-electric-1/80 hover:bg-electric-1/90 active:bg-electric-1'
    else return 'bg-dragon-1/80 hover:bg-dragon-1/90 active:bg-dragon-1'
})

const buttonStyle = 'px-5 py-3 grid place-items-center text-[15px] font-semibold text-center transition duration-300 cursor-pointer rounded-lg'

const layer = ref(open.value);
watch(open, () => {
    if (open.value) layer.value = open.value;
    else {
        setTimeout(() => {
            layer.value = open.value
        }, 300)
    }
})
</script>

<template>
    <div class="panelayer" :class="{ 'is-active': layer }" @click="emit('update:open', false)"></div>
    <div class="fixed bg-white w-[calc(200px+25vw)] max-w-sm p-4 rounded-[20px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            shadow-[0_0_12px_2px] shadow-gray-400/60 transition duration-500" :class="open ? 'scale-100' : 'scale-0'">
        <slot></slot>
        <div class="flex items-center gap-2.5 mt-4" :class="{ 'flex-row-reverse': mode == 'reverse' }">
            <button class="bg-slate-200/80 hover:bg-slate-200 active:bg-slate-300 text-slate-800"
                :class="[{ 'hidden': mode == 'cancel' }, buttonStyle]" @click="emit('close'); emit('update:open', false)">{{
                    closeText }}</button>
            <button :class="[buttonStyle, color]" class="text-white" @click="emit('confirm')">{{ confirmText }}</button>
        </div>
    </div>
</template>