<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';

import changelogAPI, { type Changelog } from '@/api/cls.ts';
import Modal from './Modal.vue';

const modal = useTemplateRef("modal");
const content = ref("");
const title = ref("");

onMounted(() => {
    
    changelogAPI.isLatest().then((d) => {
        if (d) {
            modal.value?.open();
            console.log("test");
            content.value = d.description
            title.value = d.title
        }

    })
})
</script>

<template>
    <Modal ref="modal" class="min-h-90 max-h-screen">
        <div class="flex items-center pb-2 mb-2 border-b border-b-base-200">
            <h1 class="text-2xl font-bold grow">Changelog</h1>
            <button class="btn btn-square" @click="modal?.close()"><i class="bi bi-x-lg"></i></button>
        </div>
        
        <h2 class="text-lg font-bold">{{ title }}</h2>
        <div>
            {{ content }}
        </div>
    </Modal>
</template>