<script setup lang="ts">
import { slider } from "."
import { toRefs, ref, computed } from "@vue/reactivity";
import CardContent from "./PokemonCard/CardContent.vue";
import CardImage from "./PokemonCard/CardImage.vue";
import CardActions from "./PokemonCard/CardActions.vue";
import type { PropType } from "vue";
import type { PokemonCard, PokemonCardAction } from "@/types";

// use heart emit to do an action when click favourite button
// just don't add the heart prop to the child if you want to hide the favourite button
// to perform toggle action, please create a function for @heart event on child component like this
/*
    const hearts = ref([values])
    const handleFavourite = ({ index, endload }: { index: number, endload: () => void }) => {
        hearts.value[index].state = !hearts.value[index].state
        // ... some action to update the state in state management or database
        endload() // this function is used to stop loading progress
    }
*/

// use open emit to do an action when click the card

// use closeActions emit to close

// use actions to add some actions for each card
// to perform the each action, please use action emit that provide the label of clicked button and index of the card
// just don't add actions to the child if you want to negate the actions with all its feature
/*
    if you set async attribute to true, you should to set actions value as reactive
    then fill the load attribute with false value as many as the length of data
*/

// use modelValue to get access for open the actions menu from child

const emit = defineEmits(['open', 'heart', 'update:modelValue', 'action'])
const props = defineProps({
    modelValue: {
        type: Array as PropType<boolean[]>,
        default: []
    },
    heart: {
        type: Array as PropType<{ id: string, state: boolean }[]>,
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
})

const { modelValue, heart, data, actions } = toRefs(props)

const loadHeart = ref(Array(data.value.length).fill(false))
const handleFavourite = (index: number) => {
    loadHeart.value[index] = true
    emit('heart', { index, endload: () => loadHeart.value[index] = false })
}

const actWrapperColor = computed(() => {
    if (actions.value.length > 0) {
        return `from-${actions.value[0].color.init} to-${actions.value[actions.value.length > 1 ? 1 : 0].color.init}`
    } else return ''
})

const updateModel = (idx: number, to: boolean) => {
    let model = modelValue.value;
    model[idx] = to
    emit('update:modelValue', model)
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
    <div class="flex flex-wrap gap-4 xs:gap-5">
        <div v-for="pokemon, idx in data" :class="actWrapperColor" class="wrapper bg-gradient-to-b relative h-32
        w-full rounded-[1.1rem] grow basis-[23rem] shadow-[0_0_4px_1px] shadow-gray-200 transition
        duration-[.4s] bg-slate-100">
            <article class="flex z-[1] relative rounded-2xl transition duration-500 select-none"
                :class="`bg-${pokemon.types[0]}-0`"
                :style="{ transform: `translateX(-${modelValue[idx] ? 4 * Math.ceil(actions.length / 2) : 0}rem)` }">
                <CardContent :data="pokemon" @open="emit('open', idx)" />
                <CardImage :data="pokemon" :index="idx" :heart="heart" :loading="loadHeart[idx]" :grab="grab"
                    @start-touch="({ e, mobile }) => startSlide(e, { mobile })"
                    @end-touch="({ e, mobile }) => endSlide(e, { mobile, index: idx })" @heart="handleFavourite(idx)" />
            </article>
            <CardActions @action="({ label, index }) => emit('action', { label, index })" :actions="actions" :index="idx" />
        </div>
    </div>
</template>

<style scoped>
.wrapper:has(article > .cursor-pointer:hover) {
    box-shadow: 0 0 6px 1px #D1D5DB;
}
</style>