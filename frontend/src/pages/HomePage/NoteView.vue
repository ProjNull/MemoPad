
<script setup lang="ts">
import { marked } from 'marked';
import { computed } from 'vue';


const props =defineProps<{
    note: API.NoteInfo
}>()

const content = computed(() => marked.parse(props.note.content))

</script>
<template>
    <h1 class="text-2xl font-bold">{{ note.title }}</h1>
    <div v-if="!props.note.content" class="text-center mt-8">
        No Content
    </div>
    <div :innterHTML="content">

    </div>
</template>