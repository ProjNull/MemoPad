<script setup lang="ts">
import { ref } from 'vue';


defineProps<{
    name: string,
    id: string
}>()


const isOpen = ref(false);

</script>

<template>
    <li>
        <span
            class="menu-dropdown-toggle"
            :class="{'menu-dropdown-show': isOpen}"
            @click="isOpen = !isOpen">{{ name }}</span>
        <ul class="menu-dropdown" :class="{'menu-dropdown-show': isOpen}">
            <slot v-if="isOpen"></slot>
        </ul>
    </li>
</template>