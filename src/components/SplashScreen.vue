<script setup lang="ts">
import { toRefs } from "@vue/reactivity";
import type { PropType } from "vue";

const emit = defineEmits(['action'])
const props = defineProps({
    error: {
        type: Boolean as PropType<boolean>,
        default: false
    }
})

const { error } = toRefs(props)
</script>

<template>
    <div id="domsplash"
        class="w-full h-screen top-0 flex justify-center items-center fixed bg-white transition duration-500 z-[10]">
        <div v-if="error" class="h-fit flex flex-col gap-4 max-w-[500px] w-[70vw] py-6 items-center overflow-y-auto filter">
            <img src="@/assets/denied.avif" width="300" height="110" class="w-[50vw] max-w-[300px]" alt="no signal" />
            <b class="text-slate-800 font-medium text-center text-sm sm:text-base">
                Kamu sedang tidak terhubung ke internet. Pastikan dulu bahwa kamu memiliki koneksi internet yang stabil.
                Setelah itu, refresh kembali halaman ini.</b>
            <div class="flex gap-2.5 sm:gap-4">
                <button v-for="text, i in ['Refresh', 'Keluar']" @click="emit('action', i)" class="text-sm font-semibold h-9 grid place-items-center px-6 rounded transition duration-300 first:bg-green-700/80
                    hover:first:bg-green-700/90 active:first:bg-green-700 first:text-white last:bg-slate-300/40 hover:last:bg-slate-300/60
                    active:last:bg-slate-300/80 last:text-slate-800">
                    {{ text }}</button>
            </div>
        </div>
        <img v-else src="@/assets/logo.svg" width="500" height="184" class="w-[70vw] max-w-[500px]" alt="logo" />
    </div>
</template>