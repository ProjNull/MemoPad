
<script setup lang="ts">
import { marked } from 'marked';
import { computed, ref, watch } from 'vue';

const props =defineProps<{
    note: API.NoteInfo
}>()

const content = ref("");


</script>
<template>
    <textarea class="w-full bg-base-200/50 grow h-full resize-none rounded-box p-4 overflow-y-auto focus:outline-2 focus:outline-primary" v-model="content">

    </textarea>

</template>