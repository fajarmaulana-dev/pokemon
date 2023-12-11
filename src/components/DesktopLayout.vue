<script setup lang="ts">
import { FastArrowRight, HomeSimpleDoor, ProfileCircle, Edit, ShieldQuestion, KeyMinus, GoogleDocs, LogOut, LogIn } from "@iconoir/vue";
import { ref, toRefs } from "@vue/reactivity";
import type { PropType } from "vue";
import { imageSource, extractName } from ".";

const emit = defineEmits(['sign'])
const props = defineProps({
    data: {
        type: Object as PropType<{ name: string, email: string, image: string }>,
        default: { name: 'Fajar Maulana', email: 'm.fajars.net@gmail.com', image: '' }
    },
    isLogin: {
        type: Boolean as PropType<boolean>,
        default: true
    }
})

const { data, isLogin } = toRefs(props)
const page = ref(0)
const isExpanded = ref(false)

const menus = [
    { name: 'beranda', icon: HomeSimpleDoor },
    { name: 'profil', icon: ProfileCircle },
    { name: 'ubah data profil', icon: Edit },
    { name: 'ubah kata sandi', icon: KeyMinus },
    { name: 'syarat dan ketentuan', icon: GoogleDocs },
    { name: 'kebijakan privasi', icon: ShieldQuestion },
]
</script>

