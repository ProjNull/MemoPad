<script setup lang="ts">
import api from '@/api';
import type { SideBarProvider } from '@/components/SideBar.vue';
import { useAuthStore } from '@/stores/auth';
import { useGlobalState } from '@/stores/global';
import { computed, inject, onMounted, ref, useTemplateRef } from 'vue';
import NoteEdit from './NoteEdit.vue';
import NoteView from './NoteView.vue';

const sidebar = inject<SideBarProvider>("sidebar")

const global = useGlobalState();
const auth = useAuthStore();

const note = computed(() => global.getOpenNote)

const isEdit = ref(false);
const hasChanges = ref(false);
</script>

<template>

<div class="navbar bg-base-100 border-b border-b-base-200 shadow-sm">
  <div class="flex-1">
    <a class="btn btn-ghost btn-square md:hidden" @click="sidebar?.open()"><i class="bi bi-list"></i></a>
    <span class="text-xl">{{ note?.title ?? "Home" }}</span>
  </div>
  <div class="flex-none">
    <button v-if="note" @click="isEdit = !isEdit" class="btn" :class="{'btn-square':!isEdit,'btn-secondary': isEdit && !hasChanges, 'btn-primary': isEdit && hasChanges}">
        <i v-if="!isEdit" class="bi-pencil"></i>
        <i v-else aria-label="disabled" class="bi-floppy"></i>
        <span v-if="isEdit">Save</span>
    </button>

  </div>
</div>

<div class="w-full grow p-2 flex flex-col" v-if="note">
    <NoteEdit :note="note" v-if="isEdit"></NoteEdit>
    <NoteView :note="note" v-else></NoteView>
</div>

<div class="w-full grow flex justify-center items-center flex-col gap-2" v-else>
    <div class="memo text-4xl font-bold mb-4" style="animation-duration: 1s;">
        <img class="mx-auto w-20" src="/assets/icons/color.svg">
        <div class="text-center mt-4">Memopad</div>
    </div>
    <div class="memo text-xl" style="animation-duration: 1.5s;">
        <span>Welcome {{ auth.getName() }}!</span>
    </div>
    <div class="memo " style="animation-duration: 2s;">
        <span>Please select note.</span>
    </div>
</div>

</template>

<style lang="css" scoped>
.memo {
    animation: showMemo 1s;
}
@keyframes showMemo {
    0%,25% {
        opacity: 0;
        transform: translateY(1rem);
    }
}
</style>