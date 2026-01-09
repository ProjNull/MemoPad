<script setup lang="ts">
import { provide, ref } from 'vue';

export type SideBarProvider = {
    open: () => void,
    close: () => void,
    toggle: () => void,
    isOpen: () => boolean,
}

const isOpen = ref(false);

provide<SideBarProvider>("sidebar",{
    open: () => isOpen.value = true,
    close: () => isOpen.value = false,
    toggle: () => isOpen.value = !isOpen.value,
    isOpen: () => isOpen.value,
})

defineExpose({
    open: () => isOpen.value = true,
    close: () => isOpen.value = false,
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
            <div class="bg-base-200 sm:rounded-r-box md:rounded-r-none min-h-full w-full sm:w-70 lg:w-80 flex flex-col">
                <slot name="sidebar"></slot>
            </div>
        </div>
    </div>
</template>