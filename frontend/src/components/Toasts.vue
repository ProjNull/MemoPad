<script setup lang="ts">

defineModel()


</script>
<template>
    <div v-if="modelValue" class="toast">
        <template v-for="noti in modelValue" :key="noti.id">
        <div v-if="noti.type == 'info'" class="alert alert-info">
            <i class="bi bi-info-circle"></i><span>{{ noti.msg }}</span>
        </div>
        <div v-else-if="noti.type == 'error'" class="alert alert-error">
            <i class="bi bi-stop-circle"></i><span>{{ noti.msg }}</span>
        </div>
        <div v-else-if="noti.type == 'success'" class="alert alert-success">
            <i class="bi bi-check-circle"></i><span>{{ noti.msg }}</span>
        </div>
        <div v-else-if="noti.type == 'warn'" class="alert alert-warning">
            <i class="bi bi-exclamation-circle"></i><span>{{ noti.msg }}</span>
        </div>
        </template>
    </div>
</template>