<script setup lang="ts">
import { toRefs, ref, reactive, computed } from "@vue/reactivity";
import { watch, onMounted } from "@vue/runtime-core";
import { ArrowLeft, Heart, Xmark } from "@iconoir/vue";
import type { PropType } from "vue";
import type { Pokemon, Favourite } from "@/types"
import Basic from "./PokemonDetail/Basic.vue";
import Other from "./PokemonDetail/Other.vue";
import Spinner from "./Spinner.vue";
import Images from "./PokemonDetail/Images.vue";
import DeskImage from "./PokemonDetail/DeskImage.vue";
import { imageSource, overflowHandler } from ".";

// use heart emit to do an action when click favourite button
// to perform toggle action, please create a function for @heart event on child component like this
/*
    const hearts = ref([values])
    const handleFavourite = ({ index, endload }: { index: number, endload: () => void }) => {
        hearts.value[index].state = !hearts.value[index].state
        // ... some action to update the state in state management or database
        endload() // this function is used to stop loading progress
    }
*/

// use catch emit to do an action when catch a pokemon

// use confirm to open confirmation pane on unfavourite action

// use sidePage to open this detail pane

// catched: if id of data contained in catched, it's mean that the pokemon has been catched

// confirm: to receive confirmation data of removed item from favourite

const emit = defineEmits(['heart', 'update:confirm', 'confirm', 'update:sidePage', 'catch'])
const props = defineProps({
    data: {
        type: Object as PropType<Pokemon>,
        default: { id: '', name: '', gif: '', types: [], description: '', detail: { weight: '', height: '', experience: '', abilities: [] }, femalePossibility: 0, weakness: [], evolution: [] }
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
    },
    id: {
        type: String as PropType<string>,
        default: 'detail'
    }
})

const { data, favourite, catched, confirm, sidePage, index, id } = toRefs(props)

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

watch(sidePage, () => {
    sidePage.value ? overflowHandler('hidden') : overflowHandler('auto')
})

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

const infoText = computed(() => {
    if (catched.value.state) return `Pokemon ini telah berhasil ditangkap pada ${catched.value.date}`;
    else return 'Tekan pada gambar pokemon untuk menangkapnya!'
})

const closeStyle = computed(() => {
    const color = data.value.types[0];
    return `bg-${color}-1/25 hover:bg-${color}-1/40 active:bg-${color}-1/50`
})

const transition = computed(() => {
    return { transform: `translate${screenWidth.value < 640 ? 'X' : 'Y'}(${sidePage.value ? '0' : `${screenWidth.value < 640 ? '-' : ''}100`}%)` }
})
</script>

<template>
    <aside :id="id" :style="transition"
        class="fixed h-screen w-full top-0 right-0 transition duration-500 flex justify-end">
        <div class="panelayer" :class="{ 'is-active': sidePage }" @click="emit('update:sidePage', false)"></div>
        <div
            class="bg-white relative z-10 h-full w-full max-w-[1024px] overflow-x-hidden overflow-y-auto sm:flex sm:flex-row-reverse sm:gap-1">
            <div v-if="screenWidth < 640" class="relative h-[calc(80px+20vw)] w-full bg-white">
                <Images :type="data.types[0]" :gif="data.gif" v-model="topSideImage"
                    @catch="catched.state ? false : handleCatch()" />
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
            <div v-else :class="`bg-${data.types[0]}-0`" class="w-full max-w-md overflow-y-auto p-6 noscroll relative">
                <DeskImage :favourite="favourite.state" :type="data.types[0]" :gif="data.gif" :info="infoText"
                    :load="load.heart" @heart="favourite.state ? emit('confirm', { index }) : handleFavourite()"
                    @catch="catched.state ? false : handleCatch()" />
                <i class="absolute w-10 h-10 rounded-full grid place-items-center right-3 top-3 transition duration-300 cursor-pointer"
                    :class="closeStyle" @click="emit('update:sidePage', false)">
                    <Xmark color="rgb(30,41,59)" width="30" height="30" />
                </i>
            </div>
            <div :style="{ marginTop: `${screenWidth < 640 ? topSideImage : 0}px` }"
                class="p-5 flex flex-col [&>*]:w-full gap-5 sm:h-screen sm:overflow-y-auto noscroll">
                <Basic :data="data" :favourite="favourite" :info="infoText" />
                <Other :data="data" />
            </div>
        </div>
    </aside>
    <div :class="load.catch ? 'translate-y-0 opacity-100' : 'translate-y-[100vh] opacity-0'"
        class=" fixed top-0 h-screen w-screen bg-[rgb(10,25,47)] overflow-hidden grid place-items-center transition duration-300">
        <i v-if="sidePage" v-for="i in Math.floor(screenWidth / 18)"
            class="star absolute -top-4 w-0.5 bg-electric-0 rounded-full"
            :style="`height: ${25 + (Math.random() * 100)}px; left: ${Math.floor(Math.random() * screenWidth)}px; animation-duration: ${(Math.random() * 100) + 1}s`"></i>
        <img :src="imageSource(data.gif)" :class="load.catch ? 'scale-100 delay-300' : 'scale-0'"
            class="relative z-[10] w-[75vw] max-w-[480px] transition duration-300" alt="animated image">
        <b class="font-semibold text-white text-center text-lg">Penangkapan sedang dalam proses...</b>
    </div>
</template>

<style scoped>
.is-marked:deep(path) {
    fill: #CD3131;
    stroke-width: 1;
}

.noscroll::-webkit-scrollbar {
    display: none
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