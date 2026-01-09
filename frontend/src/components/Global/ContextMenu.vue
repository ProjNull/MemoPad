<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';

const menuEl = useTemplateRef("menu");
const isOpen = ref(false);
const mousePos = ref({x:0,y:0});
const callback = ref<ContextMenuCallback | undefined>(undefined);
const options = ref<ContextMenuOptions>([]);
function open(opts:ContextMenuOptions,call:ContextMenuCallback) {
    options.value = opts;
    callback.value = call;
    isOpen.value = true;
    setTimeout(() => position())
}


function clamp(min:number,max:number,value:number) {
    return Math.min(max,Math.max(min,value))
}

function position() {
    if (!menuEl.value) return;
    var pos = {x: mousePos.value.x +10 ,y: mousePos.value.y +10}
    var rect = menuEl.value.getBoundingClientRect()

    let vW = window.innerWidth;
    let vH = window.innerHeight;

    var endPos = {x:0,y:0}

    if (pos.y+rect.height > vH) {
        pos.y = pos.y-rect.height - 30
    }

    endPos.x = clamp(0,vW - rect.width / 2,pos.x - rect.width / 2);
    endPos.y = clamp(5,vH - rect.height,pos.y);
    console.log(endPos)
    
    menuEl.value.style.translate = `${endPos.x}px ${endPos.y}px`;
}

defineExpose<ContextMenuProvider>({
    open
})


function selected(option:string) {
    if (callback.value) {
        callback.value(option);
    }
}

onMounted(() => {
    document.addEventListener('mousemove', function(event) {
        mousePos.value = {
            x: event.clientX,
            y: event.clientY
        }
    });

    document.addEventListener('click', function(event) {
        if (event.target == menuEl.value) return;
        options.value =[];
        isOpen.value = false;
    }, { capture: true});
})

</script>

<template>

    <ul v-if="isOpen" ref="menu" tabindex="-1" class="ctx fixed top-0 left-0 menu border border-base-200 bg-base-100 box-border rounded-box z-100 w-52 p-2 shadow-sm">
        <template v-for="value in options">
            <hr class="spliter" v-if="value === false">
            <li v-else><a @click="selected(value.id)">
                <i class="bi" :class="'bi-'+ value.ico"></i>
                {{ value.txt }}
            </a></li>
        </template>
    </ul>
</template>

<style lang="css" scoped>
@reference '@/style.css';
.bi {
    min-width: 1em;
}
.spliter {
    @apply border-base-200 my-2;
}
.ctx {
    translate: -100% -100%;
    animation: fadeIN 100ms;
}
@keyframes fadeIN {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

</style>