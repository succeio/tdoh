<script setup>
import { ref, provide, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { database } from './firebase'
import { ref as dbRef, onValue, query, get, orderByChild, limitToLast } from 'firebase/database'

import PostListTemplate from './components/postListTemplate.vue'
import PostTemplate from './components/postTemplate.vue'

import SendData from './components/sendData.vue'
import LineHeader from './components/lineHeader.vue'
import MainEnd from './components/mainEnd.vue';
import MiniHeader from './components/miniHeader.vue';
import NullPage from './components/nullPage.vue';

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

const startPage = () => {
  posts.value = []
  threads.value = []
  threadState.value = ''
  boardState.value = ''
  themeState.value = ''
  localStorage.setItem('boardState', '')
  localStorage.setItem('threadState', '')
  router.push({ path: `/` })
  document.title = `🍤 shrmpch`

}

// Функция для полной загрузки данных onValue
const fetchPosts = () => {
  threadState.value = localStorage.getItem('threadState') ? localStorage.getItem('threadState') : ''
  boardState.value = localStorage.getItem('boardState')
    ? localStorage.getItem('boardState')
    : '-O8H6aNDuf1NlK9k2Gz6'

  router.push({ path: `/${boardState.value}/${threadState.value}` })

  const postsRef = dbRef(database, `${boardState.value}/${threadState.value}/posts`)

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

// const fetchThreads = async () => {
//   themeState.value = ''
//   threadState.value = localStorage.getItem('threadState')
//   threads.value = []
//   const boardState = ref(localStorage.getItem('boardState'))

//   router.push({ path: `/${boardState.value}/${threadState.value}` })

//   try {
//     const sectionRef = query(
//       dbRef(database, boardState.value),
//       orderByChild('timestamp'), // Сортировка по timestamp
//       limitToFirst(20) // Ограничиваем количество тредов до 20 (можно изменить)
//     )

//     const snapshot = await get(sectionRef)

//     if (snapshot.exists()) {
//       const threadsData = snapshot.val()
//       const threadEntries = Object.entries(threadsData).reverse() // Обратный порядок (от новых к старым)

//       // Используем Promise.all для параллельной загрузки первых 5 постов каждого треда
//       const threadPromises = threadEntries.map(async ([threadKey]) => {
//         const threadRef = query(
//           dbRef(database, `${boardState.value}/${threadKey}/`),
//           limitToFirst(5) // Ограничиваем запрос до 5 первых постов
//         )

//         const threadSnapshot = await get(threadRef)
//         const postsData = threadSnapshot.val()

//         return {
//           threadKey,
//           posts: postsData ? Object.values(postsData) : []
//         }
//       })

//       // Выполняем все запросы параллельно и ждем их завершения
//       threads.value = await Promise.all(threadPromises)
//     }
//   } catch (error) {
//     console.error('Ошибка при загрузке тредов:', error)
//   }

//   return threads.value // Возвращаем массив тредов
// }


const fetchThreads = async () => {
  themeState.value = ''
  threadState.value = localStorage.getItem('threadState')
  threads.value = []
  boardState.value = localStorage.getItem('boardState')
//  const boardState = ref(localStorage.getItem('boardState'))

  // Переход на нужный роут
  router.push({ path: `/${boardState.value}/${threadState.value}` })

  document.title = `🍤 ${boardState.value}`

  try {
    // Запрос тредов с сортировкой по lastPostTimestamp и ограничением на 20 последних тредов
    const sectionRef = query(
      dbRef(database, boardState.value),
      orderByChild('lastPostTimestamp'),
      limitToLast(10)
    )

    const snapshot = await get(sectionRef)

    if (snapshot.exists()) {
      const threadsData = snapshot.val()

      // Используем Promise.all для параллельной загрузки данных
      const threadPromises = Object.entries(threadsData).map(async ([threadKey, threadValue]) => {
        const opPost = threadValue.op; // Получаем данные "op" поста
        let posts = threadValue.posts ? Object.values(threadValue.posts) : []

        // Ограничиваем количество постов до последних 5 (без оп-поста)
        posts = posts.slice(-5).filter(post => post.postId !== opPost.postId)

        return {
          threadKey,
          op: opPost, // "op" пост для отображения
          posts, // Последние посты без дублирования "op"
          lastPostTimestamp: threadValue.lastPostTimestamp // Добавляем lastPostTimestamp для сортировки
        }
      })

      // Выполняем все запросы параллельно и ждем их завершения
      const loadedThreads = await Promise.all(threadPromises)

      // Убедимся, что треды отсортированы по lastPostTimestamp (от новых к старым)
      threads.value = loadedThreads.sort((a, b) => b.lastPostTimestamp - a.lastPostTimestamp)
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
provide('startPage', startPage)

const state = ref(!false)

//------------------router

  // Следим за изменениями в URL и обновляем состояния
  // Функция для обновления состояния и вызова нужных функций

const updateStateFromRoute = (board, thread) => {

  if (board) {
    boardState.value = board;
    localStorage.setItem('boardState', boardState.value);
  } else {
    boardState.value = '';
    localStorage.setItem('boardState', boardState.value);
  }

  if (thread) {
    threadState.value = thread;
    localStorage.setItem('threadState', threadState.value);
  } else {
    threadState.value = '';
    localStorage.setItem('threadState', threadState.value);
  }

  if (threadState.value && boardState.value) {
    fetchPosts();  // Если указан threadState, загружаем посты
  } else if (boardState.value) {
    fetchThreads();  // Иначе загружаем темы
  }
};


watch(() => route.fullPath, () => {updateStateFromRoute(route.params.board, route.params.thread)})
watch(themeState, () => {document.title = `🍤 ${boardState.value} ${themeState.value}`;});

const newPostCount = ref(0) // Счетчик новых постов

// Функция для отслеживания изменений в posts
watch(posts, (newPosts, oldPosts) => {
  // Сравниваем количество старых и новых постов
  const oldPostsCount = oldPosts.length
  const newPostsCount = newPosts.length

  // Если добавлены новые посты и вкладка не активна
  if (newPostsCount > oldPostsCount && document.hidden) {
    newPostCount.value += (newPostsCount - oldPostsCount) // Добавляем разницу в постах к счетчику
    document.title = `(${newPostCount.value}) Новые посты` // Обновляем заголовок страницы
  }
}, { deep: true }) // Глубокое отслеживание изменений в массиве постов

// Обнуление счетчика при возврате пользователя на активную вкладку
const handleVisibilityChange = () => {
  if (!document.hidden) {
    newPostCount.value = 0 // Сбрасываем счетчик новых постов
    document.title = boardState.value ? `🍤 ${boardState.value} ${themeState.value}` : `🍤 shrmpch`  // Сбрасываем заголовок
  }
}

// Подписываемся на события изменения видимости вкладки
onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

// Отписываемся от события при уничтожении компонента
onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

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
        <SendData v-if="!state && !threadState && boardState" :reply-id="postId" />
      </div>

      <NullPage v-if="!boardState" />

      <div class="ml-4">
        <PostListTemplate v-if="threadState" :posts="posts" />

        <div v-auto-animate >
<div v-if="threads.length">
  <!-- Сортировка тредов по новизне постов (lastPostTimestamp) -->
  <div
    v-for="(thread, threadIndex) in threads"
    :key="threadIndex"
  >
    <div class="pt-4">
      <!-- Выводим op-пост -->
      <PostTemplate
        :name="thread.op.name"
        :data="thread.op.data"
        :time="thread.op.time"
        :id=0
        :postId="thread.op.postId"
        :threadId="thread.op.threadId"
        :url="thread.op.url"
        :text="thread.op.text"
        :theme="thread.op.theme"
        :password="thread.op.password"
        :day="thread.op.day"
        :replies="thread.op.replies" 
      />

      <!-- Выводим последние 5 постов -->
      <div v-if="thread.posts.length">
        <PostTemplate
          v-for="(post, postIndex) in thread.posts"
          :key="postIndex"
          :name="post.name"
          :data="post.data"
          :time="post.time"
          :id=postIndex+1
          :postId="post.postId"
          :threadId="post.threadId"
          :url="post.url"
          :text="post.text"
          :theme="post.theme"
          :password="post.password"
          :day="post.day"
          :replies="post.replies" 
        />
      </div>
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
