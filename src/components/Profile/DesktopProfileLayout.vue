<script setup lang="ts">
import { toRefs } from '@vue/reactivity';
import { getAssets } from '..';
import type { PropType } from 'vue';

const props = defineProps({
    image: {
        type: String as PropType<string>,
        default: 'hisui'
    }
})

const { image } = toRefs(props)
</script>

<template>
    <div>
        <div class="bg-white rounded-2xl h-full w-full shadow-[0_0_10px_2px] overflow-hidden shadow-gray-200/40 flex">
            <div class="w-full max-w-lg h-full rounded-2xl overflow-hidden">
                <img :src="getAssets(`${image}.avif`)" width="512" height="288" :alt="image"
                    class="object-cover object-top w-full h-full">
            </div>
            <div class="w-full min-w-[400px] h-full p-4">
                <slot></slot>
            </div>
        </div>
    </div>
</template>