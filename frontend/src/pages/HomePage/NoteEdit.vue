
<script setup lang="ts">
import { marked } from 'marked';
import { computed, onMounted, ref, watch } from 'vue';

const props =defineProps<{
    note: API.NoteInfo
}>()

const isEditMode = defineModel("isEditMode")
const hasChanges = defineModel("hasCHnages")


const content = ref("");

watch(content, () => {
    hasChanges.value = content.value != props.note.content
})

onMounted(() => {
    content.value = props.note.content
}) 


</script>
<template>
    
</template>