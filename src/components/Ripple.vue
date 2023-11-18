<script setup lang="ts">
import { toRefs } from "@vue/reactivity";
import type { PropType } from "vue";

const emit = defineEmits(['rippleEnd'])
const props = defineProps({
    modelValue: {
        type: Array as PropType<{ x: number, y: number, show: boolean }[]>,
        default: []
    },
    color: {
        type: String as PropType<string>,
        default: '#d7d8da'
    }
})

const { modelValue } = toRefs(props)
</script>

<template>
    <section v-for="val, k in modelValue" :key="k" class="w-1.5 h-1.5 absolute z-0 rounded-full"
        :style="{ top: val.y + 'px', left: val.x + 'px' }" :class="`bg-${color}`" @animationend="emit('rippleEnd', k)">
    </section>
</template>

<style scoped>
section {
    animation: ripple 1250ms ease-out forwards, fade 1500ms ease-out forwards;
}

@keyframes ripple {
    0% {
        transform: translate(-100%, -100%);
        opacity: 0.5;
    }

    100% {
        transform: translate(-100%, -100%) scale(50);
        opacity: 0;
    }
}

@keyframes fade {
    0% {
        opacity: 0.5;
    }

    100% {
        opacity: 0;
    }
}
</style>