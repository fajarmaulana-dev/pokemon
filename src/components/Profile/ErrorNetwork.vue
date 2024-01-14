<script setup lang="ts">
import { toRefs } from "@vue/reactivity";
import type { PropType } from "vue";

const props = defineProps({
    error: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    data: {
        type: Object as PropType<{ title: string, button: string }>,
        default: { title: 'Pengubahan data gagal', button: 'simpan' }
    },
})

const { error } = toRefs(props)
</script>

<template>
    <section v-if="error" class="w-full px-3 py-2 rounded-md flex flex-col gap-1 bg-amber-200 text-slate-800 mb-5">
        <b class="capitalize">{{ data.title }}</b>
        <p>{{ data.title }} dikarenakan masalah jaringan. Untuk mengulang aksi, pastikan dulu bahwa koneksi
            internetmu sudah normal kembali, kemudian tekan kembali tombol <b class="capitalize">"{{ data.button }}"</b>.
        </p>
    </section>
</template>