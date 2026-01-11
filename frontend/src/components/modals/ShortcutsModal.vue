<script setup lang="ts">
import { useTemplateRef } from 'vue';
import Modal from '../Modal.vue';
const modal = useTemplateRef("modal");

defineExpose({
    open: () => modal.value?.open()
})

function close() {if (modal.value) {modal.value.close()}}

type ShortCutDef = {
    keys: string[],
    desc: string,
    wip?: true
}

type Category = {
    name: string,
    shortcuts: ShortCutDef[],
}


const shortcuts:Category[] = [
    {name: "Note Editing", shortcuts: [
        {keys: ["Ctrl","E"], desc: "Toggle Edit Mode (Saves too)"},
        {keys: ["Ctrl","S"], desc: "Save Note (Don't close)"},
    ]},
    {name: "General", shortcuts: [
        {keys: ["Ctrl", "K"], desc: "Fuzzy Search", wip: true},
        {keys: ["Ctrl", "Shift","E"], desc: "Focus File Tree", wip: true},
        {keys: ["Ctrl", "Shift","H"], desc: "Show Shortcuts"},
    ]},
    {name: "Modals",shortcuts: [
        {keys: ["ESC"], desc: "Close Modal (Only on some modals)"},
    ]},
]

</script>

<template>
    <Modal @on-close-key="close()" ref="modal" class="min-h-90 max-h-screen flex flex-col md:max-h-2/3">
        <div class="flex items-center pb-2 mb-2">
            <h1 class="text-2xl font-bold grow">Shortcuts</h1>
            <button class="btn btn-square" @click="close()"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="grow overflow-y-auto ">
            <template v-for="category in shortcuts">
                <h2 class="text-lg font-bold my-2">{{ category.name }}</h2>
                <ul>
                    <template v-for="short in category.shortcuts">
                        <li class="flex items-start gap-2 mb-1 p-2 rounded-field select-none hover:bg-base-200">
                            <div class="flex gap-1">
                                <template v-for="key,index in short.keys">
                                    <kbd class="kbd rounded-sm">{{key}}</kbd>
                                    <span v-if="index < short.keys.length - 1">+</span>
                                </template>
                            </div>
                            <div class="grow">
                                {{ short.desc }}
                            </div>
                            <span v-if="short.wip" class="badge hidden md:block">Work in progress</span>
                            <span v-if="short.wip" class="badge block md:hidden">WIP</span>
                        </li>
                    </template>
                </ul>
            </template>
        </div>
    </Modal>
</template>