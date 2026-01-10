<script setup lang="ts">
import { useTemplateRef } from 'vue';
import Modal from '../Modal.vue';
const modal = useTemplateRef("modal");

defineExpose({
    open: () => modal.value?.open()
})

function close() {if (modal.value) {modal.value.close()}}

</script>

<template>
    <Modal ref="modal" class="min-h-90 max-h-screen flex flex-col md:max-h-2/3">
        <button class=" ml-auto btn btn-square" @click="close()"><i class="bi bi-x-lg"></i></button>
       
        
        <div class="grow overflow-y-auto prose">
            <img class="mx-auto" src="/assets/icons/color.svg">
            <h2 class=" text-center mt-0">About</h2>
            <div class="flex gap-1">
                <a href="https://kb.projnull.eu/unlisted:memopad:" target="_blank" class="btn no-underline grow basis-0 btn-">Docs</a>
                <a href="https://github.com/projnull/memopad" target="_blank" class="btn no-underline grow basis-0 btn-">Source</a>
            </div>
            
            <h3>Developers</h3>
            <ul>
                <li>Jan Palma - App Design / Website</li>
                <li>HyScript - Server / Database</li>
            </ul>
            <div class="collapse p-0 rounded-none collapse-arrow">
                <input type="checkbox" />
                <div class="collapse-title bg-base-200 p-2 text-base-content rounded-box font-semibold">Used Software / libs</div>
                <div class="collapse-content text-sm">
                    <h4>Client</h4>
                    <ul>
                        <li>Vue</li>
                        <li>DaisyUI</li>
                        <li>Tailwind, Tailwind Typography</li>
                        <li>Axios</li>
                        <li>Pinia</li>
                    </ul>

                    <h4>Server / Database</h4>
                    <ul>
                        <li>Java Spring</li>
                        <li>Posgress</li>
                    </ul>
                    <div class="divider"></div>
                </div>
            </div>

            <div class="text-center">
                <a class="mx-auto block w-fit" href="https://projnull.eu" target="_blank">
                    <img class="w-20" src="/assets/null.png">
                </a>
            </div>
            
            

        </div>
    </Modal>
</template>