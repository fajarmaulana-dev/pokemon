<script setup lang="ts">
import { ref, computed, reactive } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
import DesktopMain from "~/DesktopMain.vue";
import MobileMain from "~/MobileMain.vue";
import MobileMainPane from "~/MobileMainPane.vue";
import SplashScreen from "~/SplashScreen.vue";
import { useMainStore } from "@/stores"
import PokemonDetail from "~/PokemonDetail.vue";
import { storeToRefs } from 'pinia';
import { ArrowLeft } from "iconoir-vue/regular";
import { Trash } from "iconoir-vue/solid";
import Modal from "~/Modal.vue"
import type { PokemonCard, Pokemon, Favourite, Filter, Preference, MyPokemon, Names } from "@/types";
import debounce from 'lodash.debounce';
import { doFilter, initData, getPokeDetail } from "~/Func/data";
import Local from "../api/local"
import { overflowHandler } from "~/.";
import { toTop, filterFunc, setLocalData, getTypes, doHeart, doCatch } from "~/Func/method"

const store = useMainStore()
const { page, favourites, favouriteType, myPokemon, myPokemonType, regions, types, names, genders } = storeToRefs(store)

const profilePage = ref(0)
const regionSubPage = ref(0)
const regionPageName = reactive({ text: 'kanto', back: true, icon: ArrowLeft })
const cardSlideState = reactive<Record<string, boolean[]>>({ favorit: [], pokedex: [] })

const cardActions = [{ label: 'remove', icon: Trash, color: { init: 'rose-500', hover: 'rose-500/80' }, async: false }]

const pokedex = ref(false)
const forPokedex = computed(() => pokedex.value ? 'pokedex' : page.value.index < 3 ? page.value.name : 'favorit')
const paneFor = ref('')
const paneIsOpen = reactive<Record<string, boolean>>({ type: false, sort: false, confirm: false, pokedex: false })

const menuLabel = ['beranda', 'wilayah', 'favorit', 'pokedex']
const reGen = (labels: string[], value: any) => Object.fromEntries(labels.map((label) => [label, value]))
const onBottom = reactive<Record<string, boolean>>(reGen(menuLabel, false))
const errors = reactive<Record<string, boolean>>(reGen(menuLabel, false))
const screenWidth = ref(window.innerWidth);
const screenHeight = ref(window.innerHeight);
const noDetail = reactive<Record<string, { state: boolean; index: number }>>({ 'beranda': { state: false, index: 0 }, 'wilayah': { state: false, index: 0 }, 'favorit': { state: false, index: 0 }, 'pokedex': { state: false, index: 0 } })

const filter = reactive<Record<string, Filter>>(Object.fromEntries(menuLabel.map((label) => {
    return [label, { search: '', type: '', sort: { by: 'id', mode: 'asc' }, region: '', next: true, mode: ['favorit', 'pokedex'].includes(label) ? label : '' }];
})))

const filterLoad = reactive<Record<string, Record<string, boolean>>>({
    beranda: { type: false, sort: false, search: false, region: false },
    wilayah: { type: false, sort: false, search: false, region: false },
    favorit: { type: false, sort: false, search: false, region: false },
    pokedex: { type: false, sort: false, search: false, region: false }
})

const disableFilter = computed(() => {
    const onMore = onBottom[forPokedex.value] && filter[forPokedex.value].next
    return Object.keys(filterLoad[forPokedex.value]).some((f) => filterLoad[forPokedex.value][f]) || onMore
})

watch(() => filterLoad[forPokedex.value], () => {
    if (Object.keys(filterLoad[forPokedex.value]).some((f) => filterLoad[forPokedex.value][f])) {
        filter[forPokedex.value].next = false
    } else {
        filter[forPokedex.value].next = true
    }
})

const filterLabel = reactive<Record<string, Record<string, string>>>({
    beranda: { type: '', sort: 'Nomor 1 - N' },
    wilayah: { type: '', sort: 'Nomor 1 - N' },
    favorit: { type: '', sort: 'Nomor 1 - N' },
    pokedex: { type: '', sort: 'Nomor 1 - N' }
})

const filterItems = computed(() => {
    if (paneFor.value == 'type') return ['', ...availableType[forPokedex.value]]
    if (paneFor.value == 'sort') return ['Nomor 1 - N', 'Nomor N - 1', 'Nama A - Z', 'Nama Z - A']
})

