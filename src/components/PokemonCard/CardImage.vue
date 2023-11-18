<script setup lang="ts">
import { toRefs, computed, ref } from '@vue/reactivity';
import type { PropType } from 'vue';
import type { PokemonCard } from "../../types"
import { HeartSolid } from "@iconoir/vue";
import { getAssets, imageSource } from "..";
import Spinner from "../Spinner.vue";

const emit = defineEmits(['startTouch', 'endTouch', 'heart'])
const props = defineProps({
    data: {
        type: Object as PropType<PokemonCard>,
        default: {}
    },
    heart: {
        type: Array as PropType<{ id: string, state: boolean }[]>,
        default: []
    },
    index: {
        type: Number as PropType<number>,
        default: 0
    },
    loading: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    grab: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    actionLength: {
        type: Number as PropType<number>,
        default: 0
    }
})

const { data, heart, index, loading, grab, actionLength } = toRefs(props)

const bgIcon = computed(() => ['flying', 'rock', 'ground'].includes(data.value.types[0]) ? 6 : 7)
const imageCursor = computed(() => actionLength.value == 0 ? 'cursor-default' : grab.value ? 'cursor-grabbing' : 'cursor-grab')
</script>

<template>
    <div class="relative grid place-items-center h-32 w-36 rounded-[.95rem]"
        :class="[`bg-${data.types[0]}-1`, imageCursor]">
        <i :class="{ 'is-marked': heart[index].state }" @click="emit('heart')" class="absolute top-2 right-2
            w-8 h-8 grid place-items-center border-[1px] border-white/80 rounded-full bg-white/20 backdrop-blur
            cursor-pointer z-[1]" v-if="heart.length > 0">
            <Spinner v-if="loading" :width="18" fill="!fill-white !stroke-white" />
            <HeartSolid v-else height="18" width="18" stroke-width="2" />
        </i>
        <div class="relative grid place-items-center h-full w-full [&>*]:pointer-events-none"
            @touchend="e => emit('endTouch', { e, mobile: true })"
            @touchstart.passive="e => emit('startTouch', { e, mobile: true })"
            @mouseup="e => emit('endTouch', { e, mobile: false })"
            @mousedown="e => emit('startTouch', { e, mobile: false })">
            <img :src="imageSource(data.image)" alt="pokemon-image" height="80" class="absolute max-h-20 max-w-20">
            <img :src="getAssets(`${data.types[0]}.avif`)" alt="type-icon" :style="{ maxHeight: `${bgIcon}rem` }">
        </div>
    </div>
</template>

<style scoped>
i:deep(svg) {
    transition: .4s;
}

i:hover :deep(svg) {
    transform: scale(1.1);
}

i:active :deep(svg) {
    transform: scale(.9);
}

i:deep(path) {
    fill: transparent;
    stroke: white;
    transition: .4s;
}

.is-marked:deep(path) {
    fill: #CD3131;
}
</style>