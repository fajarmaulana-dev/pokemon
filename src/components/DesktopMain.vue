<script setup lang="ts">
import { ref, computed, toRefs } from "@vue/reactivity";
import PokemonCards from "./PokemonCards.vue";
import { useMainStore } from "@/stores";
import DesktopLayout from "./DesktopLayout.vue";
import DesktopProfileLayout from "./Profile/DesktopProfileLayout.vue";
import Preference from "./Profile/Preference.vue";
import Password from "./Profile/Password.vue";
import Help from "./Profile/Help.vue";
import Term from "./Profile/Term.vue";
import Privacy from "./Profile/Privacy.vue";
import { storeToRefs } from 'pinia';
import { ArrowLeft, Pokeball, Heart } from "iconoir-vue/regular";
import { toTop, mainProps } from "./Func/method";

const emit = defineEmits(['update:pokedex', 'update:profilePage', 'update:prefer', 'update:password', 'update:passwordPage', 'update:passwordWrong', 'desktopRegion', 'mobileRegion', 'allRegion', 'openFilter', 'handleFavourite', 'cardConfirm', 'openCard', 'chooseFilter', 'unCatch', 'unFavourite', 'sign', 'refresh', 'loadmore', 'savePrefer', 'profileImage', 'postPass'])
const props = defineProps(mainProps)
const { filterLoad, filter, search, filterLabel, filteredPokemon, filteredFavourite, onBottom, error, availableType, cardSlideState, pokedex, forPokedex, disableFilter, allCatched, confirmData, prefer, profileError, profileLoad, password, passwordPage, passwordWrong, cardActions, profilePage, errorMore, noDetail, user, isLogin } = toRefs(props)

const store = useMainStore()
const { page, regions } = storeToRefs(store)

const deskOpenRegion = async (name: string) => {
    toTop('beranda')
    emit('desktopRegion', name)
}

const deskRegionData = computed(() => {
    return { data: Object.keys(regions.value), selected: forPokedex.value == 'beranda' ? '' : filter.value['wilayah'].region }
})

const layerStyle = {
    wrapper: 'bg-white rounded-2xl shadow-[0_0_10px_2px] shadow-gray-200/40 overflow-hidden z-0 relative',
    content: 'absolute left-0 h-20 w-full bg-rose-200 text-slate-800 hover:bg-rose-300 active:bg-red-200 transition duration-300 rounded-2xl shadow-[0_0_10px_2px] shadow-gray-200/40 px-4 flex items-center justify-between gap-2 cursor-pointer'
}

const pokedexIsOpen = ref(false)
const dexIndex = (i: number) => pokedexIsOpen.value ? i == 0 ? 0 : 1 : i == 0 ? 1 : 0;
const deskHome = computed(() => {
    if (['beranda', 'wilayah'].includes(page.value.name)) {
        return page.value.name == 'beranda' ? 'beranda' : 'wilayah'
    } else {
        const p = deskRegionData.value.selected == '';
        return p ? 'beranda' : 'wilayah'
    }
})
const handleDeskDex = (name: string) => {
    if (forPokedex.value !== name) {
        if (name == 'pokedex' && !pokedex.value) emit('update:pokedex', true);
        else {
            emit('update:pokedex', false);
            if (name == 'favorit') store.$patch({ page: { name, index: 2 } })
            else {
                const p = deskRegionData.value.selected == ''
                store.$patch({ page: { name: p ? 'beranda' : 'wilayah', index: p ? 0 : 1 } })
            }
        }
    }
}

const models = computed(() => {
    return {
        filter: filter.value,
        search: search.value,
        confirmData: confirmData.value,
        onBottom: onBottom.value,
        cardSlideState: cardSlideState.value,
        availableType: availableType.value,
        prefer: prefer.value,
    }
})
const types = computed(() => ['', ...models.value.availableType[forPokedex.value]])
</script>

