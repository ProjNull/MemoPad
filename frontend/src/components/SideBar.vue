<script setup lang="ts">
import { provide, ref } from 'vue';

const isOpen = ref(false);

provide("sidebar",{
    open: () => isOpen.value = true,
    close: () => isOpen.value = true,
    toggle: () => isOpen.value = !isOpen.value,
    isOpen: () => isOpen.value,
})

</script>

<template>
    <div class="drawer md:drawer-open">
        <input type="checkbox" class="drawer-toggle" v-model="isOpen" />
        <div class="drawer-content">
            <slot></slot>
        </div>
        <div class="drawer-side">
            <label aria-label="close sidebar" @click="isOpen = false" class="drawer-overlay"></label>
            <div class="bg-base-200 min-h-full w-80 p-4 flex flex-col">
                <slot name="sidebar"></slot>
            </div>
        </div>
    </div>
</template>