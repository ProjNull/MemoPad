<script setup lang="ts">

import Api from '@/api';
import { useAuthStore } from './stores/auth';
import { onMounted, provide, ref, useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import FileTree from './components/FileTree/index.vue';
import Toasts from './components/Global/Toasts.vue';
import ContextMenu from './components/Global/ContextMenu.vue';
import SideBar from './components/SideBar.vue';
import multiavatar from '@multiavatar/multiavatar/esm'
import ChangelogCheck from './components/ChangelogCheck.vue';
import Modal from './components/Modal.vue';
import SimpleModal from './components/Global/SimpleModal.vue';

const auth = useAuthStore();
const router = useRouter();

const showSide = ref(false);

const sidebarEL = useTemplateRef("sidebar");


const ctxMn = useTemplateRef("ctxMn");
provide<ContextMenuProvider>("contextmenu", {
  open: (opt,cl) => ctxMn.value?.open(opt,cl)
})
const simpleModal = useTemplateRef("simple-modal");
provide<SimpleModalProvider>("simple-modal",{
  ask: (t,p?) => simpleModal.value!.ask(t,p),
  confirm: (t,m) => simpleModal.value!.confirm(t,m),
  alert: (t,m) => simpleModal.value!.alert(t,m),
})


function checkLogin() {
  if (!auth.isLoggedIn) {
    router.push("/auth/")
  } else {
    router.push("/")
  }
}

watch(auth.$state, () => {
  checkLogin();
}, {immediate: true, deep: true});


watch(router.currentRoute, (nv) => {
  showSide.value = !nv.path.startsWith("/auth")
  
}, {immediate: true})


const notifications = ref<( { id: number, msg:string,type:NotificationType })[]>([]);


function addNotification(msg:string,type:NotificationType) {
  const id = Date.now();
  notifications.value.push({id,msg,type})

  const countdown = setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id != id)
  }, 4000)
  return {
    close: () => {
      clearTimeout(countdown);
      notifications.value = notifications.value.filter(n => n.id != id)
    }
  }
}

provide("notifications", {
  add: addNotification
})

const ready = ref(false);
onMounted(()=> {
  router.push("/auth/")
  setTimeout(() => ready.value = true)
})

const accountMenu:ContextMenuOptions = [
  {id:"logout",txt:"Logout",ico:"door-closed"}
]

function accountMenuHandler(id:string) {
  if (id == "logout") {
    simpleModal.value?.confirm("Logout?","Really Logout?").then(d => {
      if (d) {
        auth.logout();
      }
    })
  }
}

</script>

<template>
  
  <div v-if="ready" class="w-full h-svh">
    <SideBar ref="sidebar" v-if="showSide">
      <template v-slot:sidebar>
        <div class="flex items-center px-4 py-4 gap-2">
          <img class="h-5" src="/assets/icons/color.svg">
          <h1 class="font-bold grow">
            Memopad</h1>
          <button class="btn btn-square md:hidden" @click="sidebarEL?.close()">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
       
        <FileTree></FileTree>
       
        <div class="flex gap-2 items-center px-4 py-2">
          <div class="grow flex gap-2 items-center">

            <div class="w-8 h-8" :innerHTML="multiavatar(auth.getName())"></div>
            <span>{{ auth.getName() }}</span>
 
          </div>
          <div @click="ctxMn?.open(accountMenu,accountMenuHandler)" role="button" class="btn btn-square m-1"><i class="bi bi-three-dots-vertical"></i></div>

        </div>
      </template>
      <div class="flex flex-col h-full">
        <RouterView></RouterView>
      </div>
    </SideBar>
    <div v-else class="flex flex-col h-full">
        <RouterView></RouterView>
    </div>

  </div>
  <Toasts v-model="notifications"></Toasts>
  <ContextMenu ref="ctxMn"/>
  <SimpleModal ref="simple-modal"/>
  <ChangelogCheck></ChangelogCheck>
</template>

<style scoped></style>
