<script setup lang="ts">
import BottomPaneWrapper from './BottomPaneWrapper.vue';
import { toRefs } from "@vue/reactivity";
import { typesLabel, getTypesColor } from './Func/method';
import type { PropType } from 'vue';

const emit = defineEmits(['update:modelValue', 'chooseFilter', 'confirm'])
const props = defineProps({
    modelValue: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    paneFor: {
        type: String as PropType<string>,
        default: 'type'
    },
    filterItems: {
        type: Array as PropType<string[]>,
        default: []
    },
    item: {
        type: String as PropType<string>,
        default: ''
    },
})

const { modelValue, paneFor, filterItems, item } = toRefs(props)
</script>

<template>
    <BottomPaneWrapper :open="modelValue" @update:open="emit('update:modelValue')">
        <!-- For Filter -->
        <span v-if="paneFor == 'sort'" class="w-full text-slate-800 font-semibold text-lg text-center">
            Urut Berdasarkan</span>
        <div v-if="paneFor == 'type' || paneFor == 'sort'" id="filter-pane"
            class="filter flex flex-wrap gap-3 px-5 h-fit max-h-[70vh] overflow-y-auto pt-1">
            <span v-for="item, idx in filterItems" @click="emit('chooseFilter', { is: paneFor, item })"
                :class="getTypesColor(item, idx, paneFor)"
                class="grow basis-[248px] min-h-[2.5rem] transition duration-300
                cursor-pointer px-5 rounded-[.65rem] text-slate-800 font-semibold text-center grid place-items-center w-full">
                {{ paneFor == 'type' ? `Tampilkan ${typesLabel(idx, item)}` : item }}</span>
        </div>
        <!-- For Confirm -->
        <div v-if="paneFor == 'confirm'" class="px-5 [&>*]:w-full h-fit max-h-[70vh] pt-1 flex flex-col gap-5">
            <b class="text-center text-slate-800">
                Apakah kamu yakin ingin menghapus <span class="capitalize">{{ item }}</span>
                dari <span class="capitalize">Favorit</span> ?</b>
            <div class="flex flex-wrap gap-3 [&>*]:w-full">
                <button v-for="text, idx in ['Batalkan', 'Ya, Hapus']" @click="emit('confirm', idx)" class="grow basis-[120px] min-h-[2.5rem]
                    transition duration-300 font-semibold rounded-md first:bg-slate-300/80 hover:first:bg-slate-300/90
                    active:first:bg-slate-300 first:text-slate-800 last:bg-fill-1/80 hover:last:bg-fill-1/90
                    active:last:bg-fill-1 last:text-white">{{ text }}</button>
            </div>
        </div>
    </BottomPaneWrapper>
</template>

<style scoped>
.filter::-webkit-scrollbar {
    display: none;
}
</style>