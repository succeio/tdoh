<script setup>
import { ref, onMounted, watch } from 'vue';
import { database } from '../firebase';
import { ref as dbRef, query, limitToFirst, onValue } from 'firebase/database';
import PostTemplate from './postTemplate.vue'

const boardState = ref('')
boardState.value = localStorage.getItem('boardState') ? localStorage.getItem('boardState') : '-O8H6aNDuf1NlK9k2Gz6/'

// Путь к разделу с тредами (например, `-O8H6aNDuf1NlK9k2Gz6/`)
const sectionRef = dbRef(database, boardState.value);

const threads = ref([]); // Массив для хранения тредов и их постов

// Функция для загрузки всех тредов
const fetchThreads = () => {
  onValue(sectionRef, (snapshot) => {
    const threadsData = snapshot.val();
    if (threadsData) {
      const threadKeys = Object.keys(threadsData); // Получаем ключи всех тредов

      // Для каждого треда выполняем запрос на получение первых 3 постов
      threadKeys.forEach((threadKey) => {
        const threadRef = query(
          dbRef(database, `${boardState.value}/${threadKey}/`), // Путь к треду
          limitToFirst(5) // Ограничиваем запрос до 3 первых постов
        );

        onValue(threadRef, (threadSnapshot) => {
          const postsData = threadSnapshot.val();
          if (postsData) {
            const posts = Object.values(postsData); // Преобразуем посты в массив
            threads.value.push({ threadKey, posts }); // Сохраняем тред и его посты
          } else {
            threads.value.push({ threadKey, posts: [] }); // Если постов нет, добавляем пустой массив
          }
        });
      });
    }
  });
};

// // Следим за изменением boardState в localStorage
// watch(boardState, () => {
//   localStorage.setItem('boardState', boardState.value);
//   fetchThreads(); // Обновляем треды при изменении boardState
// });

// // Lifecycle hook: onMounted для загрузки данных при монтировании компонента
onMounted(() => {
  fetchThreads();
});


</script>

<template>
  <div>
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
</template>