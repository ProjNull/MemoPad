<script setup lang="ts">
import {onMounted, provide, ref, Teleport, useTemplateRef, type StyleValue } from 'vue';

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
            modal.value.showModal()
           
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
    <teleport to="#modals">
        <dialog v-if="showModal" closeby="none" ref="modal" class="modal backdrop-blur-xs z-30 p-2" >
            <div class="modal-box border border-base-200" :style="style" :class="class">
                <slot></slot>
            </div>
        </dialog>
    </teleport>
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