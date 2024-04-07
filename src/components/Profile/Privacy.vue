<script setup lang="ts">
import { ArrowLeft } from "iconoir-vue/regular";

const emit = defineEmits(['back'])
</script>

<template>
    <div class="block md:border-none h-12 w-full pb-2 border-b-4 border-slate-200 mb-4">
        <div class="flex items-center md:items-start md:translate-y-1">
            <i @click="emit('back')" class="w-7 h-7 rounded-full grid md:hidden place-items-center cursor-pointer
                bg-fill-0/0 hover:bg-fill-0/30 active:bg-fill-0/50 transition duration-[.4s] -translate-x-1">
                <ArrowLeft class="h-[15px] w-[15px] text-fill-1 stroke-[4]" />
            </i>
            <b class="font-bold text-fill-1 text-[1.15rem] xx:text-xl">Kebijakan Privasi</b>
        </div>
    </div>
</template>