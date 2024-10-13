<script setup>
import { database } from '../firebase'
import { ref as dbRef, update, onValue } from 'firebase/database'
import { computed, ref, inject, onMounted, onBeforeUnmount } from 'vue'
import { VueShowdown } from 'vue-showdown'

const fetchPosts = inject('fetchPosts')
const getPostId = inject('getPostId')

const boardState = ref('')
const prms = ref('')
const keys = ref([])
const root = localStorage.getItem('xf')

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


const del = async (threadId, postId) => {
  boardState.value = localStorage.getItem('boardState')
  prms.value = await hashString(localStorage.getItem('xf'))
  prms.value = await hashString(prms.value)

  const keyRef = dbRef(database, `xf/xx/-O8pvIYAqJwO5UCMrbwv`)

   onValue(keyRef, (snapshot) => {
    const data = snapshot.val()
    keys.value = Object.values(data)
   }) 

  if (keys.value[0] == prms.value){
    const postRef = dbRef(database, `${boardState.value}/${threadId}/posts/${postId}`)
    update(postRef, { text: '*Пост был изъят.*'})
    update(postRef, { url: ''})
    update(postRef, { theme: ''})
    update(postRef, { name: 'Аноним'})
    update(postRef, { password: ''})
    console.log('OK')    
  } else {
    console.log('DENIED')
  }
}

const hashString = async (input) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex.substring(8, 16)
}

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

const isSoundCloud = computed(() => {
  return /api\.soundcloud\.com/i.test(props.url);  
})

const scLink = ref('')
scLink.value = props.url.match(/(api\.soundcloud\.com\/tracks\/\d+)/i) ? props.url.match(/(api\.soundcloud\.com\/tracks\/\d+)/i) : ''

// Проверка, содержит ли строка youtube.com
const isYouTube = computed(() => {
  return props.url ? props.url.includes('youtube.com') : false
})
const ytLink = ref('')
ytLink.value = props.url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/i) ? props.url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/i)[1] : '';


const passwordMap = ref([{ password: '6da027bf', value: '🍇🌚🍤coyc' }])

// Проверка на совпадение пароля
const isPasswordMatched = computed(() => {
  return passwordMap.value.some((item) => item.password === props.password)
})

// Получение значения в зависимости от пароля
const displayValue = computed(() => {
  const matchedItem = passwordMap.value.find((item) => item.password === props.password)
  return matchedItem ? matchedItem.value : '!' + props.password
})

// Прокрутка к элементу с соответствующим id
const scrollToElement = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })

    // Добавляем класс для подсветки
    element.classList.add('glow-purple')

    // Убираем подсветку через 2 секунды
    setTimeout(() => {
      element.classList.remove('glow-purple')
    }, 2000)

  }
}

// Функция для разбора текста и выделения ссылок
const splitTextWithLinks = computed(() => {
  if (!props.text) return []

  const parts = props.text.split(/(#[A-Za-z0-9_-]+)/g) // Разделяем текст по шаблону #ID
  return parts.map((part) => {
    if (part.startsWith('#')) {
      const id = part.substring(1) // Удаляем символ #
      return { isLink: true, text: part, id }
    } else {
      return { isLink: false, text: part }
    }
  })
})

const repl = (id) => {
  setTimeout(() => {
    const element = document.getElementById(id)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })


    // Добавляем класс для подсветки
    element.classList.add('glow-purple')

    // Убираем подсветку через 2 секунды
    setTimeout(() => {
      element.classList.remove('glow-purple')
    }, 2000)


    } else {
      console.warn(`Element with id "${id}" not found.`)
    }
  }, 100)
}

// Для управления позицией всплывающего поста
const hoverPost = ref(null)
const tooltipPosition = ref({ top: 0, left: 0 })

// Обработчик для отображения поста при наведении
const showPostPreview = (event, postId) => {
  const element = document.getElementById(postId) // Ищем элемент по id
  if (element) {
    const postData = element.querySelector('#postData') // Находим элемент с id="postData"
    const postCore = element.querySelector('#postCore')
    if (postData) {
      // Извлекаем данные из элементов внутри postData
      const postTheme = postData.querySelector('#post-theme')?.innerText || ' '
      const postName = postData.querySelector('#post-name')?.innerText || ' '
      const postPasscode = postData.querySelector('#post-passcode')?.innerText || ' '
      const postTime = postData.querySelector('#post-time')?.innerText || ' '
      const postDate = postData.querySelector('#post-date')?.innerText || ' '

      // Извлекаем содержимое всех элементов с data-post-text
      const postTextElements = postCore.querySelectorAll('[data-post-text]')
      const postText =
        Array.from(postTextElements)
          .map((el) => el.innerText.trim()) // Извлекаем и очищаем текст
          .filter((text) => text.length > 0) // Фильтруем пустые тексты
          .join(' ') || '' // Объединяем все тексты в один

      // Сохраняем данные в hoverPost для отображения в тултипе
      hoverPost.value = {
        postId,
        theme: postTheme,
        text: postText,
        name: postName,
        time: postTime,
        data: postDate,
        passcode: postPasscode
      }

      // Устанавливаем позицию тултипа рядом с курсором
      tooltipPosition.value = { top: event.clientY + 10, left: event.clientX + 10 }
    } else {
      console.warn(`Элемент с id "postData" не найден внутри поста с id ${postId}.`)
    }
  } else {
    //console.warn(`Элемент с id ${postId} не найден.`)
  }
}

const hidePostPreview = () => {
  hoverPost.value = null
}

const updateTooltipPosition = (event) => {
  tooltipPosition.value = { top: event.clientY + 10, left: event.clientX + 10 }
}
onBeforeUnmount
// Обновляем позицию тултипа при движении мыши
onMounted(() => {
  window.addEventListener('mousemove', updateTooltipPosition)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', updateTooltipPosition)
})

