<script setup>
import { ref, inject } from 'vue'
import { database } from '../firebase'
import { ref as dbRef, push, set } from 'firebase/database'

const fetchPosts = inject('fetchPosts')

const postName = ref('')
const postTheme = ref('')
const postText = ref('')
const postUrl = ref('')
const postPassword = ref('')

const hashedString = ref('')

const threadState = ref('')
const boardState = ref('')

const sendPost = async () => {
  try {
    threadState.value = localStorage.getItem('threadState')
      ? localStorage.getItem('threadState')
      : localStorage.setItem('threadState', '')
    boardState.value = localStorage.getItem('boardState')
      ? localStorage.getItem('boardState')
      : localStorage.setItem('boardState', '')

    if (threadState.value && boardState.value) {
      const postId = push(dbRef(database, `${boardState.value}/${threadState.value}`)).key // Генерация уникального ID

      hashedString.value = await hashString(postPassword.value)
      const newPost = {
        name: postName.value ? postName.value : 'Аноним',
        password: postPassword.value ? hashedString.value : '',
        theme: postTheme.value,
        text: postText.value,
        url: postUrl.value,
        time: new Date().toLocaleTimeString('ru-RU', {
          timeZone: 'Europe/Moscow',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        data: new Date().toLocaleDateString(),
        day: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][new Date().getDay()],
        postId: postId,
        threadId: threadState.value
      }

      await set(dbRef(database, `${boardState.value}/${threadState.value}/${postId}`), newPost)

      postText.value = ''
      postUrl.value = ''
      postTheme.value = ''

      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        })
      }, 100)
    } else if (boardState.value) {
      const threadId = push(dbRef(database, 'threads')).key // Генерация уникального ID
      const postId = push(dbRef(database, `${boardState.value}/${threadId}`)).key // Генерация уникального ID

      hashedString.value = await hashString(postPassword.value)
      const newPost = {
        name: postName.value ? postName.value : 'Аноним',
        password: postPassword.value ? hashedString.value : '',
        theme: postTheme.value,
        text: postText.value,
        url: postUrl.value,
        time: new Date().toLocaleTimeString('ru-RU', {
          timeZone: 'Europe/Moscow',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        data: new Date().toLocaleDateString(),
        day: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][new Date().getDay()],
        postId: postId,
        threadId: threadId
      }

      //      const boardId = push(dbRef(database, 'boards')).key
      //      boardState.value = boardId
      //      localStorage.setItem('boardState', boardId)

      await set(dbRef(database, `${boardState.value}/${threadId}/${postId}`), newPost)

      postText.value = ''
      postUrl.value = ''
      postTheme.value = ''

      localStorage.setItem('threadState', threadId)
      threadState.value = threadId
      fetchPosts()
    } else {
      console.log('Раздел не выбран')
    }
  } catch (error) {
    console.error(error)
  }
}

// Функция для полной загрузки данных onValue
// const fetchPosts1 = () => {
//   threadState.value = localStorage.getItem('threadState')
//     ? localStorage.getItem('threadState')
//     : localStorage.setItem('threadState', '')
//   boardState.value = localStorage.getItem('boardState')
//     ? localStorage.getItem('boardState')
//     : localStorage.setItem('boardState', '')

//   const postsRef = dbRef(database, `${boardState.value}/${threadState.value}/`)

//   onValue(postsRef, (snapshot) => {
//     const data = snapshot.val()
//     if (data) {
//       // Если есть данные, извлекаем посты
//       posts.value = Object.values(data) // Преобразуем объект постов в массив
//     } else {
//       posts.value = []
//     }
//   })
// }

// Функция для слежения за добавлением новых постов onChildAdded

// const watchNewPosts = () => {
//   const postsRef = dbRef(database, `${boardState.value}/${threadState.value}/`)

//   onChildAdded(postsRef, (snapshot) => {
//     const newPost = snapshot.val();
//     posts.value.push(newPost); // Добавляем новый пост в конец массива
//   });
// };

// Lifecycle hook: onMounted для загрузки данных при монтировании компонента
// onMounted(() => {
//   localStorage.setItem('boardState', '')
//   localStorage.setItem('threadState', '')
//      fetchPosts();
//      watchNewPosts();
//})

// Lifecycle hook: onUnmounted для удаления слушателей при демонтировании компонента
// onUnmounted(() => {
//   // Тут можно добавить код для удаления слушателей при необходимости
// });

// --------------------

// onValue(postsRef, (snapshot) => {
//   const data = snapshot.val()
//   posts.value = Object.values(data).filter(post => post.threadId === '1')
// })

