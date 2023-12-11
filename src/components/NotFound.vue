<script setup lang="ts">
import { toRefs } from "@vue/reactivity";
import type { PropType } from "vue";
import Spinner from "./Spinner.vue";

const emit = defineEmits(['refresh'])
const props = defineProps({
    text: {
        type: String as PropType<string>,
        default: 'Pokemon yang kamu cari tidak tersedia disini'
    },
    error: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    load: {
        type: Boolean as PropType<boolean>,
        default: false
    }
})

const { text } = toRefs(props)
</script>

<template>
    <div class="h-full w-full flex justify-center items-center flex-col gap-6">
        <img src="@/assets/notfound.avif" width="370" class="hidden w-[180px] sm:w-[240px] md:w-[152px] xl:w-[180px]"
            alt="not found image" />
        <div class="flex flex-col items-center text-center px-6">
            <b class="text-2xl text-fill-1 mb-1 hidden">{{ error ? 'Network Error' : '404 Not Found' }}</b>
            <span class="text-slate-800 leading-[1.4rem] max-w-[75vw]">
                Oopss... {{ error ? 'Koneksi internetmu hilang. Pembaruan data gagal dilakukan.' : text }}</span>
            <button v-if="error" @click="emit('refresh')" class="text-sm font-semibold h-9 grid place-items-center px-6 mt-4 rounded-[18px] transition duration-300
            bg-green-700/80 hover:bg-green-700/90 active:bg-green-700 text-white w-fit">
                <Spinner v-if="load" is="jump-dots" :width="16" fill="fill-white" />
                <span v-else>Refresh Halaman</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
@media screen and (min-height: 720px) {
    img {
        display: block;
    }
}

@media screen and (min-height: 500px) {
    b {
        display: block;
    }
}
</style>