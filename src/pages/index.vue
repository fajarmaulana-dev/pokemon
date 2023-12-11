<script setup lang="ts">
import { ref, computed, reactive } from "@vue/reactivity";
import { onMounted, watch, inject } from "@vue/runtime-core";
import DesktopMain from "~/DesktopMain.vue";
import MobileMain from "~/MobileMain.vue";
import MobileMainPane from "~/MobileMainPane.vue";
import SplashScreen from "~/SplashScreen.vue";
import { useMainStore } from "@/stores"
import PokemonDetail from "~/PokemonDetail.vue";
import { storeToRefs } from 'pinia';
import { TrashSolid, ArrowLeft } from "@iconoir/vue";
import Modal from "~/Modal.vue"
import type { PokemonCard, Pokemon, Favourite, Filter, MyPokemon, Names } from "@/types";
import debounce from 'lodash.debounce';
import { doFilter, initData, getPokeDetail } from "~/Func/data";
import Local from "../api/local"
import { overflowHandler } from "~/.";
import { toTop, filterFunc, setLocalData, getTypes, doHeart, doCatch } from "~/Func/method"

// const trashsolid = inject('TrashSolid')

const store = useMainStore()
const { page, favourites, favouriteType, myPokemon, myPokemonType, regions, types, names, genders } = storeToRefs(store)

// navigation index for region page
const regionSubPage = ref(0)
// define page name in header of each region
const regionPageName = reactive({ text: 'kanto', back: true, icon: ArrowLeft })
// define slide state in favourite page and pokedex page
const cardSlideState = reactive<Record<string, boolean[]>>({ favorit: [], pokedex: [] })

// action list for cards in favourite and pokedex pages, learn more in PokemonCard.vue
const cardActions = [{ label: 'remove', icon: TrashSolid, color: { init: 'rose-500', hover: 'rose-500/80' }, async: false }]

const pokedex = ref(false)
const forPokedex = computed(() => pokedex.value ? 'pokedex' : page.value.index < 3 ? page.value.name : 'favorit')
const paneFor = ref('')
const paneIsOpen = reactive<Record<string, boolean>>({ type: false, sort: false, confirm: false, pokedex: false })

// some trick to create reactive needs by menu label
const menuLabel = ['beranda', 'wilayah', 'favorit', 'pokedex']
const reGen = (labels: string[], value: any) => Object.fromEntries(labels.map((label) => [label, value]))
const onBottom = reactive<Record<string, boolean>>(reGen(menuLabel, false))
const errors = reactive<Record<string, boolean>>(reGen(menuLabel, false))
const screenWidth = ref(window.innerWidth);
const screenHeight = ref(window.innerHeight);

// filter params to filter data
/*
    search: to filter by name of pokemon
    type: to filter by type of pokemon
    sort:
        by: (id/name) to sort by id or name of pokemon
        mode: (asc/desc) to sort as ascending or descending
    region: (all/a region) to filter by spreading of pokemons
    next: if true, this param informs that there are still some pokemons that can be displayed based on filter results
    mode: to give diffence between pages
*/

const filter = reactive<Record<string, Filter>>(Object.fromEntries(menuLabel.map((label) => {
    return [label, { search: '', type: '', sort: { by: 'id', mode: 'asc' }, region: '', next: true, mode: ['favorit', 'pokedex'].includes(label) ? label : '' }];
})))

// loading state on filter progress
const filterLoad = reactive<Record<string, Record<string, boolean>>>({
    beranda: { type: false, sort: false, search: false, region: false },
    wilayah: { type: false, sort: false, search: false, region: false },
    favorit: { type: false, sort: false, search: false, region: false },
    pokedex: { type: false, sort: false, search: false, region: false }
})

// disable filter feature when filter action already trigged or when user request for more data
const disableFilter = computed(() => {
    const onMore = onBottom[forPokedex.value] && filter[forPokedex.value].next
    return Object.keys(filterLoad[forPokedex.value]).some((f) => filterLoad[forPokedex.value][f]) || onMore
})

// disable more data request when filter action already under perform
watch(() => filterLoad[forPokedex.value], () => {
    if (Object.keys(filterLoad[forPokedex.value]).some((f) => filterLoad[forPokedex.value][f])) {
        filter[forPokedex.value].next = false
    } else {
        filter[forPokedex.value].next = true
    }
})
// label state in filter by type and sort
const filterLabel = reactive<Record<string, Record<string, string>>>({
    beranda: { type: '', sort: 'Nomor 1 - N' },
    wilayah: { type: '', sort: 'Nomor 1 - N' },
    favorit: { type: '', sort: 'Nomor 1 - N' },
    pokedex: { type: '', sort: 'Nomor 1 - N' }
})

