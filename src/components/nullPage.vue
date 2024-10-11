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

<div class="flex flex-wrap justify-center pt-28 select-none" > 
  <img class="w-64 h-64 object-cover rounded-2xl" src="../assets/1332.jpg" alt="">
</div>

<div class="flex flex-wrap justify-center select-none">
  <div class="text-justify max-w-xl px-4 pt-14 text-zinc-600 text-xs">
    <p>
      Шримпач - это борда от хики для хики, без политики, без социоблядства, без вниманиеблдяства мочухов в экспроприированных ими разделах.
      Если вы, как и я, устали от получения бана за неправильное мнение, неправильный скриншот игрового персонажа, неугодную форму выражения мыслей, можете попробовать построить общение на этой борде.
      Словом, всё, что связанно с властно-подчиненными отношениями не может и не должно исходить из межличностных.
      Однако не стоит забывать о нормах приличия и действующем законодательстве Российской Федерации.
    </p>
  </div>
</div>



 <div class="overflow-hidden flex-col text-zinc-600 text-xs bg-white dark:bg-black select-none pt-8 pb-4">
    <div @click="scrollToTop" class="flex flex-wrap gap-4 justify-center pb-2">
        <div class="flex flex-col">
            <div @click="a('Anime')" class="hover:text-twitch cursor-pointer">Аниме</div>
            <div @click="a('Asylum')" class="hover:text-twitch cursor-pointer">Asylum</div>
            <div @click="a('b')" class="hover:text-twitch cursor-pointer">Бред</div>
        </div>
        <div class="flex flex-col">
            <div @click="a('Videogames')" class="hover:text-twitch cursor-pointer">Видеоигры</div>
            <div @click="a('VisualNovels')" class="hover:text-twitch cursor-pointer">Визуальные новеллы</div>
            <div @click="a('Gamedev')" class="hover:text-twitch cursor-pointer">Gamedev</div> 
        </div>
        <div class="flex flex-col">
            <div @click="a('Art')" class="hover:text-twitch cursor-pointer">Искусство</div>
            <div @click="a('Consoles')" class="hover:text-twitch cursor-pointer">Консоли</div>
            <div @click="a('Manga')" class="hover:text-twitch cursor-pointer">Манга</div>
        </div>
        <div class="flex flex-col">
            <div @click="a('MobileDevices')" class="hover:text-twitch cursor-pointer">Мобильные устройства</div>
            <div @click="a('BoardGames')" class="hover:text-twitch cursor-pointer">Настольные игры</div>
            <div @click="a('Paranormal')" class="hover:text-twitch cursor-pointer">Паранормальное</div>
        </div>
        <div class="flex flex-col">
            <div @click="a('Programming')" class="hover:text-twitch cursor-pointer">Программирование</div>
            <div @click="a('dev')" class="hover:text-twitch cursor-pointer">Разработка борды</div>
            <div @click="a('Technology')" class="hover:text-twitch cursor-pointer">Техника</div>
        </div>
    </div>

  </div>

</template>