const openFilter = (filter: string) => {
    if (screenWidth.value < 768) {
        toTop('filter-pane')
        paneFor.value = filter;
        paneIsOpen[filter] = true
    }
}

const chooseFilter = (data: { is: string, item: string }) => {
    const { is, item } = data
    const { filterRes, labelRes, loadRes } = filterFunc(is, item, filter[forPokedex.value], filterLabel[forPokedex.value], filterLoad[forPokedex.value][is])
    filter[forPokedex.value] = filterRes;
    filterLabel[forPokedex.value] = labelRes;
    filterLoad[forPokedex.value][is] = loadRes;
    paneIsOpen[is] = false
}

const search = reactive<Record<string, string>>(reGen(menuLabel, ''))

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

const availableType = reactive<Record<string, string[]>>(reGen(menuLabel, []))

const filteredPokemon = reactive<Record<string, PokemonCard[]>>(reGen(menuLabel, []))

const filteredFavourite = reactive<Record<string, Favourite[]>>(reGen(menuLabel, []))

const filterType = (types: PokemonCard[]) => [...new Set(types.map((data) => data.types).flat())]
const hideSplash = ref(false)

const userData = ref<{ image: string, name: string, email: string }>(Local.getData('user-dex') || { image: '', name: 'Fajar Maulana', email: 'm.fajars.net@gmail.com' })
const profileLoad = reactive({ prefer: false, password: false })
const profileError = reactive({ prefer: false, password: false })
const preferInit = Local.getData('prefer-dex') || { image: '', name: 'Fajar Maulana', useIndonesia: true, notification: { world: true, update: true }, auth: { oauth: true, bio: false, otp: false } }
const preferModel = ref<Preference>(preferInit)
const profileTemp = ref({ image: preferInit.image, data: preferInit })
const changeImage = ({ file, url }: { file: Blob, url: string }) => profileTemp.value.image = url

const savePrefer = async () => {
    profileLoad.prefer = true
    profileError.prefer = false
    try {
        const result = { ...preferModel.value, image: profileTemp.value.image }
        Local.setData('prefer-dex', result)
        preferModel.value = result
        profileTemp.value.data = result
        userData.value.image = result.image
        userData.value.name = result.name
    }
    catch (error) { profileError.prefer = true }
    setTimeout(() => { profileLoad.prefer = false }, 2000)
}

const userPass = ref(Local.getData('pass-dex') || 'Minerva21!')
const passData = ref<{ password: Record<string, string>; hide: Record<string, boolean>; error: Record<string, string | undefined> }>({
    password: { current: '', new: '', confirm: '' }, hide: { current: true, new: true, confirm: true }, error: { current: undefined, new: undefined, confirm: undefined },
})
const passPage = ref(0)
const passWrong = ref(false)
const postPassword = async (page: string) => {
    profileLoad.password = true;
    profileError.password = false;
    const delay = ({ fun }: { fun: () => void }) => {
        setTimeout(() => {
            fun()
            profileLoad.password = false
        }, 2000)
    }
    try {
        if (page == 'check') {
            if (userPass.value == passData.value.password.current) {
                delay({ fun: () => passPage.value = 1 })
            } else {
                delay({ fun: () => passWrong.value = true })
            }
        } else {
            Local.setData('pass-dex', passData.value.password.new)
            userPass.value = passData.value.password.new
            delay({ fun: () => passPage.value = 2 })
        }
    } catch (error) { profileError.password = true }
}

const refreshed = ref(false)
watch(refreshed, () => { setLocalData(favourites.value, myPokemon.value, favouriteType.value, myPokemonType.value) })
const err_network = ref(false)

const fetch_init = async () => {
    err_network.value = false
    let favourite = Local.getData('poke-love') as Favourite[] || []
    let pokedexes = Local.getData('poke-dex') as MyPokemon[] || []
    let favouriteTypes = Local.getData('type-love') as Record<string, number> || favouriteType.value
    let pokedexesType = Local.getData('type-dex') as Record<string, number> || myPokemonType.value

    const initNeeds = { regions: Object.keys(regions.value), types: Object.keys(types.value), favourite, catched: pokedexes }
    try {
        const { data, names, spreads, variants, favouriteData, mineData, genders } = await initData(initNeeds)
        if (favourite.length == 0) favourite = names.map((p: Names) => { return { id: p.id, state: false, date: '' } })
        store.$patch({ favourites: favourite, favouriteType: favouriteTypes, myPokemon: pokedexes, myPokemonType: pokedexesType, names, regions: spreads, types: variants, genders })
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
        setTimeout(() => { document.getElementById("domsplash")?.remove() }, 1500)
    } catch (err) {
        err_network.value = true
    }
}

