<script setup lang="ts">
import { toRefs, computed, ref } from "@vue/reactivity";
import { ArrowLeft, KeyMinus, Eye, EyeClosed } from 'iconoir-vue/regular';
import { watch } from "@vue/runtime-core";
import TextBox from '../TextBox.vue';
import PasswordForm from "./PasswordForm.vue";
import type { PropType } from "vue";
import { Field, configure } from 'vee-validate';
import * as yup from 'yup';
import debounce from 'lodash.debounce';

const emit = defineEmits(['back', 'post', 'update:data', 'update:page', 'update:wrong']);
const props = defineProps({
    data: {
        type: Object as PropType<{ password: Record<string, string>, hide: Record<string, boolean>, error: Record<string, string | undefined> }>,
        default: { password: { current: '', new: '', confirm: '' }, hide: { current: true, new: true, confirm: true }, error: { current: undefined, new: undefined, confirm: undefined } }
    },
    load: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    page: {
        type: Number as PropType<number>,
        default: 0
    },
    errNet: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    wrong: {
        type: Boolean as PropType<boolean>,
        default: false
    },
})

const { data, load, page, errNet, wrong } = toRefs(props)

configure({ validateOnBlur: true, validateOnChange: true, validateOnInput: true, validateOnModelUpdate: true });
const model = computed(() => data.value)
const placeholder: Record<string, string> = { current: 'Masukkan kata sandi ...', new: 'Masukkan kata sandi baru ...', confirm: 'Konfirmasi kata sandi baru ...' }

const useErrorModel = ref<Record<string, boolean>>({ current: true, new: true, confirm: true })
const onModel = (val: string, key: string = 'current') => { useErrorModel.value[key] = false; emit('update:data', { ...data.value, password: { ...data.value.password, [key]: val } }); }

const bounce = debounce(() => {
    let error: Record<string, string | undefined> = { current: undefined, new: undefined, confirm: undefined };
    ['current', 'new', 'confirm'].forEach((i) => {
        const el = document.getElementById(`error-${i}`)
        error[i] = el?.innerText == '' ? undefined : el?.innerText
    })
    emit('update:data', { ...data.value, error })
}, 300)
watch(() => model.value.password, () => { bounce() })

const onHide = (key: string = 'current') => emit('update:data', { ...data.value, hide: { ...data.value.hide, [key]: !data.value.hide[key] } })
const onEye = (key: string = 'current') => model.value.hide[key] ? EyeClosed : Eye
const passval = (x: string) => yup.string().required(`kata sandi${x} wajib diisi`).matches(/[A-Z]/, `kata sandi${x} harus memuat minimal 1 huruf kapital`).matches(/[a-z]/, `kata sandi${x} harus memuat minimal 1 huruf kecil`).matches(/\d/, `kata sandi${x} harus memuat minimal 1 angka`).matches(/[\W+_]/, `kata sandi${x} harus memuat minimal 1 karakter unik`).min(8, `kata sandi${x} harus terdiri dari minimal 8 karakter`).matches(/^\S+$/, `kata sandi${x} tidak boleh memuat spasi`)
const invalid = computed(() => model.value.password.new !== model.value.password.confirm)
const invalidText = computed(() => invalid.value ? 'isian ini harus sama dengan isian kata sandi baru' : '')

const formData = {
    check: {
        schema: yup.object({ current: passval('') }),
        intro: 'Untuk lanjut mengubah, silakan masukkan kata sandimu saat ini.',
        alert: { title: 'Konfirmasi kata sandi gagal', button: 'lanjutkan' }
    },
    change: {
        schema: yup.object({ new: passval(' baru'), confirm: yup.string() }),
        intro: 'Buatlah kata sandi baru yang terdiri dari minimal 8 karakter, memuat huruf kecil, huruf kapital, angka, dan karakter unik, serta tidak memuat spasi.',
        alert: { title: 'Pengubahan kata sandi gagal', button: 'ubah sandi' }
    }
}

const buttonData = {
    check: { primary: { text: 'lanjutkan', action: () => emit('post', 'check') }, secondary: { text: 'lupa sandi ?', action: () => false } },
    change: { primary: { text: 'ubah sandi', action: () => emit('post', 'change') }, secondary: { text: 'kembali', action: () => emit('update:page', 0) } }
}

const reset = () => {
    useErrorModel.value = { current: true, new: true, confirm: true }
    emit('update:data', { password: { current: '', new: '', confirm: '' }, hide: { current: true, new: true, confirm: true }, error: { current: undefined, new: undefined, confirm: undefined } });
    emit('update:page', 0)
}

const reErr = (err: string | undefined, key: string = 'current') => useErrorModel.value[key] ? data.value.error[key] : err;
const disableBtn = (key: string[] = ['new', 'confirm']) => {
    return { state: key.some((k) => useErrorModel.value[k]), data: key.some((k) => data.value.password[k] == '' || data.value.error[k]) }
}
</script>

