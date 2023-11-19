<script setup lang="ts">
import { getAssets } from ".";
import { toRefs } from "@vue/reactivity";
import type { PropType } from "vue";

const emit = defineEmits(['open'])
const props = defineProps({
    data: {
        type: Array as PropType<string[]>,
        default: []
    },
})

const { data } = toRefs(props)
</script>

<template>
    <div class="flex flex-wrap gap-4 xs:gap-5">
        <div v-for="item, idx in data" @click="emit('open', item)" class="h-32 w-full rounded-[1.1rem] overflow-hidden grow
        basis-[23rem] shadow-[0_0_6px_2px] shadow-gray-200 transition duration-[.4s] group cursor-pointer relative">
            <img :src="getAssets(`${item}.avif`)" height="32" width="368" alt="region background"
                class="object-cover object-center group-hover:scale-[1.05] w-full h-full transition duration-500">
            <div class="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20"></div>
            <div class="absolute inset-0 flex items-center justify-between px-6 py-4 gap-6">
                <div class="text-white [&>*]:whitespace-nowrap">
                    <h3 class="text-lg xx:text-xl font-bold capitalize">{{ item }}</h3>
                    <span class="text-sm xx:text-base">Generasi ke-{{ idx + 1 }}</span>
                </div>
                <div class="flex flex-wrap items-center justify-end w-48">
                    <img v-for="i in 3" :src="getAssets(`${item}-0${i}.avif`)" height="64" width="64"
                        class="w-8 h-8 xx:w-12 xx:h-12 xs:w-16 xs:h-16" alt="occupants">
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>