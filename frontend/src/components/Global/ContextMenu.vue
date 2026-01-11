<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';

const menuEl = useTemplateRef("menu");
const isOpen = ref(false);
const mousePos = ref({x:0,y:0});
const callback = ref<ContextMenuCallback | undefined>(undefined);
const options = ref<ContextMenuOptions>([]);
function open(opts:ContextMenuOptions,call:ContextMenuCallback, target?: Element | null) {
    options.value = opts;
    callback.value = call;
    isOpen.value = true;
    setTimeout(() => {
        if (menuEl.value) {
            menuEl.value.showPopover()
        }
        if (target) {
            positionForTarget(target)
        } else {
            position()
        }
        document.body.blur()
    })
}


function clamp(min:number,max:number,value:number) {
    return Math.min(max,Math.max(min,value))
}


function positionForTarget(target:Element) {

    if (!menuEl.value) return;
    const tr = target.getBoundingClientRect();
    var pos = {x: tr.left + tr.width / 2,y:tr.top }
    var mr = menuEl.value.getBoundingClientRect()
    


    
    


    let vW = window.innerWidth;
    let vH = window.innerHeight;

    var endPos = {x:0,y:0}

    if (pos.y+tr.height+mr.height > vH) {
        pos.y = pos.y-mr.height - 5
    } else {
        pos.y = pos.y+tr.height + 5

    }

    endPos.x = clamp(0,vW - mr.width ,pos.x - mr.width / 2);
    endPos.y = clamp(5,vH - mr.height,pos.y);
    console.log(endPos)
    
    menuEl.value.style.translate = `${endPos.x}px ${endPos.y}px`;
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

    endPos.x = clamp(0,vW - rect.width ,pos.x - rect.width / 2);
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

function close() {
    options.value =[];
    if (menuEl.value) {
        menuEl.value.hidePopover()
    }
    isOpen.value = false;
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
        close()
    }, { capture: true});
})

</script>

<template>

    <ul popover="manual" @blur="close()" v-if="isOpen" ref="menu" class="ctx fixed top-0 left-0 menu border border-base-200 bg-base-100 box-border rounded-box z-100 w-52 p-2 shadow-sm">
        <template v-for="value in options">
            <hr class="spliter" v-if="value === false">
            <li v-else><button autofocus @click="selected(value.id)">
                <i class="bi" :class="'bi-'+ value.ico"></i>
                {{ value.txt }}
            </button></li>
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
    display: none;
}
.ctx:popover-open {
    animation: fadeIN 100ms;
    display: block;

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