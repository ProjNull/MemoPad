<script setup lang="ts">
import {onMounted, provide, ref, useTemplateRef, type StyleValue } from 'vue';

const props = defineProps<{
    style?: StyleValue,
    class?: any,
    autoOpen?:boolean
}>()

const awaitP = ref<null | Promise<unknown>>(null);

const modal = useTemplateRef<HTMLDialogElement>("modal");
const showModal = ref(false);

const emit = defineEmits<{
    (e:"closed", data: unknown | undefined): void
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
    showModal.value = false
}

provide("currentModal",{
    open,
    close
})
defineExpose({
    open,
    close() {close(undefined)}
})

onMounted(() => {
    if (props.autoOpen) {
        open();
    }
})
</script>

<template>
    <dialog v-if="showModal" ref="modal" class="modal backdrop-blur-xs" >
        <div class="modal-box border border-base-200" :style="style" :class="class">
            <slot></slot>
        </div>
    </dialog>
</template>