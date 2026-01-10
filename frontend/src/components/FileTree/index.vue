<script setup lang="ts">
import { onMounted, provide, ref, useTemplateRef } from 'vue';
import Folder from './Folder.vue';
import api from '@/api';


const rootFolder = ref<API.FolderInfo | null>(null); 

const rootEl = useTemplateRef("root");

onMounted(() => {
    api.folders.getRootFolder().then((req) => {
        rootFolder.value = req.data
    })
})


provide("filetree",{
    getRoot: () => rootEl.value
})




</script>

<template>
    <ul class="menu w-full grow basis-0 overflow-y-auto flex-nowrap overflow-x-hidden max-w-full" ref="root">
        <Folder v-if="rootFolder" is-root :folder="rootFolder"></Folder>
    </ul>
    <TextAskModal ref="text-ask-modal"></TextAskModal>
</template>