<template>
    <div class="w-full h-full flex flex-col">
        <div class="block md:hidden h-12 w-full pb-2 border-b-4 border-slate-200 mb-4">
            <div class="flex items-center md:translate-y-1">
                <i @click="emit('back')" class="w-7 h-7 rounded-full grid md:hidden place-items-center cursor-pointer
                    bg-fill-0/0 hover:bg-fill-0/30 active:bg-fill-0/50 transition duration-[.4s] -translate-x-1">
                    <ArrowLeft class="h-[15px] w-[15px] text-fill-1 stroke-[4]" />
                </i>
                <b class="font-bold text-fill-1 text-[1.15rem] xx:text-xl">Ubah Kata Sandi</b>
            </div>
        </div>
        <div class="overflow-hidden h-[calc(100%-3.5rem)] md:h-full">
            <div class="flex font-medium text-slate-800 transition duration-500 h-full [&>*]:min-w-full [&>*]:h-full sm:[&>*]:grid
                sm:[&>*]:place-items-center [&>*]:overflow-x-hidden [&>*]:overflow-y-auto [&>*>*]:w-full sm:[&>*>*]:max-w-[30rem] [&>*>*>*]:w-full
                [&_h4]:text-center [&_h4]:font-bold [&_h4]:text-fill-1 [&_h4]:text-xl [&_h4]:hidden md:[&_h4]:block [&_h4]:mb-6 [&_span]:text-sm
                [&_.is-change]:flex [&_fieldset]:mt-3.5 [&_fieldset]:flex-col [&_fieldset]:gap-3.5 [&_fieldset>*]:w-full [&_fieldset_p]:text-left
                [&_fieldset_p]:text-rose-600 [&_fieldset_p]:text-xs [&_fieldset_p]:mt-0.5 [&>*>*>div]:fixed sm:[&>*>*>div]:relative [&>*>*>div]:bottom-0
                sm:[&>*>*>div]:mt-5 [&>*>*>div]:flex [&>*>*>div]:gap-2.5 [&>*>*>div]:flex-wrap"
                :style="{ transform: `translateX(-${page * 100}%)` }">
                <div class="filter">
                    <PasswordForm id="pass-check-form" :data="formData.check" :load="load" :err-net="errNet"
                        :button="buttonData.check" :meta="disableBtn(['current'])" #="{ submit }">
                        <fieldset class="is-check">
                            <Field v-slot="{ field, errorMessage }" name="current">
                                <TextBox full-text :append-icon="onEye()" :readonly="load"
                                    :placeholder="placeholder.current" :model-value="model.password.current" :="field"
                                    :for-password="model.hide.current"
                                    :invalid="wrong || reErr(errorMessage) !== undefined" :prepend-icon="KeyMinus"
                                    @append-click="onHide()" @on-enter="submit.click()"
                                    @update:model-value="val => { onModel(val), emit('update:wrong', false) }" />
                                <p id="error-current">{{ wrong ? 'sandi yang kamu masukkan salah' : reErr(errorMessage)
                                    }}
                                </p>
                            </Field>
                        </fieldset>
                    </PasswordForm>
                </div>
                <div class="filter">
                    <PasswordForm id="pass-change-form" :data="formData.change" :load="load" :err-net="errNet"
                        :button="buttonData.change" :meta="disableBtn()" :invalid="invalid" #="{ submit }">
                        <fieldset class="is-change">
                            <div v-for="box in ['new', 'confirm']">
                                <Field v-slot="{ field, errorMessage }" :name="box">
                                    <TextBox full-text :for-password="model.hide[box]" :placeholder="placeholder[box]"
                                        :append-icon="onEye(box)" :model-value="model.password[box]"
                                        :prepend-icon="KeyMinus" :readonly="load" :="field" @on-enter="submit.click()"
                                        :invalid="(box == 'confirm' ? invalid : false) || reErr(errorMessage, box) !== undefined"
                                        @update:model-value="val => onModel(val, box)" @append-click="onHide(box)" />
                                    <p :id="`error-${box}`">{{ box == 'confirm' ? invalidText : reErr(errorMessage, box)
                                        }}
                                    </p>
                                </Field>
                            </div>
                        </fieldset>
                    </PasswordForm>
                </div>
                <div class="filter">
                    <div class="flex flex-col items-center gap-4">
                        <img src="@/assets/after-register.avif" width="480" height="444" alt="password change success"
                            class="w-11/12 max-w-[30rem]" />
                        <p class="text-center">Selamat, pengubahan kata sandi telah berhasil dilakukan.</p>
                        <button @click="reset()" class="font-semibold h-12 grid place-items-center px-6 !w-[248px] rounded-lg transition
                        duration-300 bg-rose-300/40 hover:bg-rose-300/60 active:bg-rose-300/80 text-rose-800">
                            Ubah Sandi Lagi ?</button>
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