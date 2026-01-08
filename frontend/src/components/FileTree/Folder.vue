<script setup lang="ts">
import api from '@/api';
import { inject, onMounted, ref, useId, useTemplateRef, watch } from 'vue';


const props = defineProps<{
    id: number
}>()



const contextMenuElement = useTemplateRef("context-menu")

const name = ref("");


const folders = ref<number[]>([]); 

const isFolderOpen = ref(false);
const isContextOpen = ref(false);

function contextMenu(e:Event) {
    isContextOpen.value = true;

}

function closeContextMenu(e:Event) {
    isContextOpen.value = false;
}

onMounted(() => {
    document.addEventListener("click",closeContextMenu)
    console.log(props.id);
    api.getFolder(props.id).then((req) => {
        name.value = req.data.name  
        folders.value = req.data.subFolderIds 
    })
})


async function getSubFolders() {
    return api.getSubFolders(props.id)
}

const id = useId();
</script>

<template>
    <li>
        <div
            class="flex relative folder"
            @click.stop="isFolderOpen = !isFolderOpen"
            >
   
            <i v-if="isFolderOpen" class="bi bi-chevron-down"></i>
            <i v-else class="bi bi-chevron-right"></i>
        
            

            <span v-if="name" class="grow">{{ name }}</span>
            <div v-else class="skeleton h-3 grow"></div>

            <div @click.stop="contextMenu" role="button" class="btn btn-xs btn-ghost"><i class="bi bi-three-dots-vertical"></i></div>
            
            <ul v-if="isContextOpen" @click.stop="" tabindex="-1" class="absolute right-0 top-full menu bg-base-100 rounded-box z-1 w-42 p-2 shadow-sm">
                <li><a>New Note</a></li>
                <li><a>Item 2</a></li>
            </ul>
        </div>

        
        <ul class="menu-dropdown" :class="{'menu-dropdown-show': isFolderOpen}">
            <template v-if="isFolderOpen">
                <template v-for="folderID in folders">
                    <Folder :id="folderID">
                    </Folder>
                </template>
            </template>
        </ul>
    </li>
</template>


