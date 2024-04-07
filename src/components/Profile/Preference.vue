<script setup lang="ts">
import TextBox from "../TextBox.vue";
import Switch from "../Switch.vue";
import ErrorNetwork from "./ErrorNetwork.vue";
import { User, Plus, Xmark, ArrowLeft } from "iconoir-vue/regular";
import { Trash } from "iconoir-vue/solid";
import Spinner from "../Spinner.vue";
import { ref, toRefs, computed, reactive } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import type { PropType } from "vue";
import { convertBlob } from "..";
import type { Preference } from "@/types";

const emit = defineEmits(['update:modelValue', 'save', 'file', 'back'])
const props = defineProps({
    modelValue: {
        type: Object as PropType<Preference>,
        default: { image: '', name: 'Fajar Maulana', useIndonesia: true, notification: { world: true, update: true }, auth: { oauth: true, bio: false, otp: false } }
    },
    errNet: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    temp: {
        type: Object as PropType<{ image: string, data: Preference }>,
        default: { image: '', data: {} }
    },
    load: {
        type: Boolean as PropType<boolean>,
        default: false
    },
})

const { modelValue, errNet, temp, load } = toRefs(props)

const init = ref(temp.value.data)
const model = computed((): { image: string, name: string, switches: Record<string, boolean[]> } => {
    return {
        image: modelValue.value.image,
        name: modelValue.value.name,
        switches: {
            'Bahasa Antarmuka': [modelValue.value.useIndonesia],
            'Notifikasi': Object.values(modelValue.value.notification),
            'Autentikasi': Object.values(modelValue.value.auth)
        }
    }
})

const switchesData = computed((): Record<string, { title: string, description: string }[]> => {
    return {
        'Bahasa Antarmuka': [
            { title: model.value.switches["Bahasa Antarmuka"][0] ? 'Bahasa Indonesia' : 'English', description: model.value.switches["Bahasa Antarmuka"][0] ? 'Geser untuk berpindah ke bahasa inggris.' : 'Swipe to switch to Indonesian.' },
        ],
        'Notifikasi': [
            { title: 'Dunia Pokemon', description: 'Acara dan informasi dari dunia pokemon.' },
            { title: 'Pembaruan Dunia Pokemon', description: 'Pokemon baru dan kemampuannya, serta informasi lainnya.' },
        ],
        'Autentikasi': [
            { title: 'Login dengan OAuth', description: 'Aktivasi fitur login dengan akun Google, Microsoft, atau ID Apple.' },
            { title: 'Login dengan Biometrik', description: 'Aktivasi fitur login dengan Sidik Jari atau Deteksi Wajah.' },
            { title: 'Login dengan OTP', description: 'Aktivasi perlindungan ekstra dengan permintaan kode OTP tiap kali login manual.' },
        ]
    }
})

