<script setup>
import { ref} from 'vue';
import { database } from '../firebase';
import { ref as dbRef, onValue } from 'firebase/database';
import PostListTemplate from './postListTemplate.vue';

const posts = ref([])
const threadState = ref('')
const boardState = ref('')

// const start = () => {
//   localStorage.setItem('boardState', '')
//   localStorage.setItem('threadState', '')
// }

// Функция для полной загрузки данных onValue
const fetchPosts = () => {
  threadState.value = localStorage.getItem('threadState') ? localStorage.getItem('threadState') : localStorage.setItem('threadState', '')
  boardState.value = localStorage.getItem('boardState') ? localStorage.getItem('boardState') : localStorage.setItem('boardState', '')

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

//  watchNewPosts()
};

//    Функция для слежения за добавлением новых постов onChildAdded

// const watchNewPosts = () => {
//   const postsRef = dbRef(database, `${boardState.value}/${threadState.value}/`)

//   onChildAdded(postsRef, (snapshot) => {
//     const newPost = snapshot.val();
//     posts.value.push(newPost); // Добавляем новый пост в конец массива
//   });
// };

// Lifecycle hook: onMounted для загрузки данных при монтировании компонента
// onMounted(() => {
//   start()
//   fetchPosts();
// });

// Lifecycle hook: onUnmounted для удаления слушателей при демонтировании компонента
// onUnmounted(() => {
//   // Тут можно добавить код для удаления слушателей при необходимости
// });


</script>

<template>
<button class="bg-black ml-1" @click="fetchPosts">dwd</button>

<div >

<PostListTemplate :posts="posts"/>

</div>
</template>