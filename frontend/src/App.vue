<script setup lang="ts">

import Api from '@/api';
import { useAuthStore } from './stores/auth';
import { onMounted, onUnmounted, provide, ref, useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import FileTree from './components/FileTree/index.vue';
import Toasts from './components/Global/Toasts.vue';
import ContextMenu from './components/Global/ContextMenu.vue';
import SideBar from './components/SideBar.vue';
import multiavatar from '@multiavatar/multiavatar/esm'
import ChangelogCheck from './components/ChangelogCheck.vue';
import Modal from './components/Modal.vue';
import SimpleModal from './components/Global/SimpleModal.vue';
import AboutModal from './components/modals/AboutModal.vue';
import Shortcuts from './components/modals/ShortcutsModal.vue';
import { useGlobalState } from './stores/global';


const global = useGlobalState();
const auth = useAuthStore();
const router = useRouter();

const showSide = ref(false);

const sidebarEL = useTemplateRef("sidebar");
const aboutModal = useTemplateRef("about-modal");
const shortcutsModal = useTemplateRef("shortcuts-modal");


const ctxMn = useTemplateRef("ctxMn");
provide<ContextMenuProvider>("contextmenu", {
  open: (opt,cl,t) => ctxMn.value?.open(opt,cl,t)
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


function addNotification(msg:string,type:NotificationType,forceID?:number) {
  const id = forceID ?? Date.now();
  notifications.value.push({id,msg,type})
  const countdown = setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id != id)
  }, 4000)
  if (type == "progress") {
    clearTimeout(countdown);
  }
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
const serverOffline = ref(false);
onMounted(()=> {

  document.addEventListener("keydown", detectHelpKey);
  router.push("/auth/")

  Api.health().then(() => {
    ready.value = true;
    serverOffline.value = false;

  }).catch(() => {
    ready.value = false;
    serverOffline.value = true;
  })
})

const accountMenu:ContextMenuOptions = [
  {id:"about",txt:"About",ico:"info-circle"},
  {id:"shortcuts",txt:"Shortcuts (Ctrl+K)",ico:"command"},
  {id:"logout",txt:"Logout",ico:"door-closed"},
]

function accountMenuHandler(id:string) {
  if (id == "logout") {
    simpleModal.value?.confirm("Logout?","Really Logout?").then(d => {
      if (d) {
        global.clearOpenNote();
        auth.logout();
      }
    })
  } else if (id == "about") {
    aboutModal.value?.open()
  } else if (id == "shortcuts") {
    shortcutsModal.value?.open()
  }
}


function detectHelpKey(e:KeyboardEvent) {
  if (showSide.value) {
    if (e.key == "H" && e.ctrlKey && e.shiftKey) {
      e.preventDefault()
      shortcutsModal.value?.open()
    }
  }
}

function reload() {
  window.location.reload();
}

</script>

<template>
  <div v-if="serverOffline" class="w-full h-svh flex flex-col justify-center items-center">

    <i class="bi bi-exclamation-triangle-fill text-5xl text-primary mb-5"></i>
    <span class="text-2xl font-bold">Server Offline</span>
    <span >Please check back later.</span>
    <button class="btn btn-xs mt-2" @click="reload()">Reload</button>
  </div>
  <div v-else-if="ready" class="w-full h-svh">
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
          <button @click="ctxMn?.open(accountMenu,accountMenuHandler,$event.currentTarget)" role="button" class="btn btn-square m-1"><i class="bi bi-three-dots-vertical"></i></button>

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
  
  
  <AboutModal ref="about-modal"></AboutModal>
  <Shortcuts ref="shortcuts-modal"/>
  <ChangelogCheck></ChangelogCheck>
  <SimpleModal ref="simple-modal"/>
  <ContextMenu ref="ctxMn"/>


  <div id="modals"></div>
</template>

<style scoped></style>
