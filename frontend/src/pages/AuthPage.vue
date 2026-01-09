<script setup lang="ts">

import Api from '@/api';
import { useAuthStore } from '@/stores/auth';
import type { AxiosError, AxiosResponse } from 'axios';
import { inject, onMounted, ref } from 'vue';
const auth = useAuthStore();
const noti = inject<NotificationProvider>("notifications");

const minlength = 4;

const isLogin = ref(true);
const isAfterLogin = ref(false);


const processing = ref(false);
const username = ref("");
const password = ref("");
const repassword = ref("");

function doAuth() {


    var action:Promise<AxiosResponse<API.UserToken, any, {}>> | null = null;
    if (isLogin.value) {
        action = Api.auth.login({
            username: username.value,
            password: password.value
        })
    } else {
        if (password.value != repassword.value) {
            noti?.add("Passwords not match!","warn")
            return
        }
        action = Api.auth.register({
            username: username.value,
            password: password.value
        })
    }
    
    if (!action) return;
    processing.value = true;
    

    
    action.then((res) =>{
        if (res.status == 200) {
            auth.setToken(res.data.token);    
            getUserInfo();
        }
    }).catch((error:AxiosError) => {
        console.log("ERR", error);
        var msg = "Failed to login"
        if (error.response) {
            msg = error.response?.statusText
        }
        noti?.add(msg,"error")
    }).finally(() => {
        processing.value = false;
        password.value = "";
    })
}

function getUserInfo() {
    isAfterLogin.value = true;
    Api.auth.getUserInfo().then((req) =>{
        if (req.status == 200) {
            auth.setUser(req.data);
            noti?.add("Logged in!","success")
        }
    }).catch((error:AxiosError) => {
        console.log("ERR", error);
        noti?.add("Failed to Login","error")
        auth.logout()
    }).finally(() => {
        isAfterLogin.value = false;
    })


    
}

onMounted(() => {
    const token = auth.loadToken();
    if (token) {
        getUserInfo();
    }
})
</script>

<template>
    
    <div class="flex justify-center items-center w-full h-full flex-col gap-6">
        <img src="/assets/icons/color.svg">
        <div v-if="isAfterLogin">
            <div>Login in progress...</div>
            <div class="text-center mt-4">
                <span class="loading loading-spinner"></span>
            </div>
        </div>
        <form v-else-if="isLogin" class="bg-base-200 w-60 rounded-box p-2 flex flex-col gap-2" @submit.prevent="doAuth()">
            <label class="input">
                <i class="bi bi-person"></i>
                <input :disabled="processing" type="text" placeholder="Username" :minlength="minlength" v-model="username">
            </label>
            <label class="input">
                <i class="bi bi-key"></i>
                <input :disabled="processing" type="password" placeholder="Password" :minlength="minlength" v-model="password">
            </label>
            <button  :disabled="processing" class="btn btn-primary">
                <span v-if="processing" class="loading loading-spinner"></span>
                Login
            </button>
        </form>

        <form v-else class="bg-base-200 w-60 rounded-box p-2 flex flex-col gap-2" @submit.prevent="doAuth()">
            <label class="input">
                <i class="bi bi-person"></i>
                <input :disabled="processing" type="text" placeholder="Username" required :minlength="minlength" v-model="username">
            </label>
            <label class="input">
                <i class="bi bi-key"></i>
                <input :disabled="processing" type="password" placeholder="Password" required :minlength="minlength" v-model="password">
            </label>
            <template v-if="password && password.length < minlength">
                <span class="text-warning text-xs ml-2">Password too short! (At least {{ minlength }})</span>
            </template>
            <label class="input">
                <i class="bi bi-key"></i>
                <input :disabled="processing" type="password" placeholder="Confirm Password" required :minlength="minlength" v-model="repassword">
            </label>
            
            <template v-if="password.length >= minlength && repassword && password != repassword">
                <span class="text-warning text-xs ml-2">Passwords don't match!</span>
            </template>
            <button  :disabled="processing" class="btn btn-primary">
                <span v-if="processing" class="loading loading-spinner"></span>
                Register
            </button>
        </form>
        <div v-if="!isAfterLogin" class="text-sm flex items-center gap-2">
            <span>
                {{ isLogin ? "Don't have an account?" : "Have account?"}}
            </span>
            <button class="btn btn-sm btn-ghost px-2" @click="isLogin = !isLogin">
                {{ isLogin ? "Register." : "Login."}}
            </button>
        </div>
    </div>
    <div class="fixed bottom-6 left-0 w-screen flex justify-center">
        <a href="https://projnull.eu" target="_blank">
            <img class="h-5" src="/assets/null.png">
        </a>
    </div>
</template>