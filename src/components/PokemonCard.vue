<script setup lang="ts">
import { slider } from "."
import { toRefs, ref, computed } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import CardContent from "./PokemonCard/CardContent.vue";
import CardImage from "./PokemonCard/CardImage.vue";
import CardActions from "./PokemonCard/CardActions.vue";
import { InfoCircle } from "iconoir-vue/regular";
import Spinner from "./Spinner.vue";
import type { PropType } from "vue";
import type { PokemonCard, PokemonCardAction, Favourite } from "@/types";

const emit = defineEmits(['open', 'heart', 'update:slide', 'action', 'update:confirm', 'confirm', 'loadmore'])
const props = defineProps({
    slide: {
        type: Array as PropType<boolean[]>,
        default: []
    },
    heart: {
        type: Array as PropType<Favourite[]>,
        default: []
    },
    data: {
        type: Array as PropType<PokemonCard[]>,
        default: []
    },
    actions: {
        type: Array as PropType<PokemonCardAction[]>,
        default: []
    },
    loadmore: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    catched: {
        type: Array as PropType<string[]>,
        default: []
    },
    confirm: {
        type: Object as PropType<{ state: boolean, index: number }>,
        default: { state: false, index: 0 }
    },
    isMain: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    noDetail: {
        type: Object as PropType<{ state: boolean, index: number }>,
        default: { state: false, index: 0 }
    },
    errorMore: {
        type: Boolean as PropType<boolean>,
        default: false
    }
})

const { slide, heart, data, actions, loadmore, catched, confirm, isMain, noDetail, errorMore } = toRefs(props)

const loadHeart = ref(Array(data.value.length).fill(false))
const openload = ref(Array(data.value.length).fill(false))

const handleFavourite = (index: number) => {
    loadHeart.value[index] = true
    emit('heart', { index, endload: () => loadHeart.value[index] = false })
}

const handleOpen = (index: number) => {
    openload.value[index] = true
    emit('open', { index, endload: () => openload.value[index] = false })
}

watch(() => confirm.value.state, () => {
    if (confirm.value.state) {
        handleFavourite(confirm.value.index)
        emit('update:confirm', { state: false, index: 0 })
    }
})

const actWrapperColor = computed(() => {
    if (actions.value.length > 0) {
        return `from-${actions.value[0].color.init} to-${actions.value[actions.value.length > 1 ? 1 : 0].color.init}`
    } else return ''
})

const updateModel = (idx: number, to: boolean) => {
    let model = slide.value;
    model[idx] = to
    emit('update:slide', model)
}

const xStart = ref(0)
const xEnd = ref(0)
const grab = ref(false)

const startSlide = (e: any, param: { mobile?: boolean } = { mobile: false }) => {
    xStart.value = slider(e, param.mobile)
    grab.value = true
}

const endSlide = (e: any, param: { mobile?: boolean, index?: number } = { mobile: false }) => {
    grab.value = false
    xEnd.value = slider(e, param.mobile)
    if (xStart.value > xEnd.value && (xStart.value - xEnd.value > (param.mobile ? 28 : 0))) {
        updateModel(param.index as number, true)
    }
    if (xStart.value < xEnd.value && (xEnd.value - xStart.value > (param.mobile ? 28 : 0))) {
        updateModel(param.index as number, false)
    }
}
</script>

<template>
    <div v-if="actions.length > 0" class="text-sm leading-[1.2rem] xs:text-base xs:leading-[1.4rem] p-3 bg-sky-500/20 rounded-xl
        font-medium flex items-center gap-3.5 mb-4 text-slate-800">
        <i class="w-7">
            <InfoCircle class="w-7 h-7 stroke-2" />
        </i>
        <span>Geser gambar pokemon pada kartu ke arah kiri untuk membuka menu aksi</span>
    </div>
    <div class="flex flex-wrap gap-4 xs:gap-5">
        <div v-for="pokemon, idx in data" :class="actWrapperColor" class="wrapper bg-gradient-to-b relative h-32
            w-full rounded-[1.1rem] grow basis-[23rem] shadow-[0_0_4px_1px] shadow-gray-200 transition
            duration-[.4s] bg-slate-100">
            <article class="flex z-[1] relative rounded-2xl transition duration-500 select-none"
                :class="`bg-${pokemon.types[0]}-0`"
                :style="{ transform: `translateX(-${slide[idx] ? 4 * Math.ceil(actions.length / 2) : 0}rem)` }">
                <CardContent :data="pokemon" :openload="openload[idx]" :is-main="isMain"
                    :no-detail="noDetail.state && noDetail.index == idx" @open="handleOpen(idx)" />
                <CardImage :data="pokemon" :index="idx" :heart="heart" :loading="loadHeart[idx]" :grab="grab"
                    :catched="catched.includes(pokemon.id)" :action-length="actions.length"
                    @heart="heart[idx].state ? emit('confirm', { index: idx }) : handleFavourite(idx)"
                    @start-touch="({ e, mobile }) => startSlide(e, { mobile })"
                    @end-touch="({ e, mobile }) => endSlide(e, { mobile, index: idx })" />
            </article>
            <CardActions @action="({ label, index }) => emit('action', { label, index, id: pokemon.id })" :actions="actions"
                :index="idx" />
        </div>
    </div>
    <div v-if="loadmore || errorMore" class="h-12 w-full grid place-items-center mt-4">
        <button v-if="errorMore" @click="emit('loadmore')" class="text-sm text-white font-semibold h-9 grid place-items-center px-6 rounded
        transition duration-300 bg-green-700/80 hover:bg-green-700/90 active:bg-green-700">Lihat Lainnya</button>
        <Spinner v-if="loadmore" is="jump-dots" fill="fill-fill-1" :width="48" />
    </div>
</template>

<style scoped>
.wrapper:has(article > .cursor-pointer:hover) {
    box-shadow: 0 0 6px 1px #D1D5DB;
}
</style>