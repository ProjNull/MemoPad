<script setup lang="ts">
import api from '@/api';
import type { SideBarProvider } from '@/components/SideBar.vue';
import { useAuthStore } from '@/stores/auth';
import { useGlobalState } from '@/stores/global';
import { computed, inject, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';

const noti = inject<NotificationProvider>("notifications");
import { marked } from 'marked';

const sidebar = inject<SideBarProvider>("sidebar")

const global = useGlobalState();
const auth = useAuthStore();

const note = computed(() => global.getOpenNote)

const textEdit = useTemplateRef("textedit");

const title = ref("");
const content = ref("");
const isEdit = ref(false);
const processing = ref(false);
const hasChanges = computed(() => content.value != note.value?.content || title.value != note.value.title);


const contentHTML = ref("")
watch(content, async (v) =>{
    contentHTML.value = await marked.parse(v);
})



watch(note, (n,o)  => {
    if (!n) return;

    if (o && n.id != o.id) isEdit.value = false;
    content.value = n.content ?? ""
    title.value = n.title
},{immediate: true})

watch(isEdit,(v) => {
    global.setEditing(v);
},{immediate:true})

async function saveChanges() {
    if (!note.value) return;
    processing.value = true;
    const prog =noti?.add("Saving...","progress");
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
        noti?.add("Saved","success");
        return true
    } catch (error) {
        noti?.add("Failed to save. Try Again.","error");
        return false;
    } finally {
        prog?.close();
        processing.value = false;
        
    }

}

function toggleEdit() {
    if (!note.value) return;
    if (isEdit.value && hasChanges.value) {
        saveChanges().then((r) => {
            if (r) isEdit.value = false;
        });
    } else {
        isEdit.value = !isEdit.value
        setTimeout(()=> {
            if (textEdit.value) {
                textEdit.value.focus();
            }
        })
    }
}


function tabPrevent(e:KeyboardEvent) {
    if (!e.target) return;
    const el = e.target as HTMLTextAreaElement
    if (e.key == "Tab") {
        
        e.preventDefault()
        if (!e.altKey && !e.ctrlKey && !e.shiftKey) {
            const start = el.selectionStart;
            const end = el.selectionEnd;

            const value = el.value;
            el.setRangeText("\t", start, end, "end");
        }
    }


}

function shortcuts(e:KeyboardEvent) {
    if (e.key == "e" && e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        toggleEdit()
    }

    if (e.key == "s" && e.ctrlKey) {

        e.preventDefault();
        if (note.value && isEdit.value) {
            saveChanges();
        }
    }
    
}

onMounted(() => {
    document.addEventListener("keydown",shortcuts);
})

onUnmounted(() => {
    document.removeEventListener("keydown",shortcuts);
})

</script>

<template>

<div class="navbar bg-base-100 border-b border-b-base-200 shadow-sm flex-nowrap">
  <div class="flex-1 flex grow flex-nowrap basis-0 items-center min-w-0">
    <a class="btn btn-ghost btn-square md:hidden" @click="sidebar?.open()"><i class="bi bi-list"></i></a>
    <span class="text-xl block mx-2 text-ellipsis text-nowrap overflow-x-hidden min-w-0 grow shrink">{{ note?.title ?? "Home" }}</span>
  </div>
  <!-- <div class="flex-none hidden md:block"> -->
  <div class="flex-none">
    <template v-if="note">

        <button v-if="processing" disabled class="btn btn-primary btn-square text-primary">
            <span class="loading loading-spinner loading-sm"></span>
        </button>
        <button v-else-if="isEdit" @click="toggleEdit()" class="btn" :class="{'btn-secondary': !hasChanges, 'btn-primary': hasChanges}">
            <i aria-label="disabled" class="bi-floppy"></i>
            <span>Save</span>
        </button>
        <button v-else @click="toggleEdit()" class="btn btn-square">
            <i class="bi-pencil"></i>
        </button>
    </template>
  </div>
</div>

<div class="w-full mx-auto max-w-[120ch] grow flex flex-col" v-if="note">

    <template v-if="isEdit">
        <div class="md:px-2 grow">
        <!--<input class="input w-full text-2xl font-black mt-4" v-model="title" :placeholder="note.title">
        <div class="divider my-0"></div>-->
            <textarea ref="textedit" @keydown="tabPrevent" class="w-full bg-base-200/20 font-mono textarea grow h-full resize-none rounded-none border-0 md:border-x border-y-0 p-2 py-4 overflow-y-auto focus:outline-0 border-base-200 focus:border-base-200" v-model="content"></textarea>
        </div>
    </template>
    <template v-else>
        <!--<h1 class="text-4xl font-black mt-4">{{ note.title }}</h1>
        <div class="divider"></div>-->
        <div v-if="!content || content.trim().length == 0" class=" p-2 text-center">
            No Content
        </div>
        <div v-else :innerHTML="contentHTML" class="prose max-w-full prose-invert prose-sm overflow-y-auto grow p-4 basis-0">

        </div>
   
    </template>
    <!--    <div class="fixed bottom-4 right-4 block md:hidden ">
        <template v-if="note">

            <button v-if="processing" disabled class="btn btn-xl btn-primary btn-square text-primary">
                <span class="loading loading-spinner loading-sm"></span>
            </button>
            <button v-else-if="isEdit" @click="toggleEdit()" class="btn btn-xl btn-square" :class="{'btn-secondary': !hasChanges, 'btn-primary': hasChanges}">
                <i aria-label="disabled" class="bi-floppy"></i>
            </button>
            <button v-else @click="toggleEdit()" class="btn btn-xl btn-square">
                <i class="bi-pencil"></i>
            </button>
        </template>
    </div>-->


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