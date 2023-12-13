<script setup lang="ts">
import Spinner from '../Spinner.vue';
import { Heart, InfoCircle } from 'iconoir-vue/regular';
import { imageSource } from '..';
import { toRefs } from "@vue/reactivity";
import type { PropType } from 'vue';

const emit = defineEmits(['heart', 'catch'])
const props = defineProps({
    favourite: {
        type: Boolean as PropType<boolean>,
        default: false,
    },
    load: {
        type: Boolean as PropType<boolean>,
        default: false,
    },
    info: {
        type: String as PropType<string>,
        default: ''
    },
    gif: {
        type: String as PropType<string>,
        default: ''
    },
    type: {
        type: String as PropType<string>,
        default: ''
    }
})

const { favourite, load, info, gif, type } = toRefs(props)
</script>

<template>
    <div class="w-full h-full grid place-items-center">
        <div class="w-full flex flex-col items-center">
            <div class="w-16 min-h-[4rem] bg-white grid place-items-center border-2 border-fill-1 rounded-xl mb-3 group relative cursor-pointer"
                :class="{ 'is-marked': favourite }" @click="emit('heart')">
                <i class="group-hover:scale-110 group-active:scale-90 transition duration-300">
                    <Spinner v-if="load" :width="32" fill="!fill-fill-1 !stroke-fill-1" />
                    <Heart v-else class="w-8 h-8 [&>*]:stroke-fill-1 [&>*]:transition [&>*]:duration-300"
                        :class="favourite ? '[&>*]:stroke-1 [&>*]:fill-fill-1' : '[&>*]:stroke-2'" />
                </i>
                <div class="absolute -bottom-[1.3rem] left-[calc(50%-12px)] w-6 h-6 overflow-hidden rounded-[.325rem]">
                    <span
                        class="w-6 h-6 rotate-45 bg-white absolute bottom-3 left-0 rounded-md border-2 border-fill-1"></span>
                </div>
            </div>
            <img @click="emit('catch')" loading="eager" :src="imageSource(gif)" width="240" height="240"
                alt="pokemon animation" class="hover:scale-110 active:scale-90 transition duration-500 cursor-pointer">
            <div class="pb-6">
                <div class="p-3 rounded-xl font-medium flex items-center gap-2.5 mt-6 text-white drop-shadow"
                    :class="`bg-${type}-1`">
                    <i class="w-7">
                        <InfoCircle class="w-7 h-7 [&>*]:stroke-2 [&>*]:stroke-white" />
                    </i>
                    <span class="drop-shadow">{{ info }}</span>
                </div>
            </div>
        </div>
    </div>
</template>