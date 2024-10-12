<script setup>
import { inject } from 'vue'
import DarkModeSwitcher from './darkModeSwitcher.vue'

const startPage = inject('startPage')

defineProps({
  themeState: String,
  boardState: String
})

const fetchThreads = inject('fetchThreads')

const a = (b) => {
  localStorage.setItem('boardState', b)
  localStorage.setItem('threadState', '')
  document.title = `🍤 shrmpch`
  fetchThreads()
}


</script>

<template>
  <div
    class="bg-black dark:bg-twitch h-8 rounded-b-2xl text-white font-bold pt-1 pl-6 flex justify-between"
  >
    <div class="flex gap-10">
      <div @click="startPage" class="cursor-pointer select-none">🍤 shrmpch</div>
      <div @click="a(boardState)"  class="select-none cursor-pointer">{{ boardState }}</div>
      <div class="select-none">{{ themeState }}</div>
    </div>

    <div class="gap-4 pr-6 flex">
      <div
        @click="a('Asylum')"
        class="hover:text-twitch dark:hover:text-black cursor-pointer select-none"
      >
        Asylum
      </div>
      <div
        @click="a('b')"
        class="hover:text-twitch dark:hover:text-black cursor-pointer select-none"
      >
        b
      </div>
      <div
        @click="a('dev')"
        class="hover:text-twitch dark:hover:text-black cursor-pointer select-none"
      >
        dev
      </div>
      <DarkModeSwitcher class="pl-8 select-none" />
    </div>
  </div>
</template>
