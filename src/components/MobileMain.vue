<script setup lang="ts">
import { computed, toRefs, ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import PokemonCards from "./PokemonCards.vue";
import Regions from "./Regions.vue";
import Footer from "./Footer.vue";
import MobileProfile from "./Profile/MobileProfile.vue";
import Preference from "./Profile/Preference.vue";
import Password from "./Profile/Password.vue";
import { useMainStore } from "@/stores";
import { storeToRefs } from 'pinia';
import { ArrowLeft, Xmark } from "iconoir-vue/regular";
import { mainProps } from "./Func/method";

const emit = defineEmits(['update:pokedex', 'update:profilePage', 'update:prefer', 'update:password', 'update:passwordPage', 'update:passwordWrong', 'update:subPage', 'mobileRegion', 'desktopRegion', 'openFilter', 'handleFavourite', 'cardConfirm', 'openCard', 'unCatch', 'unFavourite', 'allRegion', 'chooseFilter', 'sign', 'refresh', 'openMenu', 'loadmore', 'savePrefer', 'backProfile', 'profileImage', 'postPass'])
const props = defineProps(mainProps)
const { filterLoad, filter, search, filterLabel, filteredPokemon, filteredFavourite, onBottom, error, cardSlideState, pokedex, disableFilter, allCatched, confirmData, cardActions, profilePage, prefer, profileError, profileLoad, password, passwordPage, passwordWrong, errorMore, noDetail, subPage, subName, user, isLogin } = toRefs(props)

const store = useMainStore()
const { page, regions } = storeToRefs(store)

const models = computed(() => {
    return {
        filter: filter.value,
        search: search.value,
        confirmData: confirmData.value,
        onBottom: onBottom.value,
        cardSlideState: cardSlideState.value,
    }
})

const pageWatcher = computed(() => profilePage.value)
const pageHandler = ref(pageWatcher.value)
watch(profilePage, () => {
    if (profilePage.value > 0) pageHandler.value = profilePage.value;
    else setTimeout(() => { pageHandler.value = 0 }, 500)
})
</script>

<template>
    <div class="flex transition duration-500 [&>*]:min-w-full [&>*]:h-[calc(100vh-60px)] [&>*]:z-[1] [&>*]:overflow-x-hidden
        [&>*]:overflow-y-auto" :style="{ transform: `translateX(-${page.index * 100}%)` }">
        <!-- Beranda -->
        <section>
            <PokemonCards id="beranda" v-model:text="models.search['beranda']" name="home-mobile-filter"
                :label="filterLabel['beranda']" :no-detail="noDetail['beranda']" :disable-filter="disableFilter"
                @open-filter="val => emit('openFilter', val)" @heart="val => emit('handleFavourite', val)"
                :catched="allCatched" v-model:confirm="models.confirmData['beranda'].confirm" :load="filterLoad['beranda']"
                :data="filteredPokemon['beranda']" v-model:on-bottom="models.onBottom['beranda']"
                @open-card="val => emit('openCard', val)" :error="error['beranda']" :refresh-load="refreshLoad['beranda']"
                @refresh="emit('refresh')" @confirm="({ index }) => emit('cardConfirm', { index, name: 'beranda' })"
                :heart="filteredFavourite['beranda']" v-model:loadmore="models.filter['beranda'].next"
                :error-more="errorMore['beranda']" @loadmore="emit('loadmore')" />
        </section>
        <!-- Wilayah -->
        <section>
            <div class="flex w-full h-full transition duration-500 [&>*]:min-w-full [&>*]:z-[1]"
                :style="{ transform: `translateX(-${subPage * 100}%)` }">
                <div class="p-6 pb-12 overflow-y-auto text-slate-800">
                    <b class="text-lg xs:text-xl">Wilayah</b>
                    <p class="text-sm xs:text-base mt-1 mb-6">
                        Jelajahi wilayah tertentu untuk menemukan pokemon yang kamu inginkan</p>
                    <Regions :data="Object.keys(regions)" @open="val => emit('mobileRegion', val)" />
                </div>
                <div class="overflow-hidden">
                    <PokemonCards id="wilayah" v-model:text="models.search['wilayah']" name="region-filter"
                        :page-name="subName" subpage @back="emit('update:subPage', 0)" :label="filterLabel['wilayah']"
                        :load="filterLoad['wilayah']" :disable-filter="disableFilter" :error="error['wilayah']"
                        @open-filter="val => emit('openFilter', val)" :heart="filteredFavourite['wilayah']"
                        v-model:confirm="models.confirmData['wilayah'].confirm" @heart="val => emit('handleFavourite', val)"
                        v-model:on-bottom="models.onBottom['wilayah']" @open-card="val => emit('openCard', val)"
                        @confirm="({ index }) => emit('cardConfirm', { index, name: 'wilayah' })"
                        :no-detail="noDetail['wilayah']" :refresh-load="refreshLoad['wilayah']" @refresh="emit('refresh')"
                        :data="filteredPokemon['wilayah']" v-model:loadmore="models.filter['wilayah'].next"
                        :error-more="errorMore['wilayah']" @loadmore="emit('loadmore')" />
                </div>
            </div>
        </section>
        <!-- Favorit -->
        <section>
            <PokemonCards id="favorit" v-model:text="models.search['favorit']" name="favourite-mobile-filter"
                :page-name="{ text: 'Favorit', icon: ArrowLeft }" :label="filterLabel['favorit']"
                :load="filterLoad['favorit']" :disable-filter="disableFilter" @open-filter="val => emit('openFilter', val)"
                :data="filteredPokemon['favorit']" @open-card="val => emit('openCard', val)"
                :refresh-load="refreshLoad['favorit']" @refresh="emit('refresh')" :no-detail="noDetail['favorit']"
                v-model:loadmore="models.filter['favorit'].next" :actions="cardActions" :error="error['favorit']"
                @action="val => emit('unFavourite', val)" v-model:on-bottom="models.onBottom['favorit']"
                v-model:slide="models.cardSlideState['favorit']" :error-more="errorMore['favorit']"
                @loadmore="emit('loadmore')" />
        </section>
        <!-- Profil -->
        <section class="bg-gray-200">
            <MobileProfile :is-login="isLogin" :data="user" @sign="emit('sign')" @open="val => emit('openMenu', val)" />
        </section>
    </div>
    <!-- Footer -->
    <Footer :is-login="isLogin" @pokedex="emit('update:pokedex', true)" @login="emit('sign')" />
    <!-- Profile Page -->
    <aside class="fixed h-screen w-full top-0 right-0 transition duration-500 bg-white p-4"
        :style="{ transform: `translateX(${profilePage > 0 ? 0 : -100}%)` }">
        <Preference v-if="pageHandler == 2" :model-value="prefer" @update:model-value="val => emit('update:prefer', val)"
            :err-net="profileError.prefer" :temp="preferTemp" @save="val => emit('savePrefer', val)"
            @back="emit('backProfile')" :load="profileLoad.prefer" @file="val => emit('profileImage', val)" />
        <Password v-if="pageHandler == 3" @back="emit('backProfile')" :err-net="profileError.password"
            :wrong="passwordWrong" @update:wrong="val => emit('update:passwordWrong', val)" :load="profileLoad.password"
            :data="password" :page="passwordPage" @post="val => emit('postPass', val)"
            @update:page="val => emit('update:passwordPage', val)" @update:data="val => emit('update:password', val)" />
    </aside>
    <!-- Pokedex -->
    <section class="pokedex fixed overflow-auto h-screen w-full top-0 bg-white transition duration-500"
        :style="{ transform: `translateY(${pokedex ? '0' : '100'}%)` }">
        <PokemonCards id="pokedex" v-model:text="models.search['pokedex']" name="pokedex-mobile-filter"
            :page-name="{ text: 'Pokedex', back: true, icon: Xmark }" @back="emit('update:pokedex', false)"
            :label="filterLabel['pokedex']" :disable-filter="disableFilter" :load="filterLoad['pokedex']"
            @open-filter="val => emit('openFilter', val)" :data="filteredPokemon['pokedex']" :actions="cardActions"
            @action="val => emit('unCatch', val)" @open-card="val => emit('openCard', val)" :error="error['pokedex']"
            v-model:loadmore="models.filter['pokedex'].next" v-model:on-bottom="models.onBottom['pokedex']"
            v-model:slide="models.cardSlideState['pokedex']" :refresh-load="refreshLoad['pokedex']"
            @refresh="emit('refresh')" :no-detail="noDetail['pokedex']" :error-more="errorMore['pokedex']"
            @loadmore="emit('loadmore')" />
    </section>
</template>

<style scoped>
.pokedex:deep(#pokedex) {
    padding-top: 3.5rem;
}
</style>