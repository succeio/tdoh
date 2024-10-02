<script setup>
import { ref, onMounted, watch } from 'vue';
import { database } from '../firebase';
import { ref as dbRef, push, set, onValue } from 'firebase/database';

const threadState = ref('')
const boardState = ref('')

const postName = ref('')
const postTheme = ref('')

const CreateNewThread = async () => {
  threadState.value = localStorage.getItem('threadState') ? JSON.parse(localStorage.getItem('threadState')) : ''
  boardState.value = localStorage.getItem('boardState') ? JSON.parse(localStorage.getItem('boardState')) : null
  
  //я собираю из полей данные в объект
  const newPost = {
    name: postName.value,
    theme: postTheme.value
  } 

  try {
    console.log(newPost)
    onMounted()
    watch()
    database
    dbRef
    push
    set
    onValue
    
  } catch (error) {console.log(error)}
}

    // Запись сообщения в узел 'posts' с использованием push()
    // реактианя переменная не обновляется

    // const postRef = await push(dbRef(database, 'posts'), newPost)
    // console.log("Пост успешно добавлен с ID:", postRef.key)

    // //если в хранилище есть данные, то мы в треде и отправляем ссылку на пост в этот тред
    // if (threadState.value) {
    //   console.log(threadState.value)
    //   const pushInThreadRef = await push(dbRef(database, 'threads/' + threadState.value), postRef.key)
    //   console.log("pushInThreadRef отработал с ID:", pushInThreadRef.key)
    // } else {
    //   //если пустой, то создается новый тред
    //   //создаю в узле threads новую запись, куда добавляю ссылку на пост
    //   const newThreadRef = await push(dbRef(database, 'threads'), postRef.key)
    //   console.log("Тред успешно создан с ID:", newThreadRef.key)
    //   //я записываю в локальное хранилище состояние созданного треда и его номер
    //   threadState.value = newThreadRef.key
    //   localStorage.setItem('threadState', JSON.stringify(threadState.value))
    // }

    // if (threadState.value[0]) {
    //   //отрабатывает если тред был создан
    //   console.log(Boolean(threadState.value[0]))
    //   const postRef = await push(dbRef(database, 'posts'), newPost)
    //   await push(dbRef(database, 'threads/' + threadState.value), postRef.key)

    // } else {
    //   //отрабатывает до создания треда
    //   const postRef = await push(dbRef(database, 'posts'), newPost)
    //   const pushInThreadRef = await push(dbRef(database, 'threads/'), postRef.key)

    //   localStorage.setItem('threadState', JSON.stringify(pushInThreadRef.key))

      
    // }

//     // Проверка на наличие в хранилище данных
// if (threadState.value && threadState.value[0]) {
//     // Если тред был создан
//     console.log(Boolean(threadState.value[0]));
//     const postRef = await push(dbRef(database, 'posts'), newPost);
    
//     // Добавляем идентификатор поста в существующий тред
//     await push(dbRef(database, 'threads/' + threadState.value), postRef.key);
//     console.log("Пост добавлен в существующий тред с ID:", postRef.key);
// } else {
//     // Если треда нет, создаем новый тред
//     const postRef = await push(dbRef(database, 'posts'), newPost);
    
//     // Создаем новый тред и добавляем идентификатор поста под уникальным ключом
//     const newThreadRef = await push(dbRef(database, 'threads'), {
//         [postRef.key]: postRef.key // Сохраняем идентификатор поста под его уникальным ключом
//     });
    
//     console.log("Тред успешно создан с ID:", newThreadRef.key);
    
//     // Записываем состояние созданного треда и его номер
//     threadState.value = newThreadRef.key;
//     localStorage.setItem('threadState', JSON.stringify(threadState.value));
// }

//--------------------------- подход с вложением ключ: значение разные
// // Проверка на наличие в хранилище данных
// if (threadState.value && threadState.value[0]) {
//     // Если тред был создан
//     console.log(Boolean(threadState.value[0]));
//     const postRef = await push(dbRef(database, 'posts'), newPost);
    
//     // Добавляем идентификатор поста в существующий тред
//     await push(dbRef(database, 'threads/' + threadState.value), postRef.key);
//     console.log("Пост добавлен в существующий тред с ID:", postRef.key);
// } else {
//     // Если треда нет, создаем новый тред
//     const postRef = await push(dbRef(database, 'posts'), newPost);
    
//     // Создаем новый тред и добавляем идентификатор поста под его уникальным ключом
//     const newThreadRef = await push(dbRef(database, 'threads'), {
//         [postRef.key]: postRef.key // Сохраняем идентификатор поста под его уникальным ключом
//     });
    
//     console.log("Тред успешно создан с ID:", newThreadRef.key);
    