onMounted(async () => {
    window.addEventListener('beforeunload', () => {
        refreshed.value = true;
    })

    screenWidth.value = window.innerWidth;
    screenHeight.value = window.innerHeight;
    window.addEventListener('resize', () => {
        screenWidth.value = window.innerWidth;
        screenHeight.value = window.innerHeight;
    })

    history.pushState('fake', '', document.URL)
    window.onpopstate = () => {
        history.pushState('fake', '', document.URL)
        if (sideIsOpen.value) {
            sideIsOpen.value = false
        } else if (pokedex.value) {
            pokedex.value = false
        } else {
            if (page.value.index > 0) {
                if (profilePage.value > 0) profilePage.value = 0;
                else if (regionSubPage.value > 0) regionSubPage.value = 0;
                else store.$patch({ page: { name: 'beranda', index: 0 } })
            }
            else {
                refreshed.value = true
                setTimeout(() => { history.go(-history.length + 1) }, 0)
            }
        }
    }

    document.getElementById("splash")?.remove()
    overflowHandler('hidden')
    await fetch_init()
})

const dataUpdated = reactive<Record<string, boolean>>({ favorit: false, pokedex: false })
const transformType = (types: Record<string, number>) => Object.keys(types).filter((d) => types[d] > 0)

watch(favourites, async () => {
    availableType['favorit'] = transformType(favouriteType.value);
    errors['favorit'] = false
    if (screenWidth.value >= 768) {
        try { await filterPokemon('filter', 'favorit') }
        catch (error) { errors['favorit'] = true }
    }
}, { deep: true })

watch(myPokemon, async () => {
    availableType['pokedex'] = transformType(myPokemonType.value);
    errors['pokedex'] = false
    if (screenWidth.value >= 768) {
        try { await filterPokemon('filter', 'pokedex') }
        catch (error) { errors['pokedex'] = true }
    }
}, { deep: true })

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

    filter[isTo].next = result.next
    filterLoad[isTo].type = false;
    filterLoad[isTo].sort = false;
    const filteredIds = result.data.map((data) => data.id)
    filteredPokemon[isTo] = result.data
    filteredFavourite[isTo] = favourites.value.filter((data) => filteredIds.includes(data.id))
}

