<script setup lang="ts">
import { slider, overflowHandler } from ".";
import { ref, toRefs } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import type { PropType } from "vue";

const emit = defineEmits(['update:open', 'afterClose'])
const props = defineProps({
    open: {
        type: Boolean as PropType<boolean>,
        default: false
    },
})

const { open } = toRefs(props)

watch(open, () => {
    open.value ? overflowHandler('hidden') : (overflowHandler('auto'), emit('afterClose'))
})

const yStart = ref(0)
const yEnd = ref(0)
const movement = ref(0)
const grab = ref(false)

const startSlide = (e: any, param: { mobile?: boolean } = { mobile: false }) => {
    yStart.value = slider(e, param.mobile, 'Y')
    grab.value = true
}

const endSlide = (e: any, param: { mobile?: boolean } = { mobile: false }) => {
    grab.value = false
    yEnd.value = slider(e, param.mobile, 'Y')
    if (yStart.value < yEnd.value && (yEnd.value - yStart.value > 64)) emit("update:open", false)
    movement.value = 0
}

const moveSlide = (e: any, param: { mobile: boolean } = { mobile: false }) => {
    movement.value = slider(e, param.mobile, 'Y') - yStart.value;
}
</script>

<template>
    <div class="panelayer" :class="{ 'is-active': open }" @click="emit('update:open', false)"></div>
    <div class="fixed bottom-0 bg-white w-full rounded-t-3xl transition select-none py-5 flex flex-col gap-2"
        :class="grab ? 'cursor-grabbing duration-0' : 'cursor-grab duration-500'" @mousedown="startSlide($event)"
        @mouseup="endSlide($event)" @touchstart.passive="startSlide($event, { mobile: true })"
        @touchend="endSlide($event, { mobile: true })" @mousemove="grab ? moveSlide($event) : false"
        @touchmove.passive="moveSlide($event, { mobile: true })"
        :style="{ transform: `translateY(${open ? `${movement > 0 ? movement : 0}px` : '100%'})` }">
        <div class="paneline"></div>
        <slot></slot>
    </div>
</template>