// list of method for filter by type and sort
const filterItems = computed(() => {
    if (paneFor.value == 'type') return ['', ...availableType[forPokedex.value]]
    if (paneFor.value == 'sort') return ['Nomor 1 - N', 'Nomor N - 1', 'Nama A - Z', 'Nama Z - A']
})

// open filter pane
const openFilter = (filter: string) => {
    if (screenWidth.value < 768) {
        toTop('filter-pane')
        paneFor.value = filter;
        paneIsOpen[filter] = true
    }
}

// change filter and its label value when one item in filter pane has been clicked
const chooseFilter = (is: string, item: string) => {
    const { filterRes, labelRes, loadRes } = filterFunc(is, item, filter[forPokedex.value], filterLabel[forPokedex.value], filterLoad[forPokedex.value][is])
    filter[forPokedex.value] = filterRes;
    filterLabel[forPokedex.value] = labelRes;
    filterLoad[forPokedex.value][is] = loadRes;
    paneIsOpen[is] = false
}

// model for search input
const search = reactive<Record<string, string>>(reGen(menuLabel, ''))

// debounce user type for 500ms
const bounce = debounce(async () => {
    filter[forPokedex.value].search = search[forPokedex.value]
    filterLoad[forPokedex.value].search = true
    errors[forPokedex.value] = false
    try {
        await filterPokemon('filter')
        filterLoad[forPokedex.value].search = false
        toTop(forPokedex.value)
        setTimeout(() => {
            const el = document.getElementById(`${['favorit', 'pokedex'].includes(forPokedex.value) ? forPokedex.value : 'home'}-desktop-filter`)
            el?.focus()
        }, 100)
    } catch (error) {
        filterLoad[forPokedex.value].search = false
        errors[forPokedex.value] = true
    }
}, 500)

watch(() => search[forPokedex.value], () => {
    if (forPokedex.value == previousPage.value) bounce()
    previousPage.value = forPokedex.value
})

// list of types that available in current page
const availableType = reactive<Record<string, string[]>>(reGen(menuLabel, []))

// this is the datas that dislayed to user
const filteredPokemon = reactive<Record<string, PokemonCard[]>>(reGen(menuLabel, []))

// this is favourite states for displayed datas
const filteredFavourite = reactive<Record<string, Favourite[]>>(reGen(menuLabel, []))

const filterType = (types: PokemonCard[]) => [...new Set(types.map((data) => data.types).flat())]
const hideSplash = ref(false)

// save favourites and pokedex data to local storage when browser refreshed
const refreshed = ref(false)
watch(refreshed, () => { setLocalData(favourites.value, myPokemon.value, favouriteType.value, myPokemonType.value) })
// to show error network message when the value is true
const err_network = ref(false)

const fetch_init = async () => {
    // get favourite and pokedex data from local storage
    err_network.value = false
    let favourite = Local.getData('poke-love') as Favourite[] || []
    let pokedexes = Local.getData('poke-dex') as MyPokemon[] || []
    let favouriteTypes = Local.getData('type-love') as Record<string, number> || favouriteType.value
    let pokedexesType = Local.getData('type-dex') as Record<string, number> || myPokemonType.value
    // get initial data
    const initNeeds = { regions: Object.keys(regions.value), types: Object.keys(types.value), favourite, catched: pokedexes }
    try {
        const { data, names, spreads, variants, favouriteData, mineData, genders } = await initData(initNeeds)
        // create favourite data with all state as false when no favourite data is initialized
        if (favourite.length == 0) favourite = names.map((p: Names) => { return { id: p.id, state: false, date: '' } })

        // store some data to global state for further use
        store.$patch({ favourites: favourite, favouriteType: favouriteTypes, myPokemon: pokedexes, myPokemonType: pokedexesType, names, regions: spreads, types: variants, genders })

        // store initial data to reactive variables
        setTimeout(() => {
            filteredPokemon['beranda'] = data
            filteredFavourite['beranda'] = favourite.slice(0, 20)
            availableType['beranda'] = Object.keys(types.value)
            filteredPokemon['wilayah'] = data
            availableType['wilayah'] = Object.keys(types.value)
            filteredPokemon['pokedex'] = mineData
            filteredFavourite['pokedex'] = favourite.filter((data) => mineData.map((d) => d.id).includes(data.id))
            availableType['pokedex'] = filterType(mineData)
            filteredPokemon['favorit'] = favouriteData
            filteredFavourite['favorit'] = favourite.filter((data) => data.state)
            availableType['favorit'] = filterType(favouriteData)
            cardSlideState['favorit'] = favouriteData.map((_, i) => false)
            cardSlideState['pokedex'] = mineData.map((_, i) => false)
            hideSplash.value = true
            overflowHandler('auto')
        }, 1000)
    } catch (err) {
        err_network.value = true
    }
}

