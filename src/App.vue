<script setup>
import { ref, provide } from 'vue';
import { database } from './firebase';
import { ref as dbRef, onValue, limitToFirst, query, get } from 'firebase/database';

import PostListTemplate from './components/postListTemplate.vue';
import PostTemplate from './components/postTemplate.vue'

import MainHeader from './components/mainHeader.vue';
import SendData from './components/sendData.vue';

const posts = ref([])
const threadState = ref('')
const boardState = ref('')

// Функция для полной загрузки данных onValue
const fetchPosts = () => {
  threadState.value = localStorage.getItem('threadState') ? localStorage.getItem('threadState') : ''
  boardState.value = localStorage.getItem('boardState') ? localStorage.getItem('boardState') : '-O8H6aNDuf1NlK9k2Gz6'

  const postsRef = dbRef(database, `${boardState.value}/${threadState.value}/`)

  onValue(postsRef, (snapshot) => {
    const data = snapshot.val();  
    if (data) {
  // Если есть данные, извлекаем посты
  posts.value = Object.values(data); // Преобразуем объект постов в массив
    } else {
      posts.value = [];
    }
  });

};


// Путь к разделу с тредами (например, `-O8H6aNDuf1NlK9k2Gz6/`)
// const sectionRef = dbRef(database, boardState.value || '-O8H6aNDuf1NlK9k2Gz6'
// );

// const threads = ref([]); // Массив для хранения тредов и их постов

// Функция для загрузки всех тредов
// const fetchThreads = () => {
//   boardState.value = localStorage.getItem('boardState') 
//   threads.value = []
//   onValue(sectionRef, (snapshot) => {
//     const threadsData = snapshot.val();
//     if (threadsData) {
//       const threadKeys = Object.keys(threadsData); // Получаем ключи всех тредов

//       // Для каждого треда выполняем запрос на получение первых 3 постов
//       threadKeys.forEach((threadKey) => {
//         const threadRef = query(
//           dbRef(database, `${boardState.value}/${threadKey}/`), // Путь к треду
//           limitToFirst(5) // Ограничиваем запрос до 3 первых постов
//         );

//         onValue(threadRef, (threadSnapshot) => {
//           const postsData = threadSnapshot.val();
//           if (postsData) {
//             const posts = Object.values(postsData); // Преобразуем посты в массив
//             threads.value.push({ threadKey, posts }); // Сохраняем тред и его посты
//           } else {
//             threads.value.push({ threadKey, posts: [] }); // Если постов нет, добавляем пустой массив
//           }
//         });
//       });
//     }
//   });
// };

// const threads = ref([]);
// const fetchThreads = async () => {
//   threads.value = []
//   const boardState = ref(localStorage.getItem('boardState'));
//   try {
//     const sectionRef = dbRef(database, boardState.value); // Путь к секции
//     const snapshot = await get(sectionRef);

//     if (snapshot.exists()) {
//       const threadsData = snapshot.val();
//       const threadKeys = Object.keys(threadsData); // Получаем ключи всех тредов

//       // Для каждого треда выполняем запрос на получение первых 5 постов
//       for (const threadKey of threadKeys) {
//         const threadRef = query(
//           dbRef(database, `${boardState.value}/${threadKey}/`), // Путь к треду
//           limitToFirst(5) // Ограничиваем запрос до 5 первых постов
//         );

//         const threadSnapshot = await get(threadRef);
//         const postsData = threadSnapshot.val();

//         if (postsData) {
//           const posts = Object.values(postsData); // Преобразуем посты в массив
//           threads.value.push({ threadKey, posts }); // Сохраняем тред и его посты
//         } else {
//           threads.value.push({ threadKey, posts: [] }); // Если постов нет, добавляем пустой массив
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Ошибка при загрузке тредов:", error);
//   }

//   return threads.value; // Возвращаем массив тредов
// };

const threads = ref([]);
const fetchThreads = async () => {
  threadState.value = localStorage.getItem('threadState')
  threads.value = []
  const boardState = ref(localStorage.getItem('boardState'));
  try {
    const sectionRef = dbRef(database, boardState.value); // Путь к секции
    const snapshot = await get(sectionRef);

    if (snapshot.exists()) {
      const threadsData = snapshot.val();
      const threadKeys = Object.keys(threadsData);

      // Сортируем ключи тредов по убыванию 'timestamp'
      threadKeys.sort((a, b) => b.localeCompare(a));

      // Для каждого треда выполняем запрос на получение первых 5 постов
      for (const threadKey of threadKeys) {
        const threadRef = query(
          dbRef(database, `${boardState.value}/${threadKey}/`), // Путь к треду
          limitToFirst(5) // Ограничиваем запрос до 5 первых постов
        );

        const threadSnapshot = await get(threadRef);
        const postsData = threadSnapshot.val();

        if (postsData) {
          const posts = Object.values(postsData); // Преобразуем посты в массив
          threads.value.push({ threadKey, posts }); // Сохраняем тред и его посты
        } else {
          threads.value.push({ threadKey, posts: [] }); // Если постов нет, добавляем пустой массив
        }
      }
    }
  } catch (error) {
    console.error("Ошибка при загрузке тредов:", error);
  }

  return threads.value; // Возвращаем массив тредов
};


provide('fetchPosts', fetchPosts)
provide('fetchThreads', fetchThreads)

  // // Следим за изменениями в localStorage
  // watch([threadState, boardState], () => {
  //   localStorage.setItem('threadState', threadState.value);
  //   localStorage.setItem('boardState', boardState.value);
  //   fetchPosts(); // Обновляем посты при изменении threadState или boardState
  // });


// Обновляем данные при монтировании компонента
// onMounted(() => {
//   fetchPosts();
// });

</script>

<template>
<div class="min-h-screen dark:bg-black">
  <div class="max-w-4xl rounded-2xl ml-6 bg-white dark:bg-black">

    
    <MainHeader class="" />

    <PostListTemplate v-if="threadState" :posts="posts" />

    
    <div v-if="!threadState">
      <div v-if="threads.length">
        <div v-for="(thread, threadIndex) in threads" :key="threadIndex">
          <div class="pt-4" v-if="thread.posts.length">
            <PostTemplate v-for="(post, postIndex) in thread.posts"
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
            />
          </div>
        </div>
      </div>
    </div>


    <SendData />

  </div>
</div>
</template>

