<script setup lang="ts">
import api from "@/api"
import { ref, reactive } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
import { useMainStore } from "@/stores";
import { storeToRefs } from "pinia";

const store = useMainStore()
const { pokemons } = storeToRefs(store)

</script>

<template>
    <div class="flex items-center flex-col gap-4 p-20">
        <div>
            <button class="h-40 px-8">Get All Pokemon</button>
            <p>{{ pokemons }}</p>
        </div>
    </div>
</template>