onMounted(async () => {
    // detect refreshed tab
    window.addEventListener('beforeunload', () => {
        refreshed.value = true;
    })
    // detect page resize event
    screenWidth.value = window.innerWidth;
    window.addEventListener('resize', () => {
        screenWidth.value = window.innerWidth;
        screenHeight.value = window.innerHeight;
    })
    // change functionality of back button to back between component
    history.pushState('fake', '', document.URL)
    window.onpopstate = () => {
        history.pushState('fake', '', document.URL)
        if (sideIsOpen.value) {
            sideIsOpen.value = false
        } else if (pokedex.value) {
            pokedex.value = false
        } else {
            if (page.value.index > 0) {
                store.$patch({ page: { name: 'beranda', index: 0 } })
            }
            else {
                refreshed.value = true
                setTimeout(() => { history.go(-history.length + 1) }, 0)
            }
        }
    }

    // remove startup splash screen on mounted
    document.getElementById("splash")?.remove()
    // overflow hidden before data is ready
    overflowHandler('hidden')
    await fetch_init()
})

const dataUpdated = reactive<Record<string, boolean>>({ favorit: false, pokedex: false })
const transformType = (types: Record<string, number>) => Object.keys(types).filter((d) => types[d] > 0)
// watch change of favourite datas
watch(favourites, async () => {
    availableType['favorit'] = transformType(favouriteType.value);
    errors['favorit'] = false
    // auto update favourite for desktop mode
    if (screenWidth.value >= 768) {
        try { await filterPokemon('filter', 'favorit') }
        catch (error) { errors['favorit'] = true }
    }
}, { deep: true })

// watch change of pokedex datas
watch(myPokemon, async () => {
    availableType['pokedex'] = transformType(myPokemonType.value);
    errors['pokedex'] = false
    // auto update pokedex for desktop mode
    if (screenWidth.value >= 768) {
        try { await filterPokemon('filter', 'pokedex') }
        catch (error) { errors['pokedex'] = true }
    }
}, { deep: true })

// filter data by filter param
const filterPokemon = async (mode: string, isTo: string = forPokedex.value) => {
    const result = await doFilter({
        filter: filter[isTo],
        init: filteredPokemon[isTo],
        heart: favourites.value.filter((data) => data.state).map((data) => data.id),
        catches: myPokemon.value.map((data) => data.id),
        names: names.value,
        types: types.value,
        regions: regions.value,
        mode
    })

    // update filteredPokemon data and filteredFavourite
    filter[isTo].next = result.next
    filterLoad[isTo].type = false;
    filterLoad[isTo].sort = false;
    const filteredIds = result.data.map((data) => data.id)
    filteredPokemon[isTo] = result.data
    filteredFavourite[isTo] = favourites.value.filter((data) => filteredIds.includes(data.id))
}

// watch change on filter
const previousPage = ref('beranda')
const refresh = ref(false)
watch(() => [filter[forPokedex.value].type, filter[forPokedex.value].sort.by, filter[forPokedex.value].sort.mode, refresh.value], async () => {
    // prevent update on navigation action when no update in destination page
    if ((forPokedex.value == previousPage.value) || filter[forPokedex.value].mode == forPokedex.value && dataUpdated[forPokedex.value]) {
        errors[forPokedex.value] = false
        try {
            await filterPokemon('filter')
            toTop(forPokedex.value)
            dataUpdated[forPokedex.value] = false
        } catch (error) {
            errors[forPokedex.value] = true
        }
    }
    previousPage.value = forPokedex.value
    refresh.value = false
})

