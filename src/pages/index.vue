<script setup lang="ts">
import { ref, computed, reactive } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
import PokemonCards from "~/PokemonCards.vue";
import Footer from "~/Footer.vue";
import Regions from "~/Regions.vue";
import { useMainStore } from "@/stores"
import PokemonDetail from "~/PokemonDetail.vue"
import { storeToRefs } from 'pinia';
import { TrashSolid, ArrowLeft, Xmark } from "@iconoir/vue";
import BottomPaneWrapper from "~/BottomPaneWrapper.vue";
import type { PokemonCard, Pokemon, Favourite, Filter, MyPokemon } from "@/types";
import debounce from 'lodash.debounce';
import { doFilter, doHeart, initData } from "./_index"
import Local from "../api/local"
import { overflowHandler } from "@/components";

const store = useMainStore()
const { page, pokemons, favourites, myPokemon, regions, types, justFavourite, favouriteData, pokedexData } = storeToRefs(store)

// navigation index for region page
const regionSubPage = ref(0)
// define page name in header of each region
const regionPageName = reactive({ text: 'kanto', back: true, icon: ArrowLeft })
// define slide state in favourite page and pokedex page
const cardSlideState = reactive<Record<string, boolean[]>>({ favorit: [], pokedex: [] })

// action list for cards in favourite and pokedex pages, learn more in PokemonCard.vue
const cardActions = [
    { label: 'remove', icon: TrashSolid, color: { init: 'rose-500', hover: 'rose-500/80' }, async: false },
]

const onBottom = ref(false)
const paneFor = ref('')
const paneIsOpen = reactive<Record<string, boolean>>({
    type: false,
    sort: false,
    confirm: false,
    pokedex: false,
})

// filter params to filter data
/*
    search: to filter by name of pokemon
    type: to filter by type of pokemon
    sort:
        by: (id/name) to sort by id or name of pokemon
        mode: (asc/desc) to sort as ascending or descending
    region: (all/a region) to filter by spreading of pokemons
    next: if true, this param informs that there are still some pokemons that can be displayed based on filter results
*/
const filter = reactive<Record<string, Filter>>({
    beranda: { search: '', type: '', sort: { by: 'id', mode: 'asc' }, region: '', next: true, mode: '' },
    wilayah: { search: '', type: '', sort: { by: 'id', mode: 'asc' }, region: '', next: true, mode: '' },
    favorit: { search: '', type: '', sort: { by: 'id', mode: 'asc' }, region: '', next: true, mode: 'favourite' },
    pokedex: { search: '', type: '', sort: { by: 'id', mode: 'asc' }, region: '', next: true, mode: 'catched' },
})

// loading state on filter progress
const filterLoad = reactive<Record<string, boolean>>({ type: false, sort: false })
// label state in filter by type and sort
const filterLabel = reactive<Record<string, Record<string, string>>>({
    beranda: { type: '', sort: 'Nomor 1 - N' },
    wilayah: { type: '', sort: 'Nomor 1 - N' },
    favorit: { type: '', sort: 'Nomor 1 - N' },
    pokedex: { type: '', sort: 'Nomor 1 - N' }
})

const pokedex = ref(false)
const forPokedex = computed(() => pokedex.value ? 'pokedex' : page.value.name)
// list of method for filter by type and sort
const filterItems = computed(() => {
    if (paneFor.value == 'type') return ['', ...availableType[forPokedex.value]]
    if (paneFor.value == 'sort') return ['Nomor 1 - N', 'Nomor N - 1', 'Nama A - Z', 'Nama Z - A']
})

// open filter pane
const openFilter = (filter: string) => {
    const el = document.getElementById('filter-pane') as HTMLElement;
    if (el) el.scrollTop = 0;
    paneFor.value = filter;
    paneIsOpen[filter] = true
}

// change filter and its label value when one item in filter pane has been clicked
const chooseFilter = (is: string, item: string) => {
    if (is == 'type') {
        if (item !== filterLabel[forPokedex.value].type) {
            filter[forPokedex.value].type = item
            filterLabel[forPokedex.value].type = item
            filterLoad[is] = true
        }
    } else {
        if (item !== filterLabel[forPokedex.value].sort) {
            filter[forPokedex.value].sort.by = item.startsWith('Nomor') ? 'id' : 'name';
            filter[forPokedex.value].sort.mode = item.includes('1 -') || item.includes('A -') ? 'asc' : 'desc';
            filterLabel[forPokedex.value].sort = item
            filterLoad[is] = true
        }
    }
    paneIsOpen[is] = false
}

