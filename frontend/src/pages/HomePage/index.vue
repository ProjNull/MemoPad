<script setup lang="ts">
import api from '@/api';
import type { SideBarProvider } from '@/components/SideBar.vue';
import { useAuthStore } from '@/stores/auth';
import { useGlobalState } from '@/stores/global';
import { computed, inject, onMounted, ref, useTemplateRef, watch } from 'vue';

const noti = inject<NotificationProvider>("notifications");
import { marked } from 'marked';

const sidebar = inject<SideBarProvider>("sidebar")

const global = useGlobalState();
const auth = useAuthStore();

const note = computed(() => global.getOpenNote)

const title = ref("");

const content = ref("");

const isEdit = ref(false);
const processing = ref(false);
const hasChanges = computed(() => content.value != note.value?.content || title.value != note.value.title);


const contentHTML = ref("")
watch(content, async (v) =>{
    contentHTML.value = await marked.parse(v);
})



watch(note, (n)  => {
    if (!n) return;
    content.value = n.content
    title.value = n.title
},{immediate: true})


async function saveChanges() {
    if (!note.value) return;
    processing.value = true;

    try {
        if (content.value != note.value?.content) {
            const newContent = await api.notes.edit(note.value.id, content.value);
            if (newContent.status == 200) {
                if (global.$state.openNote) {
                    global.$state.openNote.content = newContent.data.content
                }
            }
        }
        if (title.value != note.value.title) {
            const newTitle = await api.notes.rename(note.value.id, title.value)
            if (newTitle.status == 200) {
                if (global.$state.openNote) {
                    global.$state.openNote.title = newTitle.data.title
                }
            }
            
        }
        return true
    } catch (error) {
        noti?.add("Failed to save. Try Again.","error");
        return false;
    } finally {

        processing.value = false;
        
    }

}

function toggleEdit() {
    if (isEdit.value && hasChanges.value) {
        saveChanges().then((r) => {
            if (r) isEdit.value = false;
        });
    } else {
        isEdit.value = !isEdit.value
    }
}

</script>

<template>

<div class="navbar bg-base-100 border-b border-b-base-200 shadow-sm">
  <div class="flex-1">
    <a class="btn btn-ghost btn-square md:hidden" @click="sidebar?.open()"><i class="bi bi-list"></i></a>
    <span class="text-xl ml-2">{{ note?.title ?? "Home" }}</span>
  </div>
  <div class="flex-none">
    <button v-if="note && processing" disabled class="btn btn-primary btn-square text-primary">
        <span class="loading loading-spinner loading-sm"></span>
    </button>
    <button v-if="note && !processing" @click="toggleEdit()" class="btn" :class="{'btn-square':!isEdit,'btn-secondary': isEdit && !hasChanges, 'btn-primary': isEdit && hasChanges}">
        <i v-if="!isEdit" class="bi-pencil"></i>
        <i v-else aria-label="disabled" class="bi-floppy"></i>
        <span v-if="isEdit">Save</span>
    </button>
  </div>
</div>

<div class="w-full mx-auto max-w-[120ch] grow p-2 flex flex-col" v-if="note">

    <template v-if="isEdit">
        <!--<input class="input w-full text-2xl font-black mt-4" v-model="title" :placeholder="note.title">
        <div class="divider my-0"></div>-->
        <textarea class="w-full font-mono textarea grow h-full resize-none rounded-box p-4 overflow-y-auto focus:outline-2 focus:outline-primary" v-model="content"></textarea>
    </template>
    <template v-else>
        <!--<h1 class="text-4xl font-black mt-4">{{ note.title }}</h1>
        <div class="divider"></div>-->
        <div :innerHTML="contentHTML" class="prose prose-invert prose-sm">

        </div>
   
    </template>

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