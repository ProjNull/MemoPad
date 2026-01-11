<script setup lang="ts">
import { onMounted, onUnmounted, provide, ref, useTemplateRef } from 'vue';
import Folder from './Folder.vue';
import api from '@/api';


const rootFolder = ref<API.FolderInfo | null>(null); 

const rootEl = useTemplateRef("root");

onMounted(() => {
    document.removeEventListener("keydown",shortcuts);
    api.folders.getRootFolder().then((req) => {
        rootFolder.value = req.data
    })
})


provide("filetree",{
    getRoot: () => rootEl.value
})

function shortcuts(e:KeyboardEvent) {
    if (rootEl.value && e.key == "E" && e.shiftKey && e.ctrlKey) {
        e.preventDefault();
        const els = rootEl.value.querySelectorAll("li > div > button")
        if (els) {
            const e = els[0];
            (e as HTMLElement).focus();
        }
    }   
}

onMounted(() => {
    document.addEventListener("keydown",shortcuts);
})




</script>

<template>
    <ul class="menu w-full grow basis-0 overflow-y-auto flex-nowrap overflow-x-hidden max-w-full" ref="root">
        <Folder v-if="rootFolder" is-root :folder="rootFolder"></Folder>
    </ul>
    <TextAskModal ref="text-ask-modal"></TextAskModal>
</template>