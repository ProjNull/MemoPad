<script setup lang="ts">
import {provide, ref, useTemplateRef, type StyleValue } from 'vue';

const props = defineProps<{
    style?: StyleValue,
    class?: any
}>()

const modal = useTemplateRef<HTMLDialogElement>("modal");
const showModal = ref(false);

const emit = defineEmits<{
    <T>(e:"closed", data: T | undefined): void
}>()

var timeout: undefined | number = undefined;

function open() {
    showModal.value = true
    setTimeout(() => {
        modal.value?.showModal();
    }, 0);
}

function close(data?:unknown) {
    emit("closed",data);
    modal.value?.close();
}

function toggle(event:ToggleEvent) {
    if (event.newState == "closed") {
        showModal.value = false
    } else {
        showModal.value = true
    }
}
provide("currentModal",{
    open,
    close
})
defineExpose({
    open,
    close() {close(undefined)}
})

</script>

<template>
    <dialog v-if="showModal" ref="modal" class="modal" @toggle="toggle" >
        <div class="modal-box" :style="style" :class="class">
            <slot></slot>
        </div>
    </dialog>
</template>