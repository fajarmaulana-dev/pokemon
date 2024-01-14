<script setup lang="ts">
import { toRefs, ref } from '@vue/reactivity';
import { ProfileCircle, Edit, KeyMinus, GoogleDocs, ShieldQuestion, LogOut, LogIn, NavArrowRight, HelpCircle } from 'iconoir-vue/regular';
import type { PropType, SVGAttributes } from 'vue';
import Ripple from '../Ripple.vue';
import { Ripples, imageSource, extractName } from "..";

const emit = defineEmits(['open', 'sign'])
const props = defineProps({
    isLogin: {
        type: Boolean as PropType<boolean>,
        default: true,
    },
    data: {
        type: Object as PropType<{ image: string, name: string, email: string }>,
        default: { image: '', name: '', email: '' }
    }
})

const { isLogin, data } = toRefs(props)

const menus: Record<string, { name: string, icon: (props: SVGAttributes) => any }[]> = {
    'Akun dan Keamanan': [
        { name: 'Lihat Profil', icon: ProfileCircle },
        { name: 'Ubah Data Profil', icon: Edit },
        { name: 'Ubah Kata Sandi', icon: KeyMinus },
    ],
    'Panduan Penggunaan': [
        { name: 'Bantuan', icon: HelpCircle },
        { name: 'Syarat dan Ketentuan', icon: GoogleDocs },
        { name: 'Kebijakan Privasi', icon: ShieldQuestion },
    ]
}

const index = (menuIndex: number, subIndex: number) => {
    let state = 0;
    let result = subIndex
    const keys = Object.keys(menus)
    while (state < menuIndex) {
        result += menus[keys[state]].length
        state++
    }
    return result;
}

const ripples = ref<Record<string, any[][]>>(Object.fromEntries(Object.keys(menus).map((n, i) => [n, [...Array(menus[n].length)].map((_, i) => [])])))
const ripple = ref<Record<string, any[]>>(Object.fromEntries(Object.keys(menus).map((n, i) => [n, []])))

const rippleHandler = Object.fromEntries(Object.keys(ripple.value).map((n, i) => [n, new Ripples(ripple.value[n], ripples.value[n])]))
const animateRipple = (e: any, branch: string, index: number, mobile: boolean = false) => ripples.value[branch] = rippleHandler[branch].animate(e, mobile, index)
const rippleEnd = (branch: string, index: number, k: number) => ripples.value[branch] = rippleHandler[branch].end(index, k);
</script>

<template>
    <div class="bg-white p-4 flex items-center gap-6 flex-col xx:flex-row">
        <div class="w-[7rem] h-28 rounded-full bg-gray-200 overflow-hidden">
            <img v-if="data.image !== ''" :src="imageSource(data.image)" width="112" height="112" alt="profile image"
                class="object-cover object-top w-full h-full" />
            <span v-else class="w-full h-full grid place-items-center text-slate-800 text-4xl font-bold tracking-wider">
                {{ extractName(data.name) }}</span>
        </div>
        <div class="w-full xx:w-[calc(100%-8.5rem)] h-full text-slate-800 flex flex-col items-center xx:items-start overflow-hidden [&>*]:w-full
            [&>*]:whitespace-nowrap [&>*]:overflow-hidden [&>*]:text-ellipsis [&>*]:text-center xx:[&>*]:text-left">
            <b class="font-bold text-xl text-fill-1">Selamat Datang!</b>
            <p class="font-semibold text-lg leading-6 mt-3">{{ data.name }}</p>
            <span class="text-xs">{{ data.email }}</span>
        </div>
    </div>
    <div v-for="part, mdx in Object.keys(menus)" class="bg-white mt-[5px] pt-4 [&>*]:px-4">
        <p class="font-bold pb-1 text-slate-800">{{ part }}</p>
        <div v-for="menu, idx in menus[part]" @click="emit('open', index(mdx, idx))" :ref="e => { ripple[part][idx] = e }"
            @touchstart.passive="animateRipple($event, part, idx, true)" @mousedown="animateRipple($event, part, idx)"
            class="bg-white text-slate-700 hover:bg-slate-100/50 transition duration-300 py-3.5 flex items-center
            justify-between cursor-pointer relative overflow-hidden">
            <div class="text-[.9rem] font-semibold flex items-center gap-2 relative z-[1]">
                <component :is="menu.icon" class="w-5 h-5 stroke-[2.5]"></component>
                <span>{{ menu.name }}</span>
            </div>
            <NavArrowRight class="w-5 h-5 stroke-[2.5] relative z-[1]" />
            <Ripple v-model="ripples[part][idx]" @ripple-end="k => rippleEnd(part, idx, k)" color="slate-300/80" />
            <hr v-if="idx < menus[part].length - 1" class="absolute inset-x-4 bottom-0 rounded-[1px] h-0.5 bg-gray-200" />
        </div>
    </div>
    <div class="bg-white mt-[5px] text-fill-1" @click="emit('sign')">
        <div class="hover:bg-slate-100/50 transition duration-300 py-3.5 px-4 cursor-pointer flex items-center gap-2">
            <component :is="isLogin ? LogOut : LogIn" class="w-6 h-6 stroke-[2.5]"></component>
            <span class="tracking-wider font-bold">{{ isLogin ? 'Logout' : 'Login' }}</span>
        </div>
    </div>
    <div class="pt-4 pb-12 text-dragon-1 font-semibold text-center text-sm">
        Crafted by <span class="text-fighting-1 font-bold">Fajar Maulana</span> © {{ new Date().getFullYear() }}
    </div>
</template>