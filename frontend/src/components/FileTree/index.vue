<script setup lang="ts">
import Folder from './Folder.vue';

</script>

<template>
    <ul class="menu w-full px-0"> 
        <Folder id="0" name="Test">
            <Folder id="0" name="Test"></Folder>
        </Folder>
    </ul>

</template>