<script setup lang="ts">
import api from '@/api';
import { useGlobalState } from '@/stores/global';
import { inject, onMounted, ref } from 'vue';
import type { SideBarProvider } from '../SideBar.vue';
const ctmn = inject<ContextMenuProvider>("contextmenu");
const noti = inject<NotificationProvider>("notifications");
const smdal = inject<SimpleModalProvider>("simple-modal");
const sidebar = inject<SideBarProvider>("sidebar")



const global = useGlobalState();


const props = defineProps<{
    note:API.NoteInfo & DeleteStatus
}>()

const treenav = inject<FileTreeProvider>("filetree");

const menuOtions:ContextMenuOptions = [
    {id: "rename", txt: "Rename", ico: "pencil"},
    {id: "delete", txt: "Delete", ico: "trash"}
]


async function renameNote() {
    const name = await smdal?.ask("Rename","New name");
    if (name) {
        api.notes.rename(props.note.id,name).then((res) => {
            noti?.add("Renamed!","success");
            props.note.title = res.data.title;
            
            if (global.isCurrentOpenNote(props.note.id)) {
                global.setOpenNote(res.data);
            }
        })
    }
}

async function deleteNote() {
    const conf = await smdal?.confirm("Delete?","Delete this note?");
    if (conf) {
        api.notes.delete(props.note.id).then((res) => {
            noti?.add("Deleted!","success");
            props.note.isDeleted = true
            if (global.isCurrentOpenNote(props.note.id)) {
                global.clearOpenNote();
            }
        })
    }
}

function handleCTMN(selected:string) {
    switch(selected) {
        case "rename": return renameNote()
        case "delete": return deleteNote()
    }
}

function openNote() {
    const n = noti?.add("Opening...","progress");
    api.notes.get(props.note.id).then((res) => {
        n?.close();
        sidebar?.close()
        global.setOpenNote(res.data);
    })
}

</script>

<template>
    <li v-if="!note.isDeleted">
        <div
            ref="folder"
            class="flex note relative folder p-0 pr-2"
            @contextmenu.prevent="ctmn?.open(menuOtions,handleCTMN)"
        >
            <div class="grow flex gap-2 p-2" @click="openNote()">
                <i v-if="note.id == global.openNote?.id" class="bi bi-file-earmark-richtext-fill"></i>
                <i v-else class="bi bi-file-earmark-richtext"></i>
                <span v-if="note.title" >{{ note.title }}</span>
            </div>
            
        
            

            


            <div @click="ctmn?.open(menuOtions,handleCTMN)" role="button" class="btn btn-xs btn-ghost"><i class="bi bi-three-dots-vertical"></i></div>

        </div>

    </li>
</template>
