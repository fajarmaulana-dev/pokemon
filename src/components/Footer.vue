<script setup lang="ts">
import { HomeSimpleDoor, MapPin, Pokeball, Heart, ProfileCircle } from '@iconoir/vue';
import { useMainStore } from "@/stores"
import { storeToRefs } from 'pinia';

const emit = defineEmits(['openMine'])
const store = useMainStore()
const { page } = storeToRefs(store)

const menus = [
    { name: 'Beranda', icon: HomeSimpleDoor },
    { name: 'Wilayah', icon: MapPin },
    { name: 'PokeDex', icon: Pokeball },
    { name: 'Favorit', icon: Heart },
    { name: 'Profil', icon: ProfileCircle },
]

const handleMenuClick = (idx: number) => idx == 2 ? emit('openMine') : store.$patch({ page: idx < 2 ? idx : idx - 1 })
const activeMenu = (idx: number) => idx == 2 ? false : idx < 2 ? page.value == idx : page.value == idx - 1
</script>

<template>
    <footer class="fixed bottom-0 h-[60px] bg-white shadow-[1px_0_10px_1px] shadow-gray-200 w-full px-2.5
        rounded-t-5 flex items-center justify-around">
        <div v-for="menu, idx in menus" :key="idx" @click="handleMenuClick(idx)" :class="{ 'is-active': activeMenu(idx) }"
            class="flex items-center justify-center flex-col min-w-[44px] xx:min-w-[52px] select-none cursor-pointer peer">
            <i :class="{ 'is-middle': idx == 2 }" class="translate-y-1">
                <component :is="menu.icon" :color="idx == 2 ? '#FFFFFF' : 'rgba(100,116,139,0.9)'"></component>
            </i>
            <span class="text-fill-1"
                :class="idx == 2 ? '-translate-y-[1.325rem] xx:-translate-y-[1.4rem] text-[11px] xx:text-[13px] font-bold' : 'opacity-0 -translate-y-1 text-[9px] xx:text-[11px] font-semibold'">
                {{ menu.name }}</span>
        </div>
    </footer>
</template>

<style scoped>
footer:deep(path),
footer * {
    transition: .4s;
}

.is-active:deep(path) {
    stroke: rgb(205, 49, 49);
    stroke-width: 2px;
}

.is-active i {
    transform: translateY(0);
}

.select-none:not(.is-active):not(:has(.is-middle)):hover :deep(path) {
    stroke: rgb(71, 85, 105);
    stroke-width: 2px;
}

.is-middle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background-color: hsl(0, 61%, 58%);
    border: 4px solid rgba(255, 255, 255, 0.65);
    transition: .4s;
    transform: translateY(-24px);
    box-shadow: 0 0 10px 1px #e5e7eb;
}

.is-middle:deep(svg) {
    width: 26px;
    height: 26px;
}

i:not(.is-middle):deep(svg) {
    width: 16px;
    height: 16px;
}

.is-middle:hover {
    background-color: hsl(0, 61%, 54%);
}

.is-middle:active {
    background-color: hsl(0, 61%, 50%);
}

.is-active span {
    opacity: 1;
    transform: translateY(0);
}

@media screen and (min-width: 360px) {
    .is-middle {
        width: 68px;
        height: 68px;
        transform: translateY(-26px);
    }

    .is-middle:deep(svg) {
        width: 32px;
        height: 32px;
    }

    i:not(.is-middle):deep(svg) {
        width: 22px;
        height: 22px;
    }
}
</style>