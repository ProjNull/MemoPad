<script setup lang="ts">
import api from '@/api';
import { computed, inject, onDeactivated, onMounted, ref, useId, useTemplateRef, watch } from 'vue';
import File from './File.vue';

const treenav = inject<FileTreeProvider>("filetree");
const noti = inject<NotificationProvider>("notifications");
const ctmn = inject<ContextMenuProvider>("contextmenu");
const smdal = inject<SimpleModalProvider>("simple-modal");

const props = defineProps<{
    folder: API.FolderInfo & DeleteStatus,
    isRoot?:boolean
}>()



const folderElement = useTemplateRef("folder")


const name = ref<string | undefined>(undefined);

const dummyItems = ref<number>(0); 
const folders = ref<API.SubFolders | undefined>(undefined); 
const notes = ref<API.SubNotes | undefined>(undefined); 
const isFolderOpen = ref(false);

function loadFolder() {
    if (notes.value == undefined) {
        api.folders.getSubNotes(props.folder.id).then((req) => {
            notes.value = req.data 
            notes.value.forEach((n) => n.content = undefined);
            dummyItems.value -= props.folder.noteIds.length
        })
    }
    if (folders.value == undefined) {
        api.folders.getSubFolders(props.folder.id).then((req) => {
            folders.value = req.data
            dummyItems.value -= props.folder.subFolderIds.length
        })
    }

}



onMounted(() => {
    dummyItems.value = props.folder.subFolderIds.length + props.folder.noteIds.length
    if (props.isRoot) {
        loadFolder();
    }
})

async function createNote() {
    const name = await smdal?.ask("Create note");
    if (name != null) {
        const n = noti?.add("Creating...","progress");
        api.notes.create(props.folder.id, name)
        .then((res) => {
            if (res.status == 200) {
                n?.close()
                noti?.add("Created!","success")
                
                if (notes.value == undefined) return;
                notes.value.push(res.data);   
            }
        })
    }
}

async function createFolder() {
    const name = await smdal?.ask("Create folder","Name");
    if (name != null) {
        const n = noti?.add("Creating...","progress")
        api.folders.create(props.folder.id, name)
        .then((res) => {
            if (res.status == 200) {
                n?.close()
                noti?.add("Created!","success")
                
                if (folders.value == undefined) return;
                folders.value.push(res.data);   
            }
        })
    }
}

async function renameFolder() {
    const name = await smdal?.ask("Rename","New name");
    if (name) {
        api.folders.rename(props.folder.id,name).then((res) => {
            noti?.add("Renamed!","success");
            props.folder.name = res.data.name
        })
    }
}

async function deleteFolder() {
    const conf = await smdal?.confirm("Delete?","Delete this folder?");
    if (conf) {
        api.folders.delete(props.folder.id).then((res) => {
            noti?.add("Deleted!","success");
            props.folder.isDeleted = true
        })
    }
}

const menuOtions = computed<ContextMenuOptions>(() => {
    var base:ContextMenuOptions = [
        {id: "newNote", txt: "New Note", ico: "file-earmark-richtext"},
        {id: "newFolder", txt: "New Folder", ico: "folder2"}
    ]
    if (!props.isRoot) {
        base.push(false);
        base.push({id: "rename", txt: "Rename", ico: "pencil"})
        base.push({id: "move", txt: "Move", ico: "arrows-move"})
        base.push({id: "delete", txt: "Delete", ico: "trash"})
    }
    return base
})

function handleCTMN(selected:string) {
    switch(selected) {
        case "newNote": return createNote();
        case "newFolder": return createFolder();
        case "move": return smdal?.alert("WIP","Not yet Implemented")
        case "rename": return renameFolder();
        case "delete": return deleteFolder();
    }
}

const sortedFolders = computed(()=> {
    if (folders.value == undefined) return undefined;
    return folders.value.sort((a,b) => a.name.localeCompare(b.name))
})


const sortedNotes = computed(()=> {
    if (notes.value == undefined) return undefined;
    return notes.value.sort((a,b) => a.title.localeCompare(b.title))
})

</script>

<template>
    <li v-if="!folder.isDeleted" class="ml-1">
        <div 
            ref="folder"
            class="flex basis-0 w-full grow-0 box-border min-w-0 relative folder p-0 pr-2 mr-0 focus-within:bg-base-300 outline-offset-2 focus-within:outline-2"
            @contextmenu.prevent="ctmn?.open(menuOtions,handleCTMN)"
        >
            <button tabindex="1" class="focus:outline-0 text-left grow flex gap-2 p-2 basis-0 min-w-0" @click="isFolderOpen = !isFolderOpen;loadFolder()">
                <i v-if="isRoot" class="bi"></i>
                <i v-else-if="isFolderOpen" class="bi bi-chevron-down"></i>
                <i v-else class="bi bi-chevron-right"></i>
                <span v-if="folder.name" class="grow min-w-0 text-ellipsis text-nowrap overflow-x-hidden shrink basis-0" >{{ folder.name }}</span>
            </button>
            
            <button @click="ctmn?.open(menuOtions,handleCTMN,$event.target)" tabindex="1" class="btn btn-xs btn-ghost"><i class="bi bi-three-dots-vertical"></i></button>
        </div>

        
        <ul class="menu-dropdown ml-0 w-full box-border" :class="{'menu-dropdown-show': isFolderOpen || isRoot}">
            

            <template v-if="isFolderOpen || isRoot">
                <template v-for="el in sortedFolders" :key="el.id">
                    <Folder :folder="el">
                    </Folder>
                </template>
                
                <template v-for="el in sortedNotes"  :key="el.id">
                    <File :note="el">
                    </File>
                </template>
            </template>

            <template v-if="dummyItems > 0" v-for="d in dummyItems">
                <li><div class="flex">
                    <span class="skeleton opacity-50 p-2 m-1 w-20" :style="{width: (40 +Math.random() * 20)+'%'}"></span>

                </div></li>
            </template>

        </ul>
    </li>
</template>


