<script setup lang="ts">
import { toRefs, ref } from "@vue/reactivity";
import ErrorNetwork from "./ErrorNetwork.vue";
import Spinner from "../Spinner.vue";
import type { PropType } from "vue";
import { Form, type YupSchema } from 'vee-validate';
import * as yup from 'yup';

const props = defineProps({
    load: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    errNet: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    data: {
        type: Object as PropType<{ intro: string, alert: { title: string, button: string }, schema: YupSchema }>,
        default: { intro: '', alert: {}, schema: yup.string() }
    },
    button: {
        type: Object as PropType<{ primary: { text: string, action: () => void }, secondary: { text: string, action: () => void } }>,
        default: { primary: { text: '', action: () => false }, secondary: { text: '', action: () => false } }
    },
    invalid: {
        type: Boolean as PropType<boolean>,
        default: false
    },
    id: String as PropType<string>,
    meta: {
        type: Object as PropType<{ state: boolean, data: boolean }>,
        default: { state: false, data: false }
    }
})

const { load, errNet, data, button, invalid, id, meta } = toRefs(props)

const buttonStyle = 'text-sm grid place-items-center font-semibold capitalize h-10 grid place-items-center px-6 basis-36 grow rounded-lg transition duration-300'
const primary = (invalid: boolean) => {
    return {
        '!bg-rose-100 hover:!bg-rose-100 active:!bg-rose-100 !text-slate-500': (load.value || invalid),
        'cursor-wait': load.value,
        'cursor-not-allowed': invalid
    }
}

const submit = ref()
const reDirty = (dirty: boolean) => meta.value.state ? meta.value.data || invalid.value : dirty;
</script>

<template>
    <Form :id="id" @submit="false" :validation-schema="data.schema" v-slot="{ meta }">
        <b>Ubah Kata Sandi</b>
        <span>{{ data.intro }}</span>
        <ErrorNetwork :error="errNet" class="mt-3.5" :data="data.alert" />
        <slot :submit="submit"></slot>
        <div class="text-slate-800 bg-white">
            <button type="button" @click="button.secondary.action()" :class="buttonStyle"
                class="bg-slate-300/40 hover:bg-slate-300/60 active:bg-slate-300/80 text-slate-800">
                {{ button.secondary.text }}</button>
            <button ref="submit" type="button"
                :class="[buttonStyle, primary(reDirty(!(meta.valid && meta.dirty)) || invalid)]"
                class="bg-rose-300/40 hover:bg-rose-300/60 active:bg-rose-300/80 text-rose-800"
                @click="button.primary.action()" :disabled="reDirty(!(meta.valid && meta.dirty)) || load || invalid">
                <Spinner v-if="load" is="jump-dots" fill="fill-fill-1" :width="20" />
                <span v-else>{{ button.primary.text }}</span>
            </button>
        </div>
    </Form>
</template>