//     // Записываем состояние созданного треда и его номер
//     threadState.value = newThreadRef.key;
//     localStorage.setItem('threadState', JSON.stringify(threadState.value));

//     // Добавляем новый тред в раздел board
//     if (boardState.value) {
//         await push(dbRef(database, 'board/' + boardState.value), newThreadRef.key);
//         console.log("Тред добавлен в board с ID:", newThreadRef.key);
//     } else {
//         // Если boardState пустой, создаем новый раздел board
//         const newBoardRef = await push(dbRef(database, 'board'), {
//             [newThreadRef.key]: newThreadRef.key // Сохраняем идентификатор треда под его уникальным ключом
//         });
//         console.log("Раздел board успешно создан с ID:", newBoardRef.key);
//     }
// }

//---------------------------------- подход с вложением ключ: значение одинаковые
// Проверка на наличие в хранилище данных
// if (threadState.value && threadState.value[0]) {
//     // Если тред был создан
//     console.log(Boolean(threadState.value[0]));
    
//     // Создаем новый пост
//     const postRef = await push(dbRef(database, 'posts'), newPost);
    
//     // Добавляем идентификатор поста в существующий тред
//     await set(dbRef(database, `threads/${threadState.value}/${postRef.key}`), postRef.key);
//     console.log("Пост добавлен в существующий тред с ID:", postRef.key);
// } else {
//     // Если треда нет, создаем новый пост
//     const postRef = await push(dbRef(database, 'posts'), newPost);
    
//     // Создаем новый тред и добавляем идентификатор поста
//     const newThreadRef = await push(dbRef(database, 'threads'), {
//         [postRef.key]: postRef.key // Сохраняем идентификатор поста под его уникальным ключом
//     });
    
//     console.log("Тред успешно создан с ID:", newThreadRef.key);
    
//     // Записываем состояние созданного треда и его номер
//     threadState.value = newThreadRef.key;
//     localStorage.setItem('threadState', JSON.stringify(threadState.value));

//     // Добавляем новый тред в раздел board
//     if (boardState.value) {
//         await set(dbRef(database, `board/${boardState.value}/${newThreadRef.key}`), newThreadRef.key);
//         console.log("Тред добавлен в board с ID:", newThreadRef.key);
//     } else {
//         // Если boardState пустой, создаем новый раздел board
//         const newBoardRef = await push(dbRef(database, 'board'), {
//             [newThreadRef.key]: newThreadRef.key // Сохраняем идентификатор треда под его уникальным ключом
//         });
//         console.log("Раздел board успешно создан с ID:", newBoardRef.key);
//     }
// }

//------------------------------------------------ создает пост, создает тред если не создал, создает борду и всё это ссылками
//Проверка на наличие в хранилище данных
// if (threadState.value && threadState.value[0]) {
//     // Если тред был создан
//     console.log(Boolean(threadState.value[0]));
    
//     // Создаем новый пост
//     const postRef = await push(dbRef(database, 'posts'), newPost);
    
//     // Добавляем идентификатор поста в существующий тред
//     await set(dbRef(database, `threads/${threadState.value}/${postRef.key}`), true); // Используем true как значение
//     console.log("Пост добавлен в существующий тред с ID:", postRef.key);
// } else {
//     // Если треда нет, создаем новый пост
//     const postRef = await push(dbRef(database, 'posts'), newPost);
    
//     // Создаем новый тред и добавляем идентификатор поста
//     const newThreadRef = await push(dbRef(database, 'threads'), {
//         [postRef.key]: true // Сохраняем идентификатор поста с значением true
//     });
    
//     console.log("Тред успешно создан с ID:", newThreadRef.key);
    
//     // Записываем состояние созданного треда и его номер
//     threadState.value = newThreadRef.key;
//     localStorage.setItem('threadState', JSON.stringify(threadState.value));

//     // Добавляем новый тред в раздел board
//     if (boardState.value) {
//         await set(dbRef(database, `board/${boardState.value}/${newThreadRef.key}`), true); // Используем true как значение
//         console.log("Тред добавлен в board с ID:", newThreadRef.key);
//     } else {
//         // Если boardState пустой, создаем новый раздел board
//         const newBoardRef = await push(dbRef(database, 'board'), {
//             [newThreadRef.key]: true // Сохраняем идентификатор треда с значением true
//         });

//         boardState.value = newBoardRef.key
//         localStorage.setItem('boardState', JSON.stringify(boardState.value))
//         console.log("Раздел board успешно создан с ID:", newBoardRef.key);
//       }
//   }

//     postName.value = ''
//     postTheme.value = ''