// trigger filter function to load more data when user has scroll to the bottom
watch(() => onBottom[forPokedex.value], async () => {
    if (onBottom[forPokedex.value]) {
        if (filter[forPokedex.value].next) {
            errors[forPokedex.value] = false
            try { await filterPokemon('getmore') }
            catch (error) { errors[forPokedex.value] = true }
        }
        onBottom[forPokedex.value] = false
    }
})

// filter by region for mobile user
const openRegion = async ({ name, endload }: { name: string, endload: () => void }) => {
    toTop('wilayah')
    search['wilayah'] = ''
    filter.wilayah = { search: '', sort: { by: 'id', mode: 'asc' }, type: '', region: name, next: true, mode: '' }
    regionPageName.text = name;
    errors['wilayah'] = false
    try {
        await filterPokemon('filter')
    } catch (error) {
        errors['wilayah'] = true
        refreshTemp.value = { name, endload }
    }
    availableType['wilayah'] = getTypes(types.value, regions.value, name)
    regionSubPage.value = 1
    endload()
    // setTimeout(() => { endload() }, 2000) // use this to perfom loading simulation
}

const deskOpenRegion = async (name: string) => {
    // toTop('beranda')
    filterLoad['wilayah'].region = true;
    await openRegion({ name, endload: () => filterLoad['wilayah'].region = false })
}

const confirmType = ref('beranda')
type ConfirmData = Record<string, { text: string, confirm: { state: boolean, index: number } }>
const confirmData = reactive<ConfirmData>({
    'beranda': { text: '', confirm: { state: false, index: 0 } },
    'wilayah': { text: '', confirm: { state: false, index: 0 } },
    'detail': { text: '', confirm: { state: false, index: 0 } }
})

// to change favourite state of selected data, learn more in PokemonCard.vue
// const normalizer = ref(new Date().getTime())
const handleFavourite = ({ index, endload }: { index: number, endload: () => void }) => {
    store.$patch(doHeart(favouriteType.value, favourites.value, filteredFavourite[forPokedex.value], filteredPokemon[forPokedex.value], index))
    dataUpdated['favorit'] = true
    endload()
    // setTimeout(() => { endload() }, 1000) // use this to perfom loading simulation
}

// method on open confirm pane
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

const updateFavOrCatch = (is: string, index: number) => {
    let tempType = favouriteType.value
    filteredPokemon[is][index].types.forEach(t => tempType[t]--)
    filteredPokemon[is].splice(index, 1)
    cardSlideState[is].splice(index, 1)
    return tempType
}

// method to remove data from favourites
const unFavourite = ({ index, id }: { index: number, id: string }) => {
    let temp = favourites.value
    for (const i in temp) {
        if (temp[i].id == id) { temp[i].state = false; temp[i].date = '' }
    }
    const tempType = updateFavOrCatch('favorit', index)
    store.$patch({ favourites: temp, favouriteType: tempType })
}

const selectedIndex = ref(0)
const selectedFavourite = ref({ id: '', state: false, date: '' })
const selectedCatched = ref({ state: false, date: '' })
const sideIsOpen = ref(false)
const allCatched = computed(() => myPokemon.value.map((data) => data.id))
const selectedPokemon = ref<Pokemon>({ id: '', name: '', gif: '', types: [], description: '', detail: { weight: '', height: '', experience: '', abilities: [] }, femalePossibility: 0, weakness: [], evolution: [] })

// get a pokemon data and open the detail, learn more in PokemonDetail.vue
const openCard = async ({ index, endload }: { index: number, endload: () => void }) => {
    selectedIndex.value = index
    selectedFavourite.value = filteredFavourite[forPokedex.value][index];
    if (allCatched.value.includes(selectedFavourite.value.id)) {
        selectedCatched.value.state = true;
        selectedCatched.value.date = myPokemon.value.find((data) => data.id == selectedFavourite.value.id)?.date as string
    } else {
        selectedCatched.value = { state: false, date: '' }
    }
    const selectedData = filteredPokemon[forPokedex.value][index]
    const gender = genders.value.find((data) => data.name == selectedData.name)?.possibility as number
    errors[forPokedex.value] = false;
    try {
        selectedPokemon.value = await getPokeDetail({ ...selectedData, gender, spreads: regions.value, allTypes: Object.keys(types.value) })
        toTop('detail')
        setTimeout(() => {
            sideIsOpen.value = true;
            endload()
        }, 1000)
    } catch (error) {
        errors[forPokedex.value] = true;
        endload()
    }
}

