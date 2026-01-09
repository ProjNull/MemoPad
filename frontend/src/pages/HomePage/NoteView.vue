
<script setup lang="ts">
import { marked } from 'marked';
import { computed } from 'vue';


const props =defineProps<{
    note: API.NoteInfo
}>()

const content = computed(() => marked.parse(props.note.content))

</script>
<template>
    <div v-if="!props.note.content" class="text-center mt-8">
        No Content
    </div>
    <div :innterHTML="content">

    </div>
</template>