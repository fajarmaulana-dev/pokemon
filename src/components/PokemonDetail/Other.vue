<script setup lang="ts">
import { imageSource } from "..";
import { toRefs } from "@vue/reactivity";
import type { PropType } from "vue";
import type { Pokemon } from "../../types";
import TypeIcon from "../TypeIcon.vue";
import { FastArrowDown } from "iconoir-vue/regular";

const props = defineProps({
    data: {
        type: Object as PropType<Pokemon>,
        default: {}
    }
})

const { data } = toRefs(props)
const headStyle = 'text-lg font-semibold mb-2 text-center uppercase w-full text-slate-800';
</script>

<template>
    <div class="mt-4">
        <div :class="[data.weakness.length > 1 ? 'mb-2' : 'mb-1', headStyle]">Kelemahan</div>
        <div v-if="data.weakness.length > 0" class="flex flex-wrap gap-4 items-center justify-center">
            <div v-for="poketype in data.weakness" :class="`bg-${poketype}-1`"
                class="h-10 w-fit basis-28 flex items-center gap-[.4rem] p-1 pr-[.8rem] rounded-[20px]">
                <div class="h-8 w-8 bg-white rounded-full grid place-items-center">
                    <TypeIcon :is="poketype" />
                </div>
                <span class="text-white text-sm font-semibold drop-shadow capitalize">
                    {{ poketype }}</span>
            </div>
        </div>
        <p v-else class="text-center text-slate-800 text-sm">Pokemon ini tidak memiliki kelemahan.</p>
    </div>
    <div class="mt-4 pb-4">
        <div :class="[data.evolution.length > 1 ? 'mb-2.5' : 'mb-1', headStyle]">Evolusi</div>
        <div v-if="data.evolution.length > 1" class="flex flex-col justify-center items-center gap-2.5">
            <div v-for="ev, i in data.evolution" class="flex flex-col items-center">
                <div v-if="i !== 0" class="flex flex-col items-center mb-2.5">
                    <b class="text-slate-700">Min Level</b>
                    <FastArrowDown class="w-7 h-7 [&>*]:stroke-slate-800 [&>*]:stroke-2" />
                    <b class="text-slate-700 text-xl">{{ ev.minLevel }}</b>
                </div>
                <div class="border-2 border-slate-400 rounded-2xl p-2 pr-4 xs:p-4">
                    <div class="flex items-center">
                        <img :src="imageSource(ev.image)" width="128" height="128" class="w-28 xs:w-32" alt="card image" />
                        <div class="overflow-hidden">
                            <b class="text-slate-800 font-semibold">No. {{ ev.id }}</b>
                            <p class="text-slate-800 whitespace-nowrap text-xl font-bold overflow-hidden
                                        text-ellipsis capitalize">{{ ev.name }}</p>
                            <div class="flex flex-wrap items-center gap-2 mt-3">
                                <div v-for="poketype in ev.types" :class="`bg-${poketype}-1`"
                                    class="h-8 w-fit flex items-center gap-[.3rem] p-1 pr-1 xs:pr-[.6rem] rounded-[1rem]">
                                    <div class="h-6 w-6 bg-white rounded-full grid place-items-center">
                                        <TypeIcon :is="poketype" :height="15" />
                                    </div>
                                    <span class="hidden xs:block text-white text-xs font-semibold drop-shadow capitalize">
                                        {{ poketype }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <p v-else class="text-center text-slate-800 text-sm">Pokemon ini tidak memiliki rantai evolusi.</p>
    </div>
</template>