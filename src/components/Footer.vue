<script setup lang="ts">
import { HomeSimpleDoor, MapPin, Pokeball, Heart, ProfileCircle } from 'iconoir-vue/regular';
import { useMainStore } from "@/stores"
import { storeToRefs } from 'pinia';
import { toRefs } from '@vue/reactivity';
import type { PropType } from 'vue';

const emit = defineEmits(['pokedex', 'login'])
const store = useMainStore()
const { page } = storeToRefs(store)

const props = defineProps({
    isLogin: {
        type: Boolean as PropType<boolean>,
        default: true
    },
})

const { isLogin } = toRefs(props)

const menus = [
    { name: 'beranda', icon: HomeSimpleDoor },
    { name: 'wilayah', icon: MapPin },
    { name: 'pokeDex', icon: Pokeball },
    { name: 'favorit', icon: Heart },
    { name: 'profil', icon: ProfileCircle },
]

const handleMenuClick = (idx: number) => {
    const index = idx < 2 ? idx : idx - 1;
    if (idx == 2) isLogin.value ? emit('pokedex') : emit('login');
    else store.$patch({ page: { name: menus[idx].name, index } })
}
const activeMenu = (idx: number) => idx == 2 ? false : idx < 2 ? page.value.index == idx : page.value.index == idx - 1
const iconStyle = (idx: number) => [idx == 2 ? 'w-[26px] h-[26px] xx:w-8 xx:h-8 [&>*]:stroke-white' : `w-4 h-4 xx:w-[22px] xx:h-[22px] ${activeMenu(idx) ? '[&>*]:stroke-fill-1 [&>*]:stroke-2' : '[&>*]:stroke-slate-500 group-hover:[&>*]:stroke-slate-600 group-hover:[&>*]:stroke-2'}`]
const middleStyle = 'w-[60px] h-[60px] xx:w-[68px] xx:h-[68px] rounded-full grid place-items-center bg-[hsl(0,61%,58%)] hover:bg-[hsl(0,61%,54%)] active:bg-[hsl(0,61%,50%)] border-4 border-white/60 transition duration-[.4s] -translate-y-6 xx:-translate-y-[26px] shadow-[0_0_4px_1px_#dbdcdd]'
const textStyle = (idx: number) => [idx == 2 ? '-translate-y-[1.325rem] xx:-translate-y-[1.4rem] text-[11px] xx:text-[13px] font-bold' : `${activeMenu(idx) ? 'opacity-1 translate-y-0.5' : 'opacity-0 -translate-y-1'} text-[9px] xx:text-[11px] font-semibold`]
</script>

<template>
    <footer class="fixed bottom-0 h-[60px] bg-white shadow-[1px_0_10px_1px] shadow-gray-200 w-full px-2.5
        rounded-t-5 flex items-center justify-around">
        <div v-for="menu, idx in menus" :key="idx" @click="handleMenuClick(idx)"
            class="flex items-center justify-center flex-col min-w-[44px] xx:min-w-[52px] select-none group cursor-pointer">
            <i :class="{ [middleStyle]: idx == 2, 'translate-y-0': activeMenu(idx) }" class="translate-y-1">
                <component :is="menu.icon" :class="iconStyle(idx)"></component>
            </i>
            <span :class="textStyle(idx)" class="text-fill-1 capitalize">
                {{ menu.name }}</span>
        </div>
    </footer>
</template>

<style scoped>
footer *,
footer:deep(path) {
    transition: .4s;
}
</style>