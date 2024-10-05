<script setup>
import { ref, inject } from 'vue';
import DarkModeSwitcher from './darkModeSwitcher.vue';

const boardState = ref('')

const fetchThreads = inject('fetchThreads')

const a = (b) => {
  localStorage.setItem('boardState', b)
  localStorage.setItem('threadState', '')
  boardState.value = localStorage.getItem('boardState')
  fetchThreads()
}

</script>

<template>
<header class="flex justify-between border-b border-slate-100 p-2 dark:border-twitch">
  <div class="flex items-center gap-4">
    <div class="">
      <h2 @click="a('Asylum')"  class="text-xl font-bold hover:text-white p-1 hover:bg-black cursor-pointer dark:text-white dark:hover:text-twitch">tdoh lab.</h2>
      <p class="text-slate-300 ml-1 mb-1">board</p> 
      
      <DarkModeSwitcher />

    </div>
    <div class="ml-10 flex gap-2 dark:text-white">
      <p @click="a('Asylum')"  class="hover:text-white p-1 hover:bg-black cursor-pointer dark:hover:bg-white dark:hover:text-black">[Asylum]</p>
      <p @click="a('b')"  class="hover:text-white p-1 hover:bg-black cursor-pointer dark:hover:bg-white dark:hover:text-black">[b]</p>
      <p @click="a('dev')"  class="hover:text-white p-1 hover:bg-black cursor-pointer dark:hover:bg-white dark:hover:text-black">[dev]</p>
    </div>
  </div>
  <div class="font-mono font-bold mt-6 dark:text-white"><h1>{{ boardState }}</h1></div>
</header>
</template>