const previousPage = ref('beranda')
const refresh = ref(false)
watch(() => [filter[forPokedex.value].type, filter[forPokedex.value].sort.by, filter[forPokedex.value].sort.mode, refresh.value], async () => {
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

const errorMore = reactive<Record<string, boolean>>(reGen(menuLabel, false))
const triggerMore = async () => {
    if (filter[forPokedex.value].next) {
        errorMore[forPokedex.value] = false;
        errors[forPokedex.value] = false
        try { await filterPokemon('getmore') }
        catch (error) { errorMore[forPokedex.value] = true }
    }
}
watch(() => onBottom[forPokedex.value], async () => {
    if (onBottom[forPokedex.value] && !errorMore[forPokedex.value]) {
        await triggerMore()
    }
    onBottom[forPokedex.value] = false
})

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
}

const deskOpenRegion = async (name: string) => {
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

const handleFavourite = ({ index, endload }: { index: number, endload: () => void }) => {
    store.$patch(doHeart(favouriteType.value, favourites.value, filteredFavourite[forPokedex.value], filteredPokemon[forPokedex.value], index))
    dataUpdated['favorit'] = true
    endload()
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

const updateFavOrCatch = (is: string, index: number) => {
    let tempType = favouriteType.value
    filteredPokemon[is][index].types.forEach(t => tempType[t]--)
    filteredPokemon[is].splice(index, 1)
    cardSlideState[is].splice(index, 1)
    return tempType
}

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
    } catch (error: any) {
        if (error.response) {
            if (error.response.status == 404) {
                noDetail[forPokedex.value] = { state: true, index }
                setTimeout(() => { noDetail[forPokedex.value].state = false }, 2500)
            }
        } else errors[forPokedex.value] = true;
        endload()
    }
}

const handleCatch = ({ endload }: { endload: () => void }) => {
    const { temp, updatedType } = doCatch(myPokemonType.value, filteredPokemon[forPokedex.value][selectedIndex.value])
    store.$patch({ myPokemon: [...myPokemon.value, temp], myPokemonType: updatedType })
    selectedCatched.value = { state: true, date: temp.date }
    dataUpdated['pokedex'] = true
    setTimeout(() => { endload() }, 5000)
}

const unCatch = ({ index, id }: { index: number, id: string }) => {
    const tempType = updateFavOrCatch('pokedex', index)
    store.$patch({ myPokemon: myPokemon.value.filter((data) => data.id !== id), myPokemonType: tempType })
}

const cardConfirm = (data: { index: number, name: string }) => {
    confirmType.value = data.name;
    openConfirm({ index: data.index })
}

const netErrAction = async (i: number) => i == 0 ? await fetch_init() : history.go(-history.length + 1)

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

const backProfile = () => {
    if (page.value.name !== 'profil') {
        store.$patch({ page: { name: 'profil', index: 3 } });
        setTimeout(() => { profilePage.value = 0 }, 500)
    } else profilePage.value = 0;
}
</script>

<template>
    <!-- main view -->
    <div v-for="i in 2">
        <component :is="i == 1 ? DesktopMain : MobileMain" v-if="screenWidth >= 768 ? i == 1 : i == 2" :filter="filter"
            :filter-load="filterLoad" :search="search" :filter-label="filterLabel" :on-bottom="onBottom" @un-catch="unCatch"
            v-model:pokedex="pokedex" :all-catched="allCatched" :confirm-data="confirmData" :card-actions="cardActions"
            :filtered-pokemon="filteredPokemon" :filtered-favourite="filteredFavourite" :card-slide-state="cardSlideState"
            :disable-filter="disableFilter" :no-detail="noDetail" @open-card="openCard" @open-filter="openFilter"
            :available-type="availableType" :forPokedex="forPokedex" v-model:subPage="regionSubPage" :error="errors"
            :subName="regionPageName" @choose-filter="chooseFilter" @all-region="filter['wilayah'].region = ''"
            @handle-favourite="handleFavourite" @un-favourite="unFavourite" @desktop-region="deskOpenRegion"
            @mobile-region="openRegion" @card-confirm="cardConfirm" :refresh-load="refreshLoad" @refresh="refreshData()"
            :error-more="errorMore" @loadmore="triggerMore()" v-model:profile-page="profilePage" :user="userData"
            v-model:prefer="preferModel" :profile-error="profileError" :profile-load="profileLoad"
            :prefer-temp="profileTemp" @save-prefer="savePrefer" @back-profile="backProfile()" @profile-image="changeImage"
            @open-menu="idx => profilePage = idx as number + 1" v-model:password="passData" v-model:passwordPage="passPage"
            v-model:passwordWrong="passWrong" @post-pass="val => postPassword(val)">
        </component>
    </div>
    <!-- Detail Pokemon -->
    <PokemonDetail id="detail" :data="selectedPokemon" :favourite="selectedFavourite" :catched="selectedCatched"
        :index="selectedIndex" v-model:side-page="sideIsOpen" @heart="handleFavourite"
        v-model:confirm="confirmData['detail'].confirm"
        @confirm="({ index }) => { confirmType = 'detail'; openConfirm({ index }) }" @catch="handleCatch" />
    <!-- Pane -->
    <MobileMainPane v-if="screenWidth < 768" v-model="paneIsOpen[paneFor]" :pane-for="paneFor" :filter-items="filterItems"
        :item="confirmData[confirmType].text" @choose-filter="chooseFilter" @confirm="onFavouriteConfirm" />
    <!-- Modal -->
    <Modal v-if="screenWidth >= 768" theme="danger" confirm-text="Ya, Hapus" mode="reverse"
        v-model:open="paneIsOpen['confirm']" @confirm="onFavouriteConfirm(1)">
        <b class="text-center text-slate-800 font-semibold">
            Apakah kamu yakin ingin menghapus <span class="capitalize">{{ confirmData['beranda'].text }}</span> dari
            <span class="capitalize">Favorit</span> ?</b>
    </Modal>
    <!-- splash screen -->
    <SplashScreen :error="err_network" @action="netErrAction"
        :style="{ transform: `translate${screenHeight > screenWidth ? 'X' : 'Y'}(${hideSplash ? 100 : 0}%)` }" />
</template>

<style scoped></style>