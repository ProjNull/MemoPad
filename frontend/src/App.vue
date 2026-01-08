<script setup lang="ts">

import Api from '@/api';
import { useAuthStore } from './stores/auth';
import { onMounted, provide, ref, useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import FileTree from './components/FileTree/index.vue';
import Toasts from './components/Toasts.vue';
import SideBar from './components/SideBar.vue';
import multiavatar from '@multiavatar/multiavatar/esm'
import ChangelogCheck from './components/ChangelogCheck.vue';

const auth = useAuthStore();
const router = useRouter();

const showSide = ref(false);


watch(auth.$state, ({token,user}) => {
  if (!token || !user) {
    router.push("/auth/")
  } else {
    router.push("/")
  }
}, {immediate: true, deep: true});


watch(router.currentRoute, (nv) => {

  showSide.value = !nv.path.startsWith("/auth")
  
})


const notifications = ref<(NotificationDefinition & { id: number })[]>([]);


function addNotification(d: NotificationDefinition) {
  const id = Date.now();
  notifications.value.push({
    id: id,
    msg: d.msg,
    type: d.type
  })

  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id != id)
  }, 4000)
}

provide("notifications", {
  add: addNotification
})



</script>

<template>
  <div class="w-full h-screen">
    <SideBar v-if="showSide">
      <template v-slot:sidebar>
        <div class="flex items-center">
          <h1 class="font-bold grow">Memopad</h1>
          <button class="btn btn-square md:hidden">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="grow">
          <FileTree></FileTree>
        </div>
        <div class="flex gap-2 items-center">
          <div class="grow flex gap-2 items-center">

            <div class="w-8 h-8" :innerHTML="multiavatar(auth.getName())"></div>
            <span>{{ auth.getName() }}</span>
 
          </div>
          <div class="dropdown dropdown-top dropdown-end">
            <div tabindex="0" role="button" class="btn btn-square m-1"><i class="bi bi-three-dots-vertical"></i></div>
            <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-42 p-2 shadow-sm">
              <li><a @click="auth.logout()">Logout</a></li>
            </ul>
          </div>
        </div>
      </template>
      <RouterView></RouterView>
    </SideBar>
    <RouterView v-else></RouterView>

  </div>

  <Toasts v-model="notifications"></Toasts>
  <ChangelogCheck></ChangelogCheck>
</template>

<style scoped></style>