<template>
    <DesktopLayout :is-login="isLogin" :data="user" :model-value="profilePage"
        @update:model-value="val => emit('update:profilePage', val)" @sign="emit('sign')">
        <template #0>
            <div class="flex gap-5">
                <div
                    class="filter bg-white rounded-2xl h-full w-full shadow-[0_0_10px_2px] shadow-gray-200/40 overflow-y-auto">
                    <PokemonCards :id="deskHome" v-model:text="models.search[deskHome]" name="home-desktop-filter"
                        :label="filterLabel[deskHome]" :load="filterLoad[deskHome]" :disable-filter="disableFilter"
                        @open-filter="val => emit('openFilter', val)" @heart="val => emit('handleFavourite', val)"
                        :catched="allCatched" :regions="deskRegionData" :data="filteredPokemon[deskHome]"
                        :heart="filteredFavourite[deskHome]" :types="types" @hover="handleDeskDex('beranda')"
                        @confirm="({ index }) => emit('cardConfirm', { index, name: deskHome })" is-main
                        :error="error[deskHome]" v-model:confirm="models.confirmData[deskHome].confirm"
                        @open-card="val => emit('openCard', val)" v-model:loadmore="models.filter[deskHome].next"
                        v-model:on-bottom="models.onBottom[deskHome]" @choose-region="deskOpenRegion"
                        @all-region="toTop('wilayah'); emit('allRegion')" :refresh-load="refreshLoad[deskHome]"
                        @refresh="emit('refresh')" :no-detail="noDetail[deskHome]" :error-more="errorMore[deskHome]"
                        @choose-filter="({ filter, item }) => emit('chooseFilter', { is: filter, item })"
                        @loadmore="emit('loadmore')" />
                </div>
                <div class="h-full min-w-[20rem] w-[65%] xl:w-[50%] flex flex-col gap-3.5">
                    <div v-for="name, i in ['pokedex', 'favorit']" :class="['h-full', 'min-h-[5rem] h-20'][dexIndex(i)]"
                        class="rounded-2xl w-full overflow-hidden relative" style="transition: .5s;">
                        <div :class="[layerStyle.wrapper, ['h-full', 'min-h-[5rem] h-20'][dexIndex(i)]]"
                            style="transition: .5s;">
                            <PokemonCards :id="name" v-model:text="models.search[name]" :name="`${name}-desktop-filter`"
                                :page-name="{ text: name[0].toUpperCase() + name.slice(1, name.length), icon: ArrowLeft }"
                                :disable-filter="disableFilter" :error-more="errorMore[name]" :label="filterLabel[name]"
                                @hover="handleDeskDex(name)" @open-filter="val => emit('openFilter', val)"
                                :types="types" :data="filteredPokemon[name]" @open-card="val => emit('openCard', val)"
                                :error="error[name]" v-model:loadmore="models.filter[name].next" :actions="cardActions"
                                :load="filterLoad[name]"
                                @action="val => { i == 0 ? emit('unCatch', val) : emit('unFavourite', val) }"
                                v-model:on-bottom="models.onBottom[name]" v-model:slide="models.cardSlideState[name]"
                                @choose-filter="({ filter, item }) => emit('chooseFilter', { is: filter, item })"
                                :refresh-load="refreshLoad[name]" @refresh="emit('refresh')" :no-detail="noDetail[name]"
                                @loadmore="emit('loadmore')" />
                        </div>
                        <div @click="pokedexIsOpen = i == 0 ? true : false" class="z-[1]" style="transition: .5s;"
                            :class="[layerStyle.content, pokedexIsOpen ? i == 0 ? '-top-20' : 'bottom-0' : i == 0 ? 'top-0' : '-bottom-20']">
                            <span class="text-xl font-bold capitalize">{{ name }}</span>
                            <component :is="i == 0 ? Pokeball : Heart" class="w-8 h-8 stroke-[3]"></component>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #1>
            <DesktopProfileLayout image="hisui">
                <Preference :model-value="prefer" @update:model-value="val => emit('update:prefer', val)"
                    :err-net="profileError.prefer" :temp="preferTemp" @save="val => emit('savePrefer', val)"
                    :load="profileLoad.prefer" @file="val => emit('profileImage', val)" />
            </DesktopProfileLayout>
        </template>
        <template #2>
            <DesktopProfileLayout image="paldea">
                <Password :err-net="profileError.password" :load="profileLoad.password" :data="password"
                    :page="passwordPage" :wrong="passwordWrong" @update:wrong="val => emit('update:passwordWrong', val)"
                    @post="val => emit('postPass', val)" @update:page="val => emit('update:passwordPage', val)"
                    @update:data="val => emit('update:password', val)" />
            </DesktopProfileLayout>
        </template>
        <template #3>
            <DesktopProfileLayout image="kanto">
                <Help />
            </DesktopProfileLayout>
        </template>
        <template #4>
            <DesktopProfileLayout image="unova">
                <Term />
            </DesktopProfileLayout>
        </template>
        <template #5>
            <DesktopProfileLayout image="sinnoh">
                <Privacy />
            </DesktopProfileLayout>
        </template>
    </DesktopLayout>
</template>

<style scoped>
.filter::-webkit-scrollbar {
    display: none;
}
</style>