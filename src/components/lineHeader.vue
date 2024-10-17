<script setup>
import { inject } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import DarkModeSwitcher from './darkModeSwitcher.vue'

const startPage = inject('startPage')

const route = useRoute();
useRouter();

defineProps({
  themeState: String
})

</script>

<template>
  <div
    class="bg-black dark:bg-twitch h-8 rounded-b-2xl text-white font-bold pt-1 pl-6 flex justify-between"
  >
    <!-- Левая часть: логотип и текущая доска/тема -->
    <div class="flex gap-10">
      <div @click="startPage" class="cursor-pointer select-none">🍤 shrmpch</div>
      <router-link 
        :to="`/${route.params.board}`" 
        class="hover:text-white no-underline hover:no-underline text-white cursor-pointer select-none "
      >
        {{ route.params.board }} 👻
      </router-link>

      <div class="hidden sm:block select-none">{{ themeState }} </div> <!-- Скрыто на мобильных -->
    </div>

    <!-- Правая часть: ссылки на другие доски и переключатель темы -->
    <div class="gap-4 pr-6 flex">

      <router-link 
        :to="`/Asylum`" 
        class="hover:!text-twitch !no-underline hover:!no-underline !text-white dark:hover:!text-black cursor-pointer select-none hidden lg:block"
      >
        Asylum 
      </router-link>

          <router-link 
        :to="`/b`" 
        class="hover:!text-twitch !no-underline hover:!no-underline !text-white dark:hover:!text-black cursor-pointer select-none hidden lg:block"
      >
        b
      </router-link>

          <router-link 
        :to="`/dev`" 
        class="hover:!text-twitch !no-underline hover:!no-underline !text-white dark:hover:!text-black cursor-pointer select-none hidden lg:block"
      >
        dev
      </router-link>

      <!-- Переключатель темы всегда виден -->
      <DarkModeSwitcher class="pl-8 select-none" />
    </div>
  </div>
</template>