const typesLabel = (idx: number, type: string) => idx == 0 ? 'Semua Tipe' : `Tipe ${type[0].toUpperCase() + type.slice(1, type.length)}`

// model for search input
const search = reactive<Record<string, string>>({ beranda: '', wilayah: '', favorit: '', pokedex: '' })

// debounce user type for 500ms
const bounce = debounce(() => {
    filter[forPokedex.value].search = search[forPokedex.value]
    filterPokemon()
}, 500)

watch(search, () => {
    bounce()
}, { deep: true })

// list of types that available in current page
const availableType = reactive<Record<string, string[]>>({ beranda: [], wilayah: [], favorit: [], catched: [] })
const getTypesColor = (type: string, idx: number) => {
    if (idx == 0 || paneFor.value == 'sort') return 'bg-slate-300/80 hover:bg-slate-300/90 active:bg-slate-300';
    else return `bg-${type}-1/50 hover:bg-${type}-1/60 active:bg-${type}-1/70`
}

// this is the datas that dislayed to user
const filteredPokemon = reactive<Record<string, PokemonCard[]>>({ beranda: [], wilayah: [], favorit: [], pokedex: [] })

// this is favourite states for displayed datas
const filteredFavourite = reactive<Record<string, Favourite[]>>({ beranda: [], wilayah: [], favorit: [], pokedex: [] })

const filterData = (pokemon: PokemonCard[]) => pokemon.filter((data) => data.image !== '')
const filterHeart = (heart: Favourite[], types: string) => heart.filter((data) => filteredPokemon[types].map((d) => d.id).includes(data.id))
const filterType = (types: PokemonCard[]) => [...new Set(types.map((data) => data.types).flat())]
const hideSplash = ref(false)

onMounted(async () => {
    document.getElementById("splash")?.remove()
    overflowHandler('hidden')
    // INI DATANYA MUNCUL DI CONSOLE TAPI KOK GAK BISA DI CONSUME. ARGHHHHH
    const { data, error } = await initData(regions.value, types.value)
    store.$patch({ pokemons: data })
    let favourite = Local.getData('poke-love') as Favourite[]
    let pokedex = Local.getData('poke-dex') as MyPokemon[]
    if (!favourite) favourite = data.map((p) => { return { id: p.id, state: false, date: '' } })
    if (!pokedex) pokedex = []
    store.$patch({ favourites: favourite, myPokemon: pokedex })

    filteredPokemon['beranda'] = filterData(data)
    filteredFavourite['beranda'] = filterHeart(favourite, 'beranda')
    availableType['beranda'] = types.value
    filteredFavourite['pokedex'] = filterHeart(favourite, 'pokedex')
    availableType['pokedex'] = filterType(pokedexData.value)
    filteredPokemon['favorit'] = filterData(favouriteData.value)
    filteredFavourite['favorit'] = filterHeart(favourite, 'favorit')
    availableType['favorit'] = filterType(favouriteData.value)
    cardSlideState['favorit'] = favourite.map((_, i) => false)

    overflowHandler('auto')
    hideSplash.value = true
})

// watch change of favourite datas
watch(favourites, () => {
    filteredPokemon['favorit'] = favouriteData.value.filter((data) => data.image !== '')
    availableType['favorit'] = [...new Set(favouriteData.value.map((data) => data.types).flat())]
})

// filter data by filter
const filterPokemon = async () => {
    const result = await doFilter({
        filter: filter[forPokedex.value],
        all: pokemons.value,
        heart: justFavourite.value,
        catch: myPokemon.value.map((data) => data.id)
    })
    filter[forPokedex.value].next = result.next

    setTimeout(() => {
        // update filteredPokemon data and filteredFavourite
        filterLoad.type = false;
        filterLoad.sort = false;
        const filteredIds = result.data.map((data) => data.id)
        filteredPokemon[forPokedex.value] = result.data
        filteredFavourite[forPokedex.value] = favourites.value.filter((data) => filteredIds.includes(data.id))
    }, 2000)
}

