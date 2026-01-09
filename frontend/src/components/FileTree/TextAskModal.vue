<script setup lang="ts">
import { h, ref, useTemplateRef } from 'vue';
import Modal from '../Modal.vue';



const modal = useTemplateRef("modal");

const modalType = ref<string>("file");
const value = ref<string>("");

const res = ref<((name:string | null)=>void)| null>(null)

function textAsk(type: string) {
    modalType.value = type
    value.value = "";
    return new Promise<string | null>((resp) => {  
        if (modal.value) {
            res.value = resp
            modal.value.open();
        } else {
            resp(null);
        }
    })
}

defineExpose({
    textAsk
})


</script>

<template>
    <Modal class="w-80" ref="modal">
        <h1 class="text-2xl font-bold mb-4">{{ modalType }}</h1>
        <label class="input">
            <input v-model="value" placeholder="Name">
        </label>

        <div v-if="res" class="modal-action flex gap-2 mt-4">
            <button class="btn btn-secondary btn-outline basis-0 grow" @click="res(null);modal?.close()">Cancel</button>
            <button class="btn btn-primary basis-0 grow" @click="res(value ?? null);modal?.close()">Create</button>
        </div>
    </Modal>
</template>