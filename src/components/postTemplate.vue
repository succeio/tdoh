<script setup>
import { computed, ref, inject, onMounted, onBeforeUnmount } from 'vue'
import { VueShowdown } from 'vue-showdown'

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
    console.warn(`Элемент с id ${postId} не найден.`)
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
</script>

<template>
  <div
    :id="postId"
    class="max-w-fit mt-2 bg-zinc-200 dark:text-white p-2 rounded-2xl dark:bg-zinc-900"
    :class="{
      'w-2/3': props.text.length > 150,
      'ml-2': props.id !== 0,
      'border-twitch border-l-2 dark:border-twitch dark:border-l-2': props.id === 0
    }"
  >
    <div id="postData" class="flex gap-2">
      <p id="post-theme" class="font-sans font-bold">{{ theme }}</p>
      <p
        id="post-name"
        :class="{
          'text-twitch': props.password === '73fd4da4',
          'font-bold': props.password === '73fd4da4'
        }"
      >
        {{ props.password === '73fd4da4' ? '' : name }}
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
      <p class="hover:text-twitch cursor-pointer text-green-600">{{ id === 0 ? '0P' : id }}</p>
      <p v-if="id === 0" @click="openThread(threadId)" class="hover:cursor-pointer">
        <img
          src="../assets/right-circle.svg"
          alt="Icon"
          class="h-4 w-4 mr-2 mt-1.5 dark:rounded-2xl dark:bg-twitch"
        />
      </p>
      <p
        v-if="props.opcountposts"
        @click="openThread(theme, board)"
        class="hover:text-twitch cursor-pointer"
      >
        posts: {{ opcountposts }}
      </p>
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

      <!-- whitespace-pre-line; inline; Отображение текста с обработанными ссылками -->
      <div id="postCore" class="">
        <p class="ml-2 pt-2 whitespace-normal break-words">
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

    <div class="flex gap-2 ml-4 mt-2">
      <div class="" v-for="reply in props.replies" :key="reply.id">
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

    <!-- Tooltip для отображения поста -->
    <div
      v-if="hoverPost"
      :style="{ top: tooltipPosition.top + 'px', left: tooltipPosition.left + 'px' }"
      class="fixed bg-black dark:bg-twitch text-white p-2 rounded-2xl shadow-lg max-w-md"
    >
      <!-- Верхняя часть тултипа с информацией о посте -->
      <div class="flex flex-wrap gap-1">
        <p>{{ hoverPost.theme }}</p>
        <p>{{ hoverPost.name }}</p>
        <p>{{ hoverPost.passcode }}</p>
        <p>{{ hoverPost.time }}</p>
        <p>{{ hoverPost.data }}</p>
        <p>#{{ hoverPost.postId.slice(12, 20) }}</p>
      </div>

      <!-- Текст содержимого поста -->
      <div>
        <p class="pl-4 pt-2 pb-2">{{ hoverPost.text }}</p>
      </div>
    </div>
  </div>
</template>