// watch change on filter
watch(filter, () => { filterPokemon() }, { deep: true })

// trigger filter function to load more data when user has scroll to the bottom
watch(onBottom, () => {
    if (onBottom.value) {
        if (filter[forPokedex.value].next) filterPokemon()
        setTimeout(() => { onBottom.value = false }, 2000)
    }
}, { deep: true })

const confirmType = ref('')
const confirmData = reactive<Record<string, { text: string, confirm: { state: boolean, index: number } }>>({
    home: { text: '', confirm: { state: false, index: 0 } },
    region: { text: '', confirm: { state: false, index: 0 } },
    side: { text: '', confirm: { state: false, index: 0 } },
    pokedex: { text: '', confirm: { state: false, index: 0 } },
})

// to change favourite state of selected data, learn more in PokemonCard.vue
const handleFavourite = ({ index, endload }: { index: number, endload: () => void }) => {
    store.$patch({ favourites: doHeart({ toHandle: filteredFavourite[forPokedex.value], index, all: favourites.value }) })
    endload()
    // setTimeout(() => { endload() }, 1000) // use this to perfom loading simulation
}

const openConfirm = ({ index }: { index: number }) => {
    const selectedData = filteredPokemon[forPokedex.value][index]
    confirmData[confirmType.value].text = selectedData.name
    confirmData[confirmType.value].confirm.index = index
    paneFor.value = 'confirm'
    paneIsOpen['confirm'] = true;
}

const onFavouriteConfirm = (index: number) => {
    if (index == 1) confirmData[confirmType.value].confirm.state = true;
    paneIsOpen['confirm'] = false;
}

// filter by region for mobile user
const openRegion = ({ name, endload }: { name: string, endload: () => void }) => {
    const el = document.getElementById('region') as HTMLElement;
    if (el) el.scrollTop = 0;
    search['wilayah'] = ''
    filter.wilayah = { search: '', sort: { by: 'id', mode: 'asc' }, type: '', region: name, next: true, mode: '' }
    availableType['wilayah'] = [...new Set(pokemons.value.filter((d) => d.spread.includes(name)).map((d) => d.types).flat())]
    regionPageName.text = name;
    // endload()
    setTimeout(() => {
        endload()
        regionSubPage.value = 1
    }, 2000) // use this to perfom loading simulation
}

const unFavourite = ({ index, id }: { index: number, id: string }) => {
    store.$patch({
        favourites: favourites.value.map((data) => {
            let temp = data;
            if (temp.id == id) {
                temp.state = false;
                temp.date = '';
            }
            return temp
        }),
    })
    cardSlideState['favorit'].splice(index, 1)
}

const getPokemon = () => {
    return {
        id: '0002',
        name: 'ivysaur',
        gif: 'alola-01.avif',
        types: ['grass', 'poison'],
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. A ipsam amet libero deserunt minima nesciunt quo sequi fugit nostrum esse, sit, itaque animi facere, tenetur quia perferendis labore suscipit. Esse.',
        detail: {
            weight: '6.9 kg',
            height: '0.7 m',
            spread: ['kanto', 'johto'],
            abilities: ['overgrow', 'poison'],
        },
        femalePossibility: .5,
        weakness: ['flying', 'fighting', 'dragon', 'fairy'],
        evolution: [
            { id: '0001', name: 'bulbasaur', image: 'alola-01.avif', types: ['grass', 'poison'], minLevel: 0 },
            { id: '0002', name: 'ivysaur', image: 'alola-02.avif', types: ['grass', 'poison'], minLevel: 16 },
            { id: '0003', name: 'venusaur', image: 'alola-03.avif', types: ['grass', 'poison'], minLevel: 36 },
        ]
    }
}

const selectedIndex = ref(0)
const selectedFavourite = ref({ id: '', state: false, date: '' })
const selectedCatched = ref({ state: false, date: '' })
const sideIsOpen = ref(false)
const allCatched = computed(() => myPokemon.value.map((data) => data.id))

