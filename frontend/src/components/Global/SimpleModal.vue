<script setup lang="ts">
import { h, ref, useTemplateRef, type Ref } from 'vue';
import Modal from '../Modal.vue';



const modal = useTemplateRef("modal");
const toFOcus = useTemplateRef("focus-this");

type ModalType = "ask" | "confirm" | "alert"


type ModalDef = {
    id: number,
    title: string,
    value: string,
    placeholder?: string,
    type: ModalType ,
    resolve: (value:any) => void,
}


const modals = ref<ModalDef[]>([])


const res = ref<((name:string | null)=>void)| null>(null)

var incr = 0

function open<T>(type:ModalType,title:string,value:string,place?:string) {
    console.log("O");
    return new Promise<T>((resp) => {
        const id = ++incr;
        const p = {
            id,
            type,title,placeholder: place ?? "",value,
            resolve: (v:any) => {
                modals.value = modals.value.filter(s => s.id != p.id);

                resp(v);
            }
        };

        modals.value.push(p)

        setTimeout(() => {
            if (toFOcus.value) {
                toFOcus.value.forEach(el => {
                    if (el) {
                        el.focus()
                    }
                })
            }
        })
    })
}


function ask(title: string,placeholder?:string) {
    return open<string | null>("ask",title, "",placeholder);
}

function confirm(title: string,msg:string) {
    return open<boolean>("confirm",title,msg);
}

function alert(title: string,msg:string) {
    return open<void>("alert",title,msg);
}




defineExpose<SimpleModalProvider>({
    ask,
    alert,
    confirm
})


</script>

<template>
    <template v-for="m in modals">
        <Modal auto-open class="w-80" ref="modal">
            <h1 class="text-2xl font-bold mb-4">{{ m.title }}</h1>
            <template v-if="m.type == 'alert'">
                <p>{{ m.value }}</p>

                <div class="modal-action flex gap-2 mt-4">
                    <button class="btn btn-primary basis-0 grow" default-focus ref="focus-this" @click="m.resolve(null)">OK</button>
                </div>
            </template>

            <template v-if="m.type == 'ask'" :set>
                <form action="" method="" @submit.prevent="m.resolve(m.value ?? null)">
                    <label class="input">
                        <input ref="focus-this" v-model="m.value" default-focus :placeholder="m.placeholder">
                    </label>
                </form>
                <div class="modal-action flex gap-2 mt-4">
                    <button class="btn btn-secondary btn-outline basis-0 grow" @click="m.resolve(null)">Cancel</button>
                    <button class="btn btn-primary basis-0 grow" @click="m.resolve(m.value ?? null)">Confirm</button>
                </div>

                
            </template>

            <template v-if="m.type == 'confirm'">
                <p>{{ m.value }}</p>

                <div class="modal-action flex gap-2 mt-4">
                    <button class="btn btn-secondary btn-outline basis-0 grow" @click="m.resolve(false)">No</button>
                    <button class="btn btn-primary basis-0 grow default-focus" ref="focus-this" @click="m.resolve(true)">Yes</button>
                </div>
            </template>
            

            
        </Modal>
    </template>
    
</template>