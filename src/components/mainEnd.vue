<script setup>
import { inject } from 'vue';


const fetchThreads = inject('fetchThreads')

const a = (b) => {
  localStorage.setItem('boardState', b)
  localStorage.setItem('threadState', '')
  fetchThreads()
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <div class="overflow-hidden justify-center text-zinc-600 text-xs bg-white dark:bg-black select-none border-t dark:border-zinc-900 pt-4 pb-4">
    
    <div @click="scrollToTop" class="flex gap-2 justify-center pt-2 pb-2">
      <div @click="a('Anime')" class="hover:text-twitch cursor-pointer">Аниме</div>
      <div @click="a('Asylum')" class="hover:text-twitch cursor-pointer">Asylum</div>
      <div @click="a('b')" class="hover:text-twitch cursor-pointer">Бред</div>
      <div @click="a('vg')" class="hover:text-twitch cursor-pointer">Видеоигры</div>
      <div @click="a('vn')" class="hover:text-twitch cursor-pointer">Визуальные новеллы</div>
      <div @click="a('gd')" class="hover:text-twitch cursor-pointer">Gamedev</div> 
      <div @click="a('Art')" class="hover:text-twitch cursor-pointer">Искусство</div>
      <div @click="a('cg')" class="hover:text-twitch cursor-pointer">Консоли</div>
      <div @click="a('Manga')" class="hover:text-twitch cursor-pointer">Манга</div>
      <div @click="a('md')" class="hover:text-twitch cursor-pointer">Мобильные устройства</div>
      <div @click="a('bg')" class="hover:text-twitch cursor-pointer">Настольные игры</div>
      <div @click="a('Paranormal')" class="hover:text-twitch cursor-pointer">Паранормальное</div>
      <div @click="a('pr')" class="hover:text-twitch cursor-pointer">Программирование</div>
      <div @click="a('dev')" class="hover:text-twitch cursor-pointer">Разработка борды</div>
      <div @click="a('tech')" class="hover:text-twitch cursor-pointer">Техника</div>
    </div>

    <div class="pt-1 text-center">
      <p>Все права и копирайты на этой странице принадлежат правообладателям. 
         За любую размещенную информацию несет личную ответственность постер (лицо, загрузившее эту информацию). 
         Все комментарии принадлежат лицам, отправившим их.</p>
         <p>Если вы обнаружили информацию, размещённую против правил, пожалуйста, сообщите нам об этом.</p>
        <p class="pt-2">
          tdoh. 2024.
        </p>
    </div>
  </div>

</template>