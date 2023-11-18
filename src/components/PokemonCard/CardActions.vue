<script setup lang="ts">
import { toRefs } from '@vue/reactivity';
import Spinner from "../Spinner.vue";
import type { PokemonCardAction } from '@/types';
import type { PropType } from 'vue';

const emit = defineEmits(['action'])
const props = defineProps({
    actions: {
        type: Array as PropType<PokemonCardAction[]>,
        default: []
    },
    index: {
        type: Number as PropType<number>,
        default: 0
    }
})

const { actions, index } = toRefs(props)

const actColor = (color: { init: string, hover: string }) => `bg-${color.init} hover:bg-${color.hover} active:bg-${color.init}`
</script>

<template>
    <div v-if="actions.length > 0" :style="{ width: `${4 * Math.ceil(actions.length / 2)}rem` }"
        class="absolute inset-y-0 right-0 z-0 flex flex-col flex-wrap justify-center rounded-r-2xl overflow-hidden">
        <button v-for="act in actions" :class="actColor(act.color)" @click="emit('action', { label: act.label, index })"
            class="w-16 h-16 transition duration-[.4s] grid place-items-center grow cursor-pointer shadow-[.1rem_0_1px_1px] shadow-gray-100">
            <Spinner v-if="act.load && act.load[index]" :width="24" fill="!fill-white !stroke-white" />
            <component v-else :is="act.icon" height="24" width="24" color="white" stroke-width="2"></component>
        </button>
    </div>
</template>