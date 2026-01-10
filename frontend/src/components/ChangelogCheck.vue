<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';

import changelogAPI, { type Changelog } from '@/api/cls.ts';
import Modal from './Modal.vue';
import { marked } from 'marked';

const modal = useTemplateRef("modal");
const content = ref("");
const title = ref("");

onMounted(() => {
    
    changelogAPI.isLatest().then(async (d) => {
        if (d) {
            console.log("test");
            content.value = await marked.parse(d.description)
            title.value = d.title
            modal.value?.open();
        }

    })
})

function close() {
    if (modal.value) modal.value.close();
}
</script>

<template>
    <Modal ref="modal" class="min-h-90 max-h-screen flex flex-col md:max-h-2/3">
        <div class="flex items-center pb-2 mb-2 border-b border-b-base-200">
            <h1 class="text-2xl font-bold grow">Changelog</h1>
            <button class="btn btn-square" @click="close()"><i class="bi bi-x-lg"></i></button>
        </div>
        
        <div class="grow overflow-y-auto">
            <h2 class="text-lg font-bold">{{ title }}</h2>
            <div class="divider my-2"></div>
            <div class="prose prose-invert prose-sm" :innerHTML="content">
            </div>

        </div>
    </Modal>
</template>