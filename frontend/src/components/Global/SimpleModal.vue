<script setup lang="ts">
import { h, ref, useTemplateRef, type Ref } from 'vue';
import Modal from '../Modal.vue';
import { marked } from 'marked';



const modal = useTemplateRef("modal");

type ModalType = "ask" | "confirm" | "alert"


type ModalDef = {
    id: number,
    title: string,
    value: string,
    placeholder?: string,
    type: ModalType ,
    resolve: (value:any) => void,
    onEsc: () => void,
}


const modals = ref<ModalDef[]>([])


const res = ref<((name:string | null)=>void)| null>(null)

var incr = 0

function open<T>(type:ModalType,title:string,value:string,onEscValue: T,place?:string) {
    console.log("O");
    return new Promise<T>(async (resp) => {
        if (type != "ask") {
            value = await marked.parse(value);
        }

        const id = ++incr;
        const p = {
            id,
            type,title,placeholder: place ?? "",value,
            resolve: (v:any) => {
                modals.value = modals.value.filter(s => s.id != p.id);

                resp(v);
            },
            onEsc: () => {
                p.resolve(onEscValue)
            }
        };
        modals.value.push(p)
    })
}


function ask(title: string,placeholder?:string) {
    return open<string | null>("ask",title, "",null,placeholder);
}

function confirm(title: string,msg:string) {
    return open<boolean>("confirm",title,msg,false);
}

function alert(title: string,msg:string) {
    return open<null>("alert",title,msg,null);
}




defineExpose<SimpleModalProvider>({
    ask,
    alert,
    confirm
})


</script>

<template>
    <template v-for="m in modals">
        <Modal auto-open class="w-full max-w-100" ref="modal" @on-close-key="m.onEsc()">
            <h1 class="text-2xl font-bold mb-4">{{ m.title }}</h1>
            <template v-if="m.type == 'alert'">
                <p :innerHTML="m.value"></p>

                <div class="modal-action flex gap-2 mt-4">
                    <button class="btn btn-primary basis-0 grow" autofocus @click="m.resolve(null)">OK</button>
                </div>
            </template>

            <template v-if="m.type == 'ask'" :set>
                <form action="" method="" @submit.prevent="m.resolve(m.value ?? null)">
                    <label class="input">
                        <input v-model="m.value" autofocus :placeholder="m.placeholder">
                    </label>
                </form>
                <div class="modal-action flex gap-2 mt-4">
                    <button class="btn btn-secondary btn-outline basis-0 grow" autofocus @click="m.resolve(null)">Cancel</button>
                    <button class="btn btn-primary basis-0 grow" @click="m.resolve(m.value ?? null)">Confirm</button>
                </div>

                
            </template>

            <template v-if="m.type == 'confirm'">
                <p :innerHTML="m.value"></p>

                <div class="modal-action flex gap-2 mt-4">
                    <button class="btn btn-secondary btn-outline basis-0 grow" @click="m.resolve(false)">No</button>
                    <button class="btn btn-primary basis-0 grow default-focus" autofocus @click="m.resolve(true)">Yes</button>
                </div>
            </template>
            

            
        </Modal>
    </template>
    
</template>