const isEnlarged = ref(false); // Using the Composition API

const toggleImageSize = () => {
  isEnlarged.value = !isEnlarged.value; // Toggle the state
};

</script>

<template>
  <div
    :id="postId"
    class="max-w-fit w-full sm:w-auto mt-2 bg-zinc-200 dark:text-white p-2 rounded-2xl dark:bg-zinc-900"
    :class="{
      'sm:w-2/3': props.text.length > 150,
      'ml-2': props.id !== 0,
      'border-twitch border-l-2 dark:border-twitch dark:border-l-2': props.id === 0
    }"
  >
    <div id="postData" class="flex flex-wrap gap-2 text-sm sm:text-base">
      <p id="post-theme" class="font-sans font-bold">{{ theme }}</p>
      <p
        id="post-name"
        :class="{
          'text-twitch': props.password === '73fd4da4',
          'font-bold': props.password === '73fd4da4'
        }"
      >
        {{ name }}
      </p>
      <p
        id="post-passcode"
        v-if="props.password"
        :class="{ 'text-twitch': isPasswordMatched, 'font-bold': isPasswordMatched }"
      >
        {{ displayValue }}
      </p>
      <p id="post-time">{{ time }}</p>
      <p v-if="props.day">{{ day }}</p>
      <p id="post-date">{{ data }}</p>
      <p @click="getPostId(postId)" class="hover:text-twitch cursor-pointer">
        #{{ postId ? postId.slice(12, 20) : postId }}
      </p>
      <p class="hover:text-twitch cursor-pointer text-green-600">
        {{ id === 0 ? '0P' : id }}
      </p>
      <p
        v-if="id === 0"
        @keyup.ctrl.left="openThread(threadId)"
        @click="openThread(threadId)"
        class="hover:cursor-pointer"
      >
        <img
          src="../assets/right-circle.svg"
          alt="Icon"
          class="h-4 w-4 mr-2 mt-1.5 dark:rounded-2xl dark:bg-twitch"
        />
      </p>
      <p
        v-show="root"
        @click="del(props.threadId, props.postId)"
        class="font-bold hover:cursor-pointer"
      >
        X
      </p>
      <p
        v-if="props.opcountposts"
        @click="openThread(theme, board)"
        class="hover:text-twitch cursor-pointer"
      >
        posts: {{ opcountposts }}
      </p>
    </div>

    <div class="gap-2 flex flex-col sm:flex-row">
      <div v-show="props.url"  class="gap-2 mt-2">
        <img
          v-if="isImage"
          :class="[
            'transition-all duration-150 bg-white rounded-2xl cursor-pointer',
            isEnlarged ? 'w-80 sm:max-w-2xl' : 'w-48 sm:max-w-xs'
          ]"
          :src="url"
          alt="post-pic"
          @click="toggleImageSize"
        />

        <video
          v-if="isVideo"
          :class="[
            'transition-all duration-150 bg-white rounded-2xl cursor-pointer',
            isEnlarged ? 'w-80 sm:max-w-2xl' : 'w-48 sm:max-w-xs'
          ]"
          :src="url"
          controls
          @click="toggleImageSize"
        ></video>

        <iframe
          class="rounded-2xl w-full"
          v-if="isSoundCloud"
          height="200"
          scrolling="no"
          frameborder="no"
          allow="autoplay"
          :src="`https://w.soundcloud.com/player/?url=https%3A//${scLink[0]}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`"
        ></iframe>

        <iframe
          class="rounded-2xl w-full"
          v-if="isYouTube"
          width="100%"
          height="200"
          :src="`https://www.youtube.com/embed/${ytLink}`"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>

      <!-- Text with processed links -->
      <div id="postCore" class="max-w-prose">
        <p class="ml-2 pt-2 whitespace-normal break-words text-sm sm:text-base">
          <span v-for="(part, index) in splitTextWithLinks" :key="index">
            <span
              v-if="part.isLink"
              @click="scrollToElement(part.id)"
              @mouseover="showPostPreview($event, part.id)"
              @mouseleave="hidePostPreview"
              class="text-twitch hover:underline cursor-pointer"
              >{{ '#' + part.text.slice(13, 21) }}</span
            >

            <div :data-post-text="index" v-else class="whitespace-normal break-words markdown">
              <vue-showdown :markdown="part.text" />
            </div>
          </span>
        </p>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 ml-4 mt-2">
      <div v-for="reply in props.replies" :key="reply.id">
        <p
          class="cursor-pointer hover:text-twitch"
          @click="repl(reply)"
          @mouseover="showPostPreview($event, reply)"
          @mouseleave="hidePostPreview"
        >
          #{{ reply ? reply.slice(13, 20) : '' }}
        </p>
      </div>
    </div>

    <!-- Tooltip for displaying post preview -->
    <div
      v-if="hoverPost"
      :style="{ top: tooltipPosition.top + 'px', left: tooltipPosition.left + 'px' }"
      class="fixed bg-black dark:bg-twitch text-white p-2 rounded-2xl shadow-lg max-w-md"
    >
      <!-- Upper part of the tooltip with post info -->
      <div class="flex flex-wrap gap-1">
        <p>{{ hoverPost.theme }}</p>
        <p>{{ hoverPost.name }}</p>
        <p>{{ hoverPost.passcode }}</p>
        <p>{{ hoverPost.time }}</p>
        <p>{{ hoverPost.data }}</p>
        <p>#{{ hoverPost.postId.slice(12, 20) }}</p>
      </div>

      <!-- Post content text -->
      <div>
        <p class="pl-4 pt-2 pb-2">{{ hoverPost.text }}</p>
      </div>
    </div>
  </div>
</template>