const sameData = (re: RegExp = / /g) => JSON.stringify(modelValue.value).replace(re, '') == JSON.stringify(init.value).replace(re, '')
const disableButton = computed(() => model.value.name == '' || sameData() || (sameData(/"image.+?,/g) && modelValue.value.image == 'reset'))
const btnStyle = computed(() => {
    return {
        '!bg-rose-100 hover:!bg-rose-100 active:!bg-rose-100 !text-slate-500': load.value || disableButton.value,
        'cursor-wait': load.value,
        'cursor-not-allowed': disableButton.value
    }
})

const onModel = (key: string, val: any) => emit('update:modelValue', { ...modelValue.value, [key]: val })
const valGen = (key: string, idx: number) => {
    const value = model.value.switches[key][idx]
    if (key[0] == 'B') return { key: 'useIndonesia', val: !value }
    else {
        const current = (thisKey: string) => {
            const modelKey = (modelValue.value as any)[thisKey]
            return { key: thisKey, val: { ...modelKey, [Object.keys(modelKey)[idx]]: !value } }
        }
        if (key[0] == 'N') return current('notification')
        else return current('auth')
    }
}
const onSwitch = (key: string, idx: number) => {
    const param = valGen(key, idx)
    onModel(param.key, param.val)
}

const takeImage = ref()
const image = reactive({ src: temp.value.image, size: 0, show: false, load: false })
watch(() => temp.value.image, () => { image.src = temp.value.image })
watch(() => temp.value.data, () => { init.value = temp.value.data })

const getImage = async (e: any) => {
    image.load = true
    image.size = 0
    const file = e.target.files[0]
    if (file) {
        if (Math.round((file.size / 1024) * 100) / 100 <= 500) {
            onModel('image', 'update')
            image.src = await convertBlob(file)
            emit('file', { file, url: image.src })
            image.show = true
        } else image.size = Math.round((file.size / 1024) * 100) / 100
    }
    image.load = false
}

const resetImage = () => {
    onModel('image', 'reset')
    image.src = ''
    image.size = 0
    emit('file', { url: '' })
    image.show = false
}
</script>

<template>
    <div class="w-full h-full flex flex-col">
        <div class="min-h-fit w-full pb-5 border-b-4 border-slate-200">
            <div class="flex items-center justify-between mb-5">
                <div class="flex items-center md:translate-y-1">
                    <i @click="emit('back')" class="w-7 h-7 rounded-full grid md:hidden place-items-center cursor-pointer
                        bg-fill-0/0 hover:bg-fill-0/30 active:bg-fill-0/50 transition duration-[.4s] -translate-x-1">
                        <ArrowLeft class="h-[15px] w-[15px] text-fill-1 stroke-[4]" />
                    </i>
                    <b class="font-bold text-fill-1 text-[1.15rem] xx:text-xl">Ubah Preferensi</b>
                </div>
                <button class="h-9 font-semibold grid place-items-center rounded-[18px] bg-rose-200 text-slate-800
                    hover:bg-rose-300/75 active:bg-rose-300/95 transition duration-300 px-4" :class="btnStyle"
                    :disabled="disableButton" @click="emit('save')">
                    <Spinner v-if="load" is="jump-dots" fill="fill-slate-800" :width="16" />
                    <span v-else>Simpan</span>
                </button>
            </div>
            <ErrorNetwork :error="errNet" />
            <div class="flex flex-col gap-2.5 items-center">
                <div class="w-36 xl:w-40 h-36 xl:h-40 bg-slate-200 rounded-full grid place-items-center relative">
                    <div v-if="(image.src !== '' || image.show)" @click="resetImage()"
                        class="w-full h-full rounded-full overflow-hidden relative group select-none">
                        <img :src="image.src" width="160" height="160" class="object-cover object-top w-full h-full"
                            alt="profile picture">
                        <div class="absolute inset-0 bg-slate-600/30 grid place-items-center opacity-0 group-hover:opacity-100
                            transition-opacity duration-500 cursor-pointer">
                            <Trash class="[&>*]:stroke-rose-700 [&>*]:fill-rose-300 group-active:[&>*]:stroke-rose-800 group-active:[&>*]:fill-rose-400 drop-shadow
                                [&>*]:transition-colors [&>*]:duration-300 [&>*]:stroke-2 w-10 xl:w-12 h-10 xl:h-12" />
                        </div>
                    </div>
                    <User v-else class="text-slate-500 stroke-2 w-24 xl:w-28 h-24 xl:h-28" />
                    <div class="w-[54px] xl:w-[60px] h-[54px] xl:h-[60px] rounded-full grid place-items-center bg-rose-400 hover:bg-rose-500
                        transition duration-300 active:bg-rose-600 absolute bottom-0 right-0 border-[5px] border-white cursor-pointer"
                        @click="takeImage.click()">
                        <input ref="takeImage" accept="image/*" type="file" name="profile-picture" class="hidden"
                            @change="getImage($event)" @click="({ target }: any) => target.value = null"
                            :disabled="image.load || load" />
                        <Spinner v-if="image.load" fill="fill-white" :width="36" />
                        <Plus v-else class="text-white w-9 xl:w-11 h-9 xl:h-11 stroke-[3]" />
                    </div>
                </div>
                <div v-if="image.size > 500"
                    class="w-full max-w-lg px-3 py-2 rounded-md flex flex-col gap-1 bg-amber-200 text-slate-800 relative">
                    <div @click="image.size = 0" class="w-10 h-10 rounded-full bg-amber-200 hover:bg-amber-300 active:bg-amber-400 border-[.22rem] border-white
                        absolute -top-5 right-3 grid place-items-center transition-colors duration-300 cursor-pointer">
                        <Xmark class="h-6 w-6 stroke-[2.5]" />
                    </div>
                    <b>Pengubahan Foto Profil Gagal</b>
                    <p>Ukuran foto profil maksimum yang diterima adalah 500 KB, tapi kamu mencoba mengunggah foto dengan
                        ukuran ≈{{ image.size }} KB. Silakan gunakan foto lain dengan ukuran yang lebih kecil atau
                        lakukan
                        kompresi foto terlebih dahulu.</p>
                </div>
                <TextBox full-text class="max-w-lg mt-2.5" :prepend-icon="User" :readonly="load"
                    placeholder="Masukkan namamu ..." name="name" :model-value="model.name"
                    @update:model-value="val => onModel('name', val)" @on-enter="emit('save')" />
            </div>
        </div>
        <div class="h-full w-full overflow-y-auto pb-4 filter">
            <div v-for="key in Object.keys(switchesData)" class="text-slate-800">
                <div class="mt-6 text-[1.05rem] xx:text-lg font-bold">{{ key }}</div>
                <div class="mt-4 flex flex-col gap-3">
                    <div v-for="data, idx in switchesData[key]">
                        <div class="flex items-center justify-between gap-6">
                            <div>
                                <b class="text-[.925rem] xx:text-base font-semibold">{{ data.title }}</b>
                                <p class="text-sm xx:text-[.95rem]">{{ data.description }}</p>
                            </div>
                            <div class="min-w-fit">
                                <Switch :disabled="load" :model-value="model.switches[key][idx]"
                                    @update:model-value="onSwitch(key, idx)" />
                            </div>
                        </div>
                        <hr class="h-[.125rem] w-full bg-slate-200 rounded-[1px] mt-2.5" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.filter::-webkit-scrollbar {
    display: none;
}
</style>