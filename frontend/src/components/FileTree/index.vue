<script setup lang="ts">
import { onMounted, provide, ref, useTemplateRef } from 'vue';
import Folder from './Folder.vue';
import api from '@/api';

const rootFolders = ref<number[]>([]); 

onMounted(() => {
    api.getRootFolder().then((req) => {
        rootFolders.value = req.data.subFolderIds
    })
})

</script>

<template>
    <ul class="menu w-full px-0">
        <template v-for="folderID in rootFolders">
            <Folder :id="folderID">
            </Folder>
        </template>
    </ul>
</template>