// const newBoardName = ref('');
// const newThreadTitle = ref('');
// const selectedBoardId = ref('');
// const newPostAuthor = ref('');
// const newPostContent = ref('');
// const selectedThreadId = ref('');
// const posts = ref([]);

// const createBoard = async () => {
//   const boardId = push(dbRef(database, 'boards')).key; // Генерация уникального ID
//   await set(dbRef(database, `boards/${boardId}`), {
//     boardId: boardId,
//     name: newBoardName.value
//   });
//   newBoardName.value = ''; // Очистка поля
// };

// const createThread = async () => {
//   const threadId = push(dbRef(database, 'threads')).key; // Генерация уникального ID
//   await set(dbRef(database, `threads/${threadId}`), {
//     boardId: selectedBoardId.value,
//     title: newThreadTitle.value
//   });
//   newThreadTitle.value = ''; // Очистка поля
//   selectedBoardId.value = ''; // Очистка поля
// };

// const createPost = async () => {
//   const postId = push(dbRef(database, 'posts')).key; // Генерация уникального ID
//   await set(dbRef(database, `posts/${postId}`), {
//     threadId: selectedThreadId.value,
//     author: newPostAuthor.value,
//     content: newPostContent.value
//   });
//   newPostAuthor.value = ''; // Очистка поля
//   newPostContent.value = ''; // Очистка поля
//   selectedThreadId.value = ''; // Очистка поля
// };

// const fetchPosts = () => {
//   const postsRef = dbRef(database, 'posts');
//   onValue(postsRef, (snapshot) => {
//     const data = snapshot.val();
//     posts.value = Object.values(data).filter(post => post.threadId === '1');
//   });
// };

// -------------------------------------------------------------------------------------------------------------

// const messagesRef = dbRef(database, 'messages');

// const writeData = () => {
// set(dbRef(database, String(Date.now())), {
//     username: newMessage.value,
//   });
// }

// // Подписка на изменения в базе данных
// onMounted(() => {
//   onValue(messagesRef, (snapshot) => {
//     const data = snapshot.val();
//     messages.value = data ? Object.values(data) : []; // Обновляем сообщения
//   });
// });

const hashString = async (input) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex.substring(0, 8)
}
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="form-group w-2/3">
      <div class="flex gap-2">
        <input
          v-model="postName"
          placeholder="name"
          class="flex-1 mt-4 text-sm p-2 ring-1 ring-slate-900/10 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 caret-pink-500 dark:bg-zinc-800 dark:ring-0 dark:highlight-white/5 dark:focus:ring-2 dark:focus:ring-pink-500 dark:focus:bg-zinc-900 dark:text-white"
          type="text"
        />
        <input
          v-model="postTheme"
          placeholder="theme"
          class="flex-1 mt-4 text-sm p-2 ring-1 ring-slate-900/10 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 caret-pink-500 dark:bg-zinc-800 dark:ring-0 dark:highlight-white/5 dark:focus:ring-2 dark:focus:ring-pink-500 dark:focus:bg-zinc-900 dark:text-white"
          type="text"
        />
        <input
          v-model="postPassword"
          placeholder="passcode"
          class="flex-1 mt-4 text-sm p-2 ring-1 ring-slate-900/10 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 caret-pink-500 dark:bg-zinc-800 dark:ring-0 dark:highlight-white/5 dark:focus:ring-2 dark:focus:ring-pink-500 dark:focus:bg-zinc-900 dark:text-white"
          type="text"
        />
      </div>

      <div class="flex mt-2">
        <textarea
          @keyup.shift.enter="sendPost"
          v-model="postText"
          placeholder="post"
          class="flex-1 text-sm p-2 ring-1 ring-slate-900/10 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 caret-pink-500 dark:bg-zinc-800 dark:ring-0 dark:highlight-white/5 dark:focus:ring-2 dark:focus:ring-pink-500 dark:focus:bg-zinc-900 dark:text-white"
          rows="2"
        ></textarea>
      </div>

      <div class="form-group w-2/3 mt-2">
        <div class="flex items-center pb-4 mt-2">
          <input
            v-model="postUrl"
            placeholder="url"
            class="flex-1 text-sm p-2 ring-1 ring-slate-900/10 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 caret-pink-500 dark:bg-zinc-800 dark:ring-0 dark:highlight-white/5 dark:focus:ring-2 dark:focus:ring-pink-500 dark:focus:bg-zinc-900 dark:text-white"
            type="text"
          />
          <button
            @click="sendPost"
            class="dark:bg-twitch ml-2 bg-black text-white rounded-2xl p-1 min-w-32"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