const openCard = async ({ index, endload }: { index: number, endload: () => void }) => {
    selectedIndex.value = index
    selectedFavourite.value = filteredFavourite[forPokedex.value][index];
    if (allCatched.value.includes(selectedFavourite.value.id)) {
        selectedCatched.value.state = true;
        selectedCatched.value.date = myPokemon.value.find((data) => data.id == selectedFavourite.value.id)?.date as string
    } else {
        selectedCatched.value = { state: false, date: '' }
    }
    selectedPokemon.value = getPokemon()
    setTimeout(() => {
        sideIsOpen.value = true;
        endload()
    }, 1000)
}

const handleCatch = ({ endload }: { endload: () => void }) => {
    const id = filteredPokemon[forPokedex.value][selectedIndex.value].id
    const temp = { id, date: new Date().toLocaleDateString() }
    store.$patch({ myPokemon: [...myPokemon.value, temp] })
    selectedCatched.value = { state: true, date: temp.date }
    setTimeout(() => { endload() }, 5000)
}

const selectedPokemon = ref<Pokemon>({
    id: '0001',
    name: 'bulbasaur',
    gif: 'alola-01.avif',
    types: ['grass', 'poison'],
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. A ipsam amet libero deserunt minima nesciunt quo sequi fugit nostrum esse, sit, itaque animi facere, tenetur quia perferendis labore suscipit. Esse.',
    detail: {
        weight: '6.9 kg',
        height: '0.7 m',
        spread: ['kanto', 'johto'],
        abilities: ['overgrow', 'poison'],
    },
    femalePossibility: .5,
    weakness: ['flying', 'fighting', 'dragon', 'fairy'],
    evolution: [
        { id: '0001', name: 'bulbasaur', image: 'alola-01.avif', types: ['grass', 'poison'], minLevel: 0 },
        { id: '0002', name: 'ivysaur', image: 'alola-02.avif', types: ['grass', 'poison'], minLevel: 16 },
        { id: '0003', name: 'venusaur', image: 'alola-03.avif', types: ['grass', 'poison'], minLevel: 36 },
    ]
})
</script>

