<script setup lang="ts">
import { toRefs, ref, reactive } from "@vue/reactivity";
import { watch, onMounted } from "@vue/runtime-core";
import { ArrowLeft, Heart } from "@iconoir/vue";
import type { PropType } from "vue";
import type { Pokemon, Favourite } from "@/types"
import Basic from "./PokemonDetail/Basic.vue";
import Other from "./PokemonDetail/Other.vue";
import Spinner from "./Spinner.vue";
import Images from "./PokemonDetail/Images.vue";

const emit = defineEmits(['heart', 'update:confirm', 'confirm', 'update:sidePage', 'confirm', 'catch'])
const props = defineProps({
    data: {
        type: Object as PropType<Pokemon>,
        default: { id: '', name: '', gif: '', types: [], description: '', detail: { weight: '', height: '', spread: [], abilities: [] }, femalePossibility: 0, weakness: [], evolution: [] }
    },
    favourite: {
        type: Object as PropType<Favourite>,
        default: { id: '0002', state: false, date: '11/21/2023' }
    },
    catched: {
        type: Object as PropType<{ state: boolean, date: string }>,
        default: { state: false, date: '11/21/2023' }
    },
    confirm: {
        type: Object as PropType<{ state: boolean, index: number }>,
        default: { state: false, index: 0 }
    },
    sidePage: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    index: {
        type: Number as PropType<number>,
        default: 0
    }
})

const { data, favourite, catched, confirm, sidePage, index } = toRefs(props)

const topSideImage = ref(0)
const load = reactive<{ heart: boolean, catch: boolean }>({ heart: false, catch: false })

const handleFavourite = () => {
    load.heart = true
    emit('heart', { index: index.value, endload: () => load.heart = false })
}

watch(confirm, () => {
    if (confirm.value.state) {
        handleFavourite()
        emit('update:confirm', { state: false, index: 0 })
    }
}, { deep: true })

const screenWidth = ref(window.innerWidth);
onMounted(() => {
    screenWidth.value = window.innerWidth;
    window.addEventListener('resize', () => {
        screenWidth.value = window.innerWidth;
    })
})

const handleCatch = () => {
    load.catch = true;
    emit('catch', { endload: () => load.catch = false })
}
</script>

<template>
    <aside :style="{ transform: `translateX(${sidePage ? '0' : '100'}%)` }"
        class="fixed h-screen w-full bg-white top-0 left-0 overflow-x-hidden overflow-y-auto transition duration-500">
        <div class="relative h-[calc(80px+20vw)] w-full bg-white">
            <Images :data="data" v-model="topSideImage" @catch="catched.state ? false : handleCatch()" />
            <div class="absolute top-0 h-[52px] w-full flex items-center px-4 justify-between">
                <div v-for="i in 2" :class="{ 'is-marked': i == 2 && favourite.state }"
                    @click="i == 1 ? emit('update:sidePage', false) : favourite.state ? emit('confirm', { index }) : handleFavourite()"
                    class="w-9 h-9 first:-translate-x-1 last:translate-x-1 rounded-full grid place-items-center cursor-pointer bg-white/0
                    hover:bg-white/20 active:bg-white/10 transition duration-[.4s]">
                    <Spinner v-if="load.heart && i == 2" :width="20" fill="!fill-white !stroke-white" />
                    <component v-else :is="i == 1 ? ArrowLeft : Heart" color="white" width="20" height="20"
                        stroke-width="3">
                    </component>
                </div>
            </div>
        </div>
        <div :style="{ marginTop: `${topSideImage}px` }" class="p-5 flex flex-col [&>*]:w-full gap-5">
            <Basic :data="data" :favourite="favourite" :catched="catched" />
            <Other :data="data" />
        </div>
    </aside>
    <div :class="load.catch ? 'translate-y-0 opacity-100' : 'translate-y-[100vh] opacity-0'"
        class=" fixed top-0 h-screen w-screen bg-[rgb(10,25,47)] overflow-hidden grid place-items-center transition duration-300">
        <i v-if="sidePage" v-for="i in Math.floor(screenWidth / 18)"
            class="star absolute -top-4 w-0.5 bg-electric-0 rounded-full"
            :style="`height: ${25 + (Math.random() * 100)}px; left: ${Math.floor(Math.random() * screenWidth)}px; animation-duration: ${(Math.random() * 100) + 1}s`"></i>
        <img src="@/assets/alola-01.avif" :class="load.catch ? 'scale-100 delay-300' : 'scale-0'"
            class="relative z-[10] w-[75vw] max-w-[480px] transition duration-300" alt="animated image">
        <b class="font-semibold text-white text-center text-lg">Penangkapan sedang dalam proses...</b>
    </div>
</template>

<style scoped>
.is-marked:deep(path) {
    fill: #CD3131;
    stroke-width: 1;
}

.star {
    animation: star linear infinite;
}

@keyframes star {
    0% {
        transform: translateY(0);
    }

    100% {
        transform: translateY(100vh);
    }
}
</style>