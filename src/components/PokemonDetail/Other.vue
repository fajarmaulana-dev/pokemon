<script setup lang="ts">
import { imageSource } from "..";
import { toRefs } from "@vue/reactivity";
import type { PropType } from "vue";
import type { Pokemon } from "../../types";
import TypeIcon from "../TypeIcon.vue";
import { FastArrowDown } from "@iconoir/vue";

const props = defineProps({
    data: {
        type: Object as PropType<Pokemon>,
        default: {}
    }
})

const { data } = toRefs(props)

const iconHeight = (type: string, big: boolean = true) => {
    if (big) return type == 'ground' ? 14 : type == 'rock' || type == 'flying' ? 15 : 18;
    else return type == 'ground' ? 11 : type == 'rock' || type == 'flying' ? 12 : 15;
}
</script>

<template>
    <div class="mt-4">
        <h3 class="text-lg font-semibold mb-2 text-center uppercase">Kelemahan</h3>
        <div class="flex flex-wrap gap-4 items-center justify-center">
            <div v-for="poketype in data.weakness" :class="`bg-${poketype}-1`"
                class="h-10 w-fit basis-28 flex items-center gap-[.4rem] p-1 pr-[.8rem] rounded-[20px]">
                <div class="h-8 w-8 bg-white rounded-full grid place-items-center">
                    <TypeIcon :is="poketype" :height="iconHeight(poketype)" />
                </div>
                <span class="text-white text-sm font-semibold drop-shadow capitalize">
                    {{ poketype }}</span>
            </div>
        </div>
    </div>
    <div class="mt-4 pb-4">
        <h3 class="text-lg font-semibold mb-2.5 text-center uppercase">Evolusi</h3>
        <div class="flex flex-col justify-center items-center gap-2.5">
            <div v-for="ev, i in data.evolution" class="flex flex-col items-center">
                <div v-if="i !== 0" class="flex flex-col items-center mb-2.5">
                    <b class="text-slate-700">Min Level</b>
                    <FastArrowDown width="28" height="28" color="rgb(30,41,59)" stroke-width="2" />
                    <b class="text-slate-700 text-xl">{{ ev.minLevel }}</b>
                </div>
                <div class="border-2 border-slate-400 rounded-2xl p-2 pr-4 xs:p-4">
                    <div class="flex items-center">
                        <img :src="imageSource(ev.image)" class="w-28 xs:w-32" alt="card image" />
                        <div class="overflow-hidden">
                            <b class="text-slate-800 font-semibold">No. {{ ev.id }}</b>
                            <p class="text-slate-800 whitespace-nowrap text-xl font-bold overflow-hidden
                                        text-ellipsis capitalize">{{ ev.name }}</p>
                            <div class="flex flex-wrap items-center gap-2 mt-3">
                                <div v-for="poketype in ev.types" :class="`bg-${poketype}-1`"
                                    class="h-8 w-fit flex items-center gap-[.3rem] p-1 pr-1 xs:pr-[.6rem] rounded-[1rem]">
                                    <div class="h-6 w-6 bg-white rounded-full grid place-items-center">
                                        <TypeIcon :is="poketype" :height="iconHeight(poketype, false)" />
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
    </div>
</template>