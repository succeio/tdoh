<script setup>
import { computed, ref, inject } from 'vue'

const fetchPosts = inject('fetchPosts')
const getPostId = inject('getPostId')

const props = defineProps({
  id: Number,
  theme: String,
  time: String,
  data: String,
  name: String,
  url: String,
  text: String,
  password: String,
  day: String,
  threadId: String,
  postId: String,
  replies: Array
})


const openThread = (thread) => {
  localStorage.setItem('threadState', thread)
  fetchPosts()
}



// Проверка, является ли ссылка изображением
const isImage = computed(() => {
  return /\.(jpeg|jpg|gif|png)$/i.test(props.url)
})

// Проверка, является ли ссылка видео
const isVideo = computed(() => {
  return /\.(mp4|webm|ogg)$/i.test(props.url)
})

// Проверка, содержит ли строка twitch.tv
const isTwitch = computed(() => {
  return props.url ? props.url.includes('twitch.tv') : false
})

const link = ref('')
link.value = props.url.match(/twitch\.tv\/([^/]+)/) ? props.url.match(/twitch\.tv\/([^/]+)/) : ''

const passwordMap = ref([
  { password: '73fd4da4', value: '🍇🌚🍤coyc' },
]);

  // Проверка на совпадение пароля
  const isPasswordMatched = computed(() => {
    return passwordMap.value.some(item => item.password === props.password);
  });

  // Получение значения в зависимости от пароля
  const displayValue = computed(() => {
    const matchedItem = passwordMap.value.find(item => item.password === props.password);
    return matchedItem ? matchedItem.value : '!' + props.password;
  });

//<p v-if="props.password" :class="{'text-twitch': isPasswordMatched, 'font-bold': isPasswordMatched}">🍇{{ displayValue }}</p>
//<p v-if="props.password" class="text-twitch">🍇{{ props.password === '73fd4da4' ? '🍇🌚🍤coyc' : password }}</p>

// Прокрутка к элементу с соответствующим id
const scrollToElement = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Функция для разбора текста и выделения ссылок
const splitTextWithLinks = computed(() => {
  if (!props.text) return [];

  const parts = props.text.split(/(#[A-Za-z0-9_-]+)/g); // Разделяем текст по шаблону #ID
  return parts.map(part => {
    if (part.startsWith('#')) {
      const id = part.substring(1); // Удаляем символ #
      
      return { isLink: true, text: part, id };
    } else {
      return { isLink: false, text: part };
    }
  });
});

const repl = (id) => {
  setTimeout(() => {
    const element = document.getElementById(id)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    } else {
      console.warn(`Element with id "${id}" not found.`)
    }
  }, 100)
}

</script>

<template>
  <div
    :id="postId"
    class="max-w-fit mt-2 bg-slate-300 dark:text-white p-2 rounded-2xl dark:bg-zinc-900"
    :class="{'ml-2': props.id !== 0, 'border-twitch border-l-2 dark:border-twitch dark:border-l-2': props.id === 0}"
  >
    <div class="flex gap-2">
      <p class="font-mono font-bold">{{ theme }}</p>
      <p :class="{'text-twitch': props.password === '73fd4da4', 'font-bold': props.password === '73fd4da4'}">{{ props.password === '73fd4da4' ? '' : name }}</p>
      <p v-if="props.password" :class="{'text-twitch': isPasswordMatched, 'font-bold': isPasswordMatched}">{{ displayValue }}</p>
      <p>{{ time }}</p>
      <p v-if="props.day" >{{ day }}</p>
      <p>{{ data }}</p>
      <p @click="getPostId(postId)"  class="hover:text-twitch cursor-pointer"> #{{ postId ? postId.slice(12,20) : postId }} </p>
      <p  class="hover:text-twitch cursor-pointer"> 🍌{{ id === 0 ? '0P' : id }}</p>
      <p v-if="id === 0" @click="openThread(threadId)" class="hover:cursor-pointer">🍆</p>
      <p v-if="props.opcountposts" @click="openThread(theme, board)" class="hover:text-twitch cursor-pointer">posts: {{ opcountposts }}</p>
    </div>

    <div class="gap-2 flex">
      <div class="gap-2 mt-2">
        <img
          v-if="isImage"
          class="hover:transition duration-150 max-w-48 hover:max-w-md bg-white rounded-2xl cursor-pointer"
          :src="url"
          alt="post-pic"
        />
        <video
          v-if="isVideo"
          class="hover:transition duration-150 max-w-72 hover:max-w-md bg-white rounded-2xl cursor-pointer"
          :src="url"
          controls
        ></video>
        <iframe
          v-if="isTwitch"
          class="rounded-2xl"
          :src="`https://player.twitch.tv/?channel=${link[1]}&parent=localhost&autoplay=false`"
          frameborder="0"
          allowfullscreen="true"
          scrolling="no"
          height="240"
          width="426"
        ></iframe>
        <div class="max-w-fit p-1 mt-2 font-bold bg-twitch text-white rounded-2xl" v-if="isTwitch">
          <p>{{ url }}</p>
        </div>
      </div>
        
            <!-- Отображение текста с обработанными ссылками -->
      <p class="text-justify ml-2 whitespace-normal">
        <span v-for="(part, index) in splitTextWithLinks" :key="index">
          <span v-if="part.isLink" @click="scrollToElement(part.id)" class="text-twitch hover:underline cursor-pointer">{{ '#' + part.text.slice(13,21) }}</span>
          <span v-else>{{ part.text }}</span>
        </span>
      </p>



      </div>

         <div class="flex gap-2 ml-4 mt-2">
      <div class="" v-for="reply in props.replies" :key="reply.id">
        <p class="cursor-pointer hover:text-twitch" @click="repl(reply)">#{{ reply ? reply.slice(13,20) : '' }}</p>
      </div>
    </div>

  </div>
</template>
