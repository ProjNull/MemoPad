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
    (e:"closed", data: unknown | undefined): void,
    (e:"on-close-key"): void
}>()

var timeout: undefined | number = undefined;

function open() {
    showModal.value = true
    document.addEventListener("keydown",detectCloseKey)

    setTimeout(()=>{
        if (modal.value) {
            const tofocus = modal.value.querySelectorAll("default-focus");
            for (const el of tofocus) {
                (el as HTMLElement).focus();
            }
            
        }
    },0)
}

function close(data?:unknown) {
    emit("closed",data);
    document.removeEventListener("keydown",detectCloseKey)
    showModal.value = false
}

function detectCloseKey(e:KeyboardEvent) {
    if (e.key == "Escape") {
        e.preventDefault()
        emit("on-close-key")
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

onMounted(() => {
    if (props.autoOpen) {
        open();
    }
})
</script>

<template>
    <div v-if="showModal" ref="modal" class="modal backdrop-blur-xs modal-open " >
        <div class="modal-box border border-base-200 ms" :style="style" :class="class">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="css" scoped>

.ms {
    animation: scaleIN ease-out 200ms;
}

@keyframes scaleIN {
    from {
        opacity: 0;
        scale: 0.95;
    }
}
</style>