// to perform animation and catch a pokemon
const handleCatch = ({ endload }: { endload: () => void }) => {
    const { temp, updatedType } = doCatch(myPokemonType.value, filteredPokemon[forPokedex.value][selectedIndex.value])
    store.$patch({ myPokemon: [...myPokemon.value, temp], myPokemonType: updatedType })
    selectedCatched.value = { state: true, date: temp.date }
    dataUpdated['pokedex'] = true
    setTimeout(() => { endload() }, 5000)
}

// to remove data from catched datas
const unCatch = ({ index, id }: { index: number, id: string }) => {
    const tempType = updateFavOrCatch('pokedex', index)
    store.$patch({ myPokemon: myPokemon.value.filter((data) => data.id !== id), myPokemonType: tempType })
}

const mobPaneText = computed(() => {
    return { item: confirmData[confirmType.value].text, name: forPokedex.value }
})

const cardConfirm = (data: { index: number, name: string }) => {
    confirmType.value = data.name;
    openConfirm({ index: data.index })
}

const netErrAction = async (i: number) => i == 0 ? await fetch_init() : history.go(-history.length + 1)

// to perform refresh after network error
const refreshTemp = ref<any>()
const refreshLoad = reactive<Record<string, boolean>>(reGen(menuLabel, false))
const refreshData = async () => {
    refreshLoad[forPokedex.value] = true
    if (forPokedex.value == 'wilayah') {
        if (screenWidth.value < 768) await openRegion(refreshTemp.value)
        else await deskOpenRegion(refreshTemp.value)
    } else {
        dataUpdated[forPokedex.value] = true;
        refresh.value = true
    }
    refreshLoad[forPokedex.value] = false
}
</script>

<template>
    <!-- main view -->
    <div v-for="i in 2">
        <component :is="i == 1 ? DesktopMain : MobileMain" v-if="screenWidth >= 768 ? i == 1 : i == 2" :filter="filter"
            :filter-load="filterLoad" :search="search" :filter-label="filterLabel" :on-bottom="onBottom" @un-catch="unCatch"
            v-model:pokedex="pokedex" :all-catched="allCatched" :confirm-data="confirmData" :card-actions="cardActions"
            :filtered-pokemon="filteredPokemon" :filtered-favourite="filteredFavourite" :card-slide-state="cardSlideState"
            :disable-filter="disableFilter" @open-card="openCard" @open-filter="openFilter" :available-type="availableType"
            :forPokedex="forPokedex" v-model:subPage="regionSubPage" :subName="regionPageName" @choose-filter="chooseFilter"
            @all-region="filter['wilayah'].region = ''" @handle-favourite="handleFavourite" @un-favourite="unFavourite"
            @desktop-region="deskOpenRegion" @mobile-region="openRegion" @card-confirm="cardConfirm" :error="errors"
            :refresh-load="refreshLoad" @refresh="refreshData()">
        </component>
    </div>
    <!-- Detail Pokemon -->
    <PokemonDetail id="detail" :data="selectedPokemon" :favourite="selectedFavourite" :catched="selectedCatched"
        :index="selectedIndex" v-model:side-page="sideIsOpen" @heart="handleFavourite"
        v-model:confirm="confirmData['detail'].confirm"
        @confirm="({ index }) => { confirmType = 'detail'; openConfirm({ index }) }" @catch="handleCatch" />
    <!-- Pane -->
    <MobileMainPane v-if="screenWidth < 768" v-model="paneIsOpen[paneFor]" :pane-for="paneFor" :filter-items="filterItems"
        :text="mobPaneText" @choose-filter="chooseFilter" @confirm="onFavouriteConfirm" />
    <!-- Modal -->
    <Modal v-if="screenWidth >= 768" theme="danger" confirm-text="Ya, Hapus" mode="reverse"
        v-model:open="paneIsOpen['confirm']" @confirm="onFavouriteConfirm(1)">
        <b class="text-center text-slate-800 font-semibold">
            Apakah kamu yakin ingin menghapus <span class="capitalize">{{ confirmData['beranda'].text }}</span> dari
            <span class="capitalize">{{ forPokedex }}</span> ?</b>
    </Modal>
    <!-- splash screen -->
    <SplashScreen :error="err_network" @action="netErrAction"
        :style="{ transform: `translate${screenHeight > screenWidth ? 'X' : 'Y'}(${hideSplash ? 100 : 0}%)` }" />
</template>

<style scoped>
.filter::-webkit-scrollbar {
    display: none;
}
</style>