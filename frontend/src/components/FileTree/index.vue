<script setup lang="ts">
import { onMounted, provide, ref, useTemplateRef } from 'vue';
import Folder from './Folder.vue';
import api from '@/api';
import Modal from '../Modal.vue';
import CreateModal from './CreateModal.vue';
import TextAskModal from './TextAskModal.vue';

const textAskModal = useTemplateRef("text-ask-modal")

const rootFolder = ref<API.FolderInfo | null>(null); 

const rootEl = useTemplateRef("root");

onMounted(() => {
    api.folders.getRootFolder().then((req) => {
        rootFolder.value = req.data
    })
})


provide("filetree",{
    getRoot: () => rootEl.value,
    textAsk: async (title:string) => {
        if (textAskModal.value) {
        return await textAskModal.value.textAsk(title)
        } else {
            return null
        }
    }
})




</script>

<template>
    <ul class="menu w-full grow basis-0 overflow-y-auto flex-nowrap" ref="root">
        <Folder v-if="rootFolder" is-root :folder="rootFolder"></Folder>
    </ul>
    <TextAskModal ref="text-ask-modal"></TextAskModal>
</template>