<template>
    <div class="bg-slate-50 h-screen w-full relative overflow-hidden flex">
        <div :class="isExpanded ? 'min-w-[18rem] w-[18rem]' : 'min-w-[4rem] w-[4rem]'"
            style="transition: width .5s, min-width .5s;" class="h-screen bg-rose-200 flex flex-col">
            <div class="w-full flex flex-col items-center justify-center px-[18px]">
                <div :class="isExpanded ? 'w-24 h-24 mt-6 min-h-[6rem]' : 'w-12 h-12 mt-4 min-h-0'"
                    style="transition: width .5s, min-width .5s, height .5s;"
                    class="rounded-full overflow-hidden bg-white shadow-[0_0_6px_1px] shadow-rose-300/70">
                    <img v-if="!isLogin" src="@/assets/paldea-02.avif" width="96" height="96" alt="Is Logged Out Image" />
                    <span v-else-if="isLogin && data.image == ''" :class="isExpanded ? 'text-4xl' : 'text-lg'"
                        class="h-full w-full grid place-items-center font-bold text-rose-300 tracking-wider transition duration-500">
                        {{ extractName(data.name) }}</span>
                    <img v-else :src="imageSource(data.image)" width="96" height="96"
                        class="w-full h-full object-cover object-top" alt="profile image" />
                </div>
                <div v-if="isLogin"
                    :class="isExpanded ? 'h-full translate-x-0 delay-300' : 'h-0 -translate-x-[calc(100%+18px)]'" class="w-full
                    flex flex-col items-center justify-center transition duration-300 [&>p]:whitespace-nowrap
                    [&>p]:text-ellipsis [&>p]:w-full [&>p]:text-center">
                    <p class="text-lg text-slate-800 font-semibold overflow-hidden mt-3">{{ data.name }}</p>
                    <p class="text-xs font-medium text-slate-800/80 overflow-hidden">{{ data.email }}</p>
                </div>
            </div>
            <div :class="isExpanded ? 'h-[calc(100vh-12rem)]' : 'h-[calc(100vh-5rem)]'"
                class="flex w-full flex-col pt-4 text-slate-800 relative">
                <span class="absolute top-7 left-[18px] text-sm text-slate-700 tracking-widest font-bold transition
                duration-200" :class="isExpanded ? 'opacity-100 delay-200' : 'opacity-0'">MENU</span>
                <i :class="{ 'translate-x-56 rotate-180  duration-700': isExpanded }" @click="isExpanded = !isExpanded"
                    class="menus arrow relative cursor-pointer w-16 h-10 grid place-items-center transition duration-300">
                    <FastArrowRight color="rgb(30,41,59)" stroke-width="3" width="24" height="24" />
                </i>
                <div :class="isExpanded ? 'h-[calc(100vh-15.5rem)]' : 'h-[calc(100vh-8.5rem)]'"
                    class="flex w-full flex-col items-center justify-between mt-2 gap-3">
                    <div class="filter w-full flex flex-col items-center overflow-y-auto h-full relative">
                        <span :style="{ top: `${page * 4}rem` }" style="transition: top .5s;"
                            class="w-full h-16 bg-slate-50 absolute rounded-l-3xl">
                            <span v-for="i in 2" class="w-4 h-4 bg-slate-50 absolute right-0 first:-top-4 last:-bottom-4">
                                <span :class="i == 1 ? 'rounded-br-full' : 'rounded-tr-full'"
                                    class="w-4 h-4 bg-rose-200 absolute top-0"></span>
                            </span>
                        </span>
                        <span v-for="menu, idx in menus" @click="page = idx" :class="{ 'is-active': page == idx }"
                            class="menus w-full min-h-[4rem] flex items-center gap-4 px-[18px] relative cursor-pointer overflow-hidden">
                            <i class="min-w-[28px]">
                                <component :is="menu.icon" stroke-width="2" width="28" height="28">
                                </component>
                            </i>
                            <span :class="isExpanded ? 'opacity-100' : 'opacity-0'" style="transition: .5s;"
                                class="text-slate-800/80 font-semibold capitalize whitespace-nowrap overflow-hidden transition duration-300">
                                {{ menu.name }}</span>
                        </span>
                    </div>
                    <span @click="emit('sign')" class="logout w-full min-h-[4rem] flex items-center gap-4 px-[18px] cursor-pointer
                        overflow-hidden">
                        <i class="min-w-[28px]">
                            <component :is="isLogin ? LogOut : LogIn" stroke-width="2" width="28" height="28"></component>
                        </i>
                        <span :class="isExpanded ? 'opacity-100' : 'opacity-0'" style="transition: .5s;"
                            class="text-fill-1/80 font-bold tracking-wider uppercase whitespace-nowrap overflow-hidden transition duration-300">
                            {{ isLogin ? 'logout' : 'login' }}</span>
                    </span>
                </div>
            </div>
        </div>
        <div class="h-full min-w-[calc(100%-4rem)] transition duration-500 [&>*]:p-5 [&>*]:h-full"
            :style="{ transform: `translateY(-${page * 100}%)` }">
            <slot v-for="menu, idx in menus" :name="idx.toString()"></slot>
        </div>
    </div>
</template>

<style scoped>
.filter::-webkit-scrollbar {
    display: none;
}

.menus:deep(path) {
    stroke: rgba(30, 41, 59, .8);
    transition: .3s;
}

.menus:hover :deep(path) {
    stroke: rgba(30, 41, 59, .9);
}

.menus:hover span {
    color: rgba(30, 41, 59, .9);
}

.logout:deep(path) {
    stroke: rgba(205, 49, 49, .8);
    transition: .3s;
}

.logout:hover :deep(path) {
    stroke: rgba(205, 49, 49, .9);
}

.logout:active :deep(path) {
    stroke: rgba(205, 49, 49, 1);
}

.logout:hover span {
    color: rgba(205, 49, 49, .9);
}

.logout:active span {
    color: rgba(205, 49, 49, 1);
}

.menus:active span,
.is-activespan,
.is-active:hover span,
.is-active:active span {
    color: rgba(30, 41, 59, 1);
}

.menus:active :deep(path),
.is-active:deep(path),
.is-active:hover :deep(path),
.is-active:active :deep(path) {
    stroke: rgba(30, 41, 59, 1);
}

.arrow:deep(svg) {
    transition: .4s;
}

.arrow:hover :deep(svg) {
    transform: translateX(4px);
}
</style>