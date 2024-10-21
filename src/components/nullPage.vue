<script setup>

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="flex flex-wrap justify-center pt-28 select-none">
    <img class="w-64 h-64 object-cover rounded-2xl" src="../assets/1332.jpg" alt="" />
  </div>

  <div class="flex flex-wrap justify-center select-none">
    <div class="text-justify max-w-xl px-4 pt-14 text-zinc-600 text-xs">
      <p>
        Шримпач - это борда от хики для хики, без политики, без социоблядства, без вниманиеблдяства
        мочухов в экспроприированных ими разделах. Если вы, как и я, устали от получения бана за
        неправильное мнение, неправильный скриншот игрового персонажа, неугодную форму выражения
        мыслей, можете попробовать построить общение на этой борде. Словом, всё, что связано с
        властно-подчиненными отношениями не может и не должно исходить из межличностных. Однако не
        стоит забывать о нормах приличия и действующем законодательстве Российской Федерации.
      </p>
    </div>
  </div>

  <div
    class="overflow-hidden flex-col text-zinc-600 text-xs bg-white dark:bg-black select-none pt-8 pb-4"
  >
    <div @click="scrollToTop" class="flex flex-wrap gap-4 justify-center pb-2">
      <div class="flex flex-col">
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
      </div>

      <div class="flex flex-col">
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
      </div>

      <div class="flex flex-col">
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
      </div>

      <div class="flex flex-col">
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
      </div>

      <div class="flex flex-col">
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
  </div>
</template>
