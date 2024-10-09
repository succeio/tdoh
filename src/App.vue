<script setup>
import { ref, provide, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { database } from './firebase'
import { ref as dbRef, onValue, limitToFirst, query, get, orderByChild } from 'firebase/database'

import PostListTemplate from './components/postListTemplate.vue'
import PostTemplate from './components/postTemplate.vue'

import SendData from './components/sendData.vue'
import LineHeader from './components/lineHeader.vue'
import MainEnd from './components/mainEnd.vue';
import MiniHeader from './components/miniHeader.vue';

const posts = ref([])
const threads = ref([])
const threadState = ref('')
const boardState = ref('')
const postId = ref('')

const themeState = ref('')

//---------- router
const route = useRoute();
const router = useRouter();
//----------- router

// const zPage = () => {
//   posts.value = []
//   threads.value = []
//   threadState.value = ''
//   boardState.value = ''
// }

// Функция для полной загрузки данных onValue
const fetchPosts = () => {
  threadState.value = localStorage.getItem('threadState') ? localStorage.getItem('threadState') : ''
  boardState.value = localStorage.getItem('boardState')
    ? localStorage.getItem('boardState')
    : '-O8H6aNDuf1NlK9k2Gz6'

  router.push({ path: `/${boardState.value}/${threadState.value}` })

  const postsRef = dbRef(database, `${boardState.value}/${threadState.value}/`)

  onValue(postsRef, (snapshot) => {
    const data = snapshot.val()
    
    if (data) {
      // Если есть данные, извлекаем посты
      posts.value = Object.values(data) // Преобразуем объект постов в массив
      localStorage.setItem('theme', posts.value[0].theme)
      themeState.value = posts.value[0].theme //localStorage.getItem('theme')
      threads.value = []
    } else {
      posts.value = []
    }
  })
}

const fetchThreads = async () => {
  themeState.value = ''
  threadState.value = localStorage.getItem('threadState')
  threads.value = []
  const boardState = ref(localStorage.getItem('boardState'))

  router.push({ path: `/${boardState.value}/${threadState.value}` })

  try {
    const sectionRef = query(
      dbRef(database, boardState.value),
      orderByChild('timestamp'), // Сортировка по timestamp
      limitToFirst(10) // Ограничиваем количество тредов до 10 (можно изменить)
    )

    const snapshot = await get(sectionRef)

    if (snapshot.exists()) {
      const threadsData = snapshot.val()
      const threadEntries = Object.entries(threadsData).reverse() // Обратный порядок (от новых к старым)

      // Используем Promise.all для параллельной загрузки первых 5 постов каждого треда
      const threadPromises = threadEntries.map(async ([threadKey]) => {
        const threadRef = query(
          dbRef(database, `${boardState.value}/${threadKey}/`),
          limitToFirst(5) // Ограничиваем запрос до 5 первых постов
        )

        const threadSnapshot = await get(threadRef)
        const postsData = threadSnapshot.val()

        return {
          threadKey,
          posts: postsData ? Object.values(postsData) : []
        }
      })

      // Выполняем все запросы параллельно и ждем их завершения
      threads.value = await Promise.all(threadPromises)
    }
  } catch (error) {
    console.error('Ошибка при загрузке тредов:', error)
  }

  return threads.value // Возвращаем массив тредов
}

const getPostId = (id) => {
  postId.value = id
}

provide('getPostId', getPostId)
provide('fetchPosts', fetchPosts)
provide('fetchThreads', fetchThreads)

const state = ref(false)

//------------------router

  // Следим за изменениями в URL и обновляем состояния
  // Функция для обновления состояния и вызова нужных функций

const updateStateFromRoute = (board, thread) => {

  if (board) {
    boardState.value = board;
    localStorage.setItem('boardState', boardState.value);
  } else {
    boardState.value = 'Asylum';
    localStorage.setItem('boardState', boardState.value);
  }

  if (thread) {
    threadState.value = thread;
    localStorage.setItem('threadState', threadState.value);
  } else {
    threadState.value = '';
    localStorage.setItem('threadState', threadState.value);
  }

  if (threadState.value) {
    fetchPosts();  // Если указан threadState, загружаем посты
  } else {
    fetchThreads();  // Иначе загружаем темы
  }
};
    
watch(() => route.fullPath, () => {updateStateFromRoute(route.params.board, route.params.thread)})


</script>

<template>
  <MiniHeader />
  <div class="min-h-screen dark:bg-twitch bg-black">
    <LineHeader :themeState="themeState" :boardState="boardState" />
    <div class="min-h-screen bg-white dark:bg-black rounded-t-2xl">
      <div class="pt-4">
        <button
          v-if="!threadState"
          @click="
            () => {
              state = !state
            }
          "
          class="dark:bg-twitch ml-4 bg-black text-white rounded-2xl p-1 min-w-32"
        >
          {{ 'Создать тред' }}
        </button>
      </div>

      <div class="max-w-4xl">
        <SendData v-if="!state && !threadState" :reply-id="postId" />
      </div>

      <div class="ml-4">
        <PostListTemplate v-if="threadState" :posts="posts" />

        <div v-auto-animate>
          <div v-if="threads.length">
            <div v-for="(thread, threadIndex) in threads" :key="threadIndex">
              <div class="pt-4" v-if="thread.posts.length">
                <PostTemplate
                  v-for="(post, postIndex) in thread.posts"
                  :key="postIndex"
                  :name="post.name"
                  :data="post.data"
                  :time="post.time"
                  :id="postIndex"
                  :postId="post.postId"
                  :threadId="post.threadId"
                  :url="post.url"
                  :text="post.text"
                  :theme="post.theme"
                  :password="post.password"
                  :day="post.day"
                  :replies="posts.replies"
                />
              </div>
            </div>
          </div>
        </div>

        <SendData class="max-w-4xl" v-if="threadState" :reply-id="postId" />
      </div>
    </div>
    
  </div>
  <MainEnd class="" />
</template>