<template>
    <div class="flex transition duration-500 [&>*]:min-w-full [&>*]:h-[calc(100vh-60px)] [&>*]:z-[1] [&>*]:overflow-x-hidden
        [&>*]:overflow-y-auto" :style="{ transform: `translateX(-${page.index * 100}%)` }">
        <!-- Beranda -->
        <section>
            <PokemonCards id="home" v-model:text="search['beranda']" name="home-filter" :label="filterLabel['beranda']"
                :load="filterLoad" @open-filter="openFilter" @heart="handleFavourite" :catched="allCatched"
                @confirm="({ index }) => { confirmType = 'home'; openConfirm({ index }) }"
                v-model:confirm="confirmData.home.confirm" :data="filteredPokemon['beranda']"
                :heart="filteredFavourite['beranda']" @open-card="openCard" v-model:loadmore="filter['beranda'].next"
                v-model:on-bottom="onBottom" />
        </section>
        <!-- Wilayah -->
        <section>
            <div class="flex w-full h-full transition duration-500 [&>*]:min-w-full [&>*]:z-[1]"
                :style="{ transform: `translateX(-${regionSubPage * 100}%)` }">
                <div class="p-6 pb-12 overflow-y-auto text-slate-800">
                    <b class="text-lg xs:text-xl">Wilayah</b>
                    <p class="text-sm xs:text-base mt-1 mb-6">
                        Jelajahi wilayah tertentu untuk menemukan pokemon yang kamu inginkan</p>
                    <Regions :data="regions" @open="openRegion" />
                </div>
                <div class="overflow-hidden">
                    <PokemonCards id="region" v-model:text="search['wilayah']" name="region-filter"
                        :page-name="regionPageName" subpage @back="regionSubPage = 0" :label="filterLabel['wilayah']"
                        :load="filterLoad" @open-filter="openFilter" :heart="filteredFavourite['wilayah']"
                        v-model:confirm="confirmData.region.confirm" @heart="handleFavourite"
                        @confirm="({ index }) => { confirmType = 'region'; openConfirm({ index }) }"
                        :data="filteredPokemon['wilayah']" @open-card="openCard" v-model:loadmore="filter['wilayah'].next"
                        v-model:on-bottom="onBottom" />
                </div>
            </div>
        </section>
        <!-- Favorit -->
        <section>
            <PokemonCards id="favourite" v-model:text="search['favorit']" name="favourite-filter"
                :page-name="{ text: 'Favorit', icon: ArrowLeft }" :label="filterLabel['favorit']" :load="filterLoad"
                @open-filter="openFilter" :data="filteredPokemon['favorit']" @open-card="openCard"
                v-model:loadmore="filter['favorit'].next" :actions="cardActions" @action="unFavourite"
                v-model:on-bottom="onBottom" v-model:slide="cardSlideState['favorit']" />
        </section>
        <!-- Profil -->
        <section class="bg-yellow-500"></section>
    </div>
    <!-- Footer -->
    <Footer @pokedex="pokedex = true" />
    <!-- Pokedex -->
    <section class="pokedex fixed overflow-auto h-screen w-full top-0 bg-white transition duration-500"
        :style="{ transform: `translateY(${pokedex ? '0' : '100'}%)` }">
        <PokemonCards id="pokedex" v-model:text="search['pokedex']" name="pokedex-filter"
            :page-name="{ text: 'Pokedex', back: true, icon: Xmark }" @back="pokedex = false"
            :label="filterLabel['pokedex']" :load="filterLoad" @open-filter="openFilter" :data="filteredPokemon['pokedex']"
            :actions="cardActions" @action="false" @open-card="openCard" v-model:loadmore="filter['pokedex'].next"
            v-model:on-bottom="onBottom" />
    </section>
    <!-- Detail Pokemon -->
    <PokemonDetail :data="selectedPokemon" :favourite="selectedFavourite" :catched="selectedCatched" :index="selectedIndex"
        v-model:side-page="sideIsOpen" @heart="handleFavourite" v-model:confirm="confirmData.side.confirm"
        @confirm="({ index }) => { confirmType = 'side'; openConfirm({ index }) }" @catch="handleCatch" />
    <!-- Pane -->
    <BottomPaneWrapper v-model:open="paneIsOpen[paneFor]">
        <!-- For Filter -->
        <div v-if="paneFor == 'type' || paneFor == 'sort'" id="filter-pane"
            class="filter flex flex-wrap gap-3 px-5 [&>*]:w-full h-fit max-h-[70vh] overflow-y-auto pt-1">
            <span v-for="item, idx in filterItems" @click="chooseFilter(paneFor, item)" :class="getTypesColor(item, idx)"
                class="grow basis-[248px] min-h-[2.5rem] transition duration-300
                cursor-pointer px-5 rounded-[.65rem] text-slate-800 font-semibold text-center grid place-items-center">
                {{ paneFor == 'type' ? `Tampilkan ${typesLabel(idx, item)}` : item }}</span>
        </div>
        <!-- For Confirm -->
        <div v-if="paneFor == 'confirm'" class="px-5 [&>*]:w-full h-fit max-h-[70vh] pt-1 flex flex-col gap-5">
            <b class="text-center text-slate-800">
                Apakah kamu yakin ingin menghapus <span class="capitalize">{{ confirmData[confirmType].text }}</span> dari
                Favorit ?</b>
            <div class="flex flex-wrap gap-3 [&>*]:w-full">
                <button v-for="text, idx in ['Batalkan', 'Ya, Hapus']" @click="onFavouriteConfirm(idx)" class="grow basis-[120px]
                min-h-[2.5rem] transition duration-300 font-semibold rounded-md first:bg-slate-300/80 hover:first:bg-slate-300/90
                active:first:bg-slate-300 first:text-slate-800 last:bg-fill-1/80 hover:last:bg-fill-1/90 active:last:bg-fill-1
                last:text-white">{{ text }}</button>
            </div>
        </div>
    </BottomPaneWrapper>
    <!-- splash screen -->
    <div id="domsplash" :style="{ transform: `translateX(${hideSplash ? 100 : 0}%)` }"
        class="w-full h-screen top-0 flex justify-center items-center fixed bg-white transition duration-500 z-[10]">
        <img src="@/assets/logo.svg" width="500" height="184" class="w-[70vw] max-w-[500px]" alt="logo">
    </div>
</template>

<style scoped>
.filter::-webkit-scrollbar {
    display: none;
}

.pokedex:deep(#pokedex) {
    padding-top: 3.5rem;
}
</style>