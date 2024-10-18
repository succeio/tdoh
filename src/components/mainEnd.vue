<script setup>

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <div class="overflow-hidden justify-center text-zinc-600 text-xs bg-white dark:bg-black select-none border-t dark:border-zinc-900 pt-2 pb-4">
    
    <!-- Список досок с адаптацией под маленькие экраны -->
    <div @click="scrollToTop" class="flex flex-wrap gap-2 justify-center pt-2 pb-2 overflow-x-auto">

<!-- Список досок с адаптацией под маленькие экраны -->
<div @click="scrollToTop" class="flex flex-wrap gap-2 justify-center pt-2 pb-2 px-6 overflow-x-auto">
  <router-link 
    :to="`/Anime`" 
    class="hover:!text-twitch !no-underline hover:!no-underline !text-xs !text-zinc-600 dark:hover:!text-twitch cursor-pointer select-none"
  >
    Аниме
  </router-link>
  <router-link 
    :to="`/Asylum`" 
    class="hover:!text-twitch !no-underline hover:!no-underline !text-xs !text-zinc-600 dark:hover:!text-twitch cursor-pointer select-none"
  >
    Asylum
  </router-link>
  <router-link 
    :to="`/b`" 
    class="hover:!text-twitch !no-underline hover:!no-underline !text-xs !text-zinc-600 dark:hover:!text-twitch cursor-pointer select-none"
  >
    Бред
  </router-link>
  <router-link 
    :to="`/vg`" 
    class="hover:!text-twitch !no-underline hover:!no-underline !text-xs !text-zinc-600 dark:hover:!text-twitch cursor-pointer select-none"
  >
    Видеоигры
  </router-link>
  <router-link 
    :to="`/vn`" 
    class="hover:!text-twitch !no-underline hover:!no-underline !text-xs !text-zinc-600 dark:hover:!text-twitch cursor-pointer select-none"
  >
    Визуальные новеллы
  </router-link>
  <router-link 
    :to="`/gd`" 
    class="hover:!text-twitch !no-underline hover:!no-underline !text-xs !text-zinc-600 dark:hover:!text-twitch cursor-pointer select-none"
  >
    Gamedev
  </router-link>
  <router-link 
    :to="`/Art`" 
    class="hover:!text-twitch !no-underline hover:!no-underline !text-xs !text-zinc-600 dark:hover:!text-twitch cursor-pointer select-none"
  >
    Искусство
  </router-link>
  <router-link 
    :to="`/cg`" 
    class="hover:!text-twitch !no-underline hover:!no-underline !text-xs !text-zinc-600 dark:hover:!text-twitch cursor-pointer select-none"
  >
    Консоли
  </router-link>
  <router-link 
    :to="`/Manga`" 
    class="hover:!text-twitch !no-underline hover:!no-underline !text-xs !text-zinc-600 dark:hover:!text-twitch cursor-pointer select-none"
  >
    Манга
  </router-link>
  <router-link 
    :to="`/md`" 
    class="hover:!text-twitch !no-underline hover:!no-underline !text-xs !text-zinc-600 dark:hover:!text-twitch cursor-pointer select-none"
  >
    Мобильные устройства
  </router-link>
  <router-link 
    :to="`/bg`" 
    class="hover:!text-twitch !no-underline hover:!no-underline !text-xs !text-zinc-600 dark:hover:!text-twitch cursor-pointer select-none"
  >
    Настольные игры
  </router-link>
  <router-link 
    :to="`/Paranormal`" 
    class="hover:!text-twitch !no-underline hover:!no-underline !text-xs !text-zinc-600 dark:hover:!text-twitch cursor-pointer select-none"
  >
    Паранормальное
  </router-link>
  <router-link 
    :to="`/pr`" 
    class="hover:!text-twitch !no-underline hover:!no-underline !text-xs !text-zinc-600 dark:hover:!text-twitch cursor-pointer select-none"
  >
    Программирование
  </router-link>
  <router-link 
    :to="`/dev`" 
    class="hover:!text-twitch !no-underline hover:!no-underline !text-xs !text-zinc-600 dark:hover:!text-twitch cursor-pointer select-none"
  >
    Разработка борды
  </router-link>
  <router-link 
    :to="`/tech`" 
    class="hover:!text-twitch !no-underline hover:!no-underline !text-xs !text-zinc-600 dark:hover:!text-twitch cursor-pointer select-none"
  >
    Техника
  </router-link>
</div>

      

    </div>

    <!-- Текстовая информация с центровкой для маленьких экранов -->
    <div class="pt-1 text-center px-4 sm:px-0">
      <p>Все права и копирайты на этой странице принадлежат правообладателям. 
         За любую размещенную информацию несет личную ответственность постер (лицо, загрузившее эту информацию). 
         Все комментарии принадлежат лицам, отправившим их.</p>
      <p>Если вы обнаружили информацию, размещённую против правил, пожалуйста, сообщите нам об этом.</p>
      <p class="pt-2">tdoh. 2024.</p>
    </div>
  </div>
</template>