//   } catch (error) {
//     console.error("Ошибка при отправке сообщения: ", error)
//   }
// };




    // const posts = ref([]);
    // const loading = ref(true);
    // const error = ref(null);
  
    // const threadId = threadState.value[0]; // Получаем ID треда из props

    // onMounted(() => {
    //   const threadRef = dbRef(database, `threads/${threadId}`);

    //   // Получаем посты из треда
    //   onValue(threadRef, (snapshot) => {
    //     const threadData = snapshot.val();
    //     if (threadData) {
    //       const postIds = Object.keys(threadData);
    //       fetchPosts(postIds);
    //     } else {
    //       error.value = 'Тред не найден или пустой';
    //       posts.value = [];
    //       loading.value = false;
    //     }
    //   }, (error) => {
    //     console.error('Ошибка при получении данных треда:', error);
    //     error.value = 'Ошибка при получении данных треда';
    //     loading.value = false;
    //   });
    // });

    // const fetchPosts = (postIds) => {
    //   const postsRef = dbRef(database, 'posts');
    //   onValue(postsRef, (snapshot) => {
    //     const allPosts = snapshot.val();
    //     if (allPosts) {
    //       posts.value = postIds.map(id => ({
    //         id,
    //         ...allPosts[id]
    //       })).filter(post => post); // Убедитесь, что пост существует
    //     } else {
    //       error.value = 'Посты не найдены';
    //       posts.value = [];
    //     }
    //     loading.value = false; // Завершаем загрузку
    //   }, (error) => {
    //     console.error('Ошибка при получении постов:', error);
    //     error.value = 'Ошибка при получении постов';
    //     loading.value = false;
    //   });
    // };

//update()

//---------------------------------- работающий подход, который достается посты по ссылкам из узла тред
// Реактивная переменная для хранения постов
// const posts = ref([]);

// // Функция для получения постов по ID треда
// const fetchPostsByThreadId = (threadId) => {
//   threadState.value = localStorage.getItem('threadState') ? JSON.parse(localStorage.getItem('threadState')) : '';

//   const threadRef = dbRef(database, `threads/${threadId}`);
  
//   // Слушаем изменения в треде
//   onValue(threadRef, (snapshot) => {
//     const threadData = snapshot.val();
//     if (threadData) {
//       // Для каждого поста в треде получаем полную информацию о постах
//       const postPromises = Object.keys(threadData).map((postId) => {
//         return new Promise((resolve) => {
//           const postRef = dbRef(database, `posts/${postId}`);
//           onValue(postRef, (postSnapshot) => {
//             resolve({ id: postId, ...postSnapshot.val() });
//           });
//         });
//       });

//       // Когда все посты будут загружены, обновляем реактивную переменную
//       Promise.all(postPromises).then((loadedPosts) => {
//         posts.value = loadedPosts;
//       });
//     } else {
//       posts.value = []; // Если нет данных
//     }
//   });
// };

// Выполняем загрузку данных при монтировании компонента
//onMounted(() => {
//  const threadId = String(threadState.value[0]); // Пример ID треда
//  fetchPostsByThreadId(threadId);
//});

// watch(threadState, () => { 
//   const threadId = threadState.value; // Пример ID треда
//   fetchPostsByThreadId(threadId);  
// })

// watch(threadState, () => {
//   console.log('dwd')
// })

// const posts = ref([])
// const messagesRef = dbRef(database, 'posts');
// onMounted(() => {
//   onValue(messagesRef, (snapshot) => {
//     const data = snapshot.val();
//     posts.value = data ? Object.values(data) : []; // Обновляем сообщения
//   });
// });

// ------------------------------------------------------------------------------------------------------

// const newMessage = ref('')
// const messages = ref([])

// const messagesRef = dbRef(database, 'messages');
// const sendMessage = () => {
//   const message = {
//     text: newMessage.value,
//     timestamp: Date.now() // Можно использовать временную метку
//   };

//   // Запись сообщения в узел 'messages' с использованием push()
//   push(messagesRef, message)
//     .then(() => {
//       newMessage.value = ''; // Очищаем поле ввода
//     })
//     .catch((error) => {
//       console.error("Ошибка при отправке сообщения: ", error);
//     });
// };

// onMounted(() => {
//   onValue(messagesRef, (snapshot) => {
//     const data = snapshot.val();
//     messages.value = data ? Object.values(data) : []; // Обновляем сообщения
//   });
// });

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

</script>

<template>
  <div class="chat-container">
  <div>
  <h1>Посты по треду</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        {{ post.name }} - {{ post.theme }}
      </li>
    </ul>
  </div>

    <div class="input-container">
      <input
        type="text"
        v-model="postName"
        @keyup.enter="sendPost"
        placeholder="name"
        />
      />

      <input
        type="text"
        v-model="postTheme"
        placeholder="theme"
        />
      />

      <button @click="CreateNewThread">Отправить</button>
    </div>
  </div>
</template>