<script setup>
import { ref, inject, watch, onMounted } from 'vue'
import { database } from '../firebase'
import { ref as dbRef, push, set, get, update, remove } from 'firebase/database'
import ErrorNotification from './ErrorNotification.vue';

const errorMessage = ref('');
const errorTrigger = ref(0); // Триггер для обновления компонента ошибки


;(function () {
  const devtools = { orientation: false }
  window.addEventListener('resize', function () {
    if (
      window.outerWidth - window.innerWidth > 100 ||
      window.outerHeight - window.innerHeight > 100
    ) {
      devtools.orientation = true
      generatedEmoji.value = ' '
    }
  })
})()

const props = defineProps({
  replyId: String
})

const fetchPosts = inject('fetchPosts')

const postName = ref('')
const postTheme = ref('')
const postText = ref('')
const postUrl = ref('')
const postPassword = ref('')
const hashedString = ref('')
const threadState = ref('')
const boardState = ref('')
const replies = ref([])
const uId = ref('')

const imgSize = ref(0)

const boards = [
  'Anime',
  'Asylum',
  'b',
  'dev',
  'vg',
  'vn',
  'gd',
  'Art',
  'cg',
  'Manga',
  'md',
  'bg',
  'Paranormal',
  'pr',
  'tech'
]

const sendPost = async () => {
  try {
    threadState.value = localStorage.getItem('threadState')
      ? localStorage.getItem('threadState')
      : localStorage.setItem('threadState', '')
    boardState.value = localStorage.getItem('boardState')
      ? localStorage.getItem('boardState')
      : localStorage.setItem('boardState', '')

    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(uId.value = await hashString(postPassword.value))


//-------

    // Получаем все забаненные объекты
    const bannedRef = dbRef(database, `banned/${boardState.value}/uIds`);
    const bannedSnapshot = await get(bannedRef);
    const isBanned = ref(false)
    const banExpiration = ref(null)

    if (bannedSnapshot.exists()) {
      const bannedData = bannedSnapshot.val();
      const banKey = ref(null)

      // Проходим по всем забаненным объектам
      for (const key in bannedData) {
        if (bannedData[key].uId === uId.value) {
          isBanned.value = true;
          banExpiration.value = bannedData[key].exp; // Получаем время истечения бана
          banKey.value = key; // Сохраняем ключ для удаления
          break; // Выходим из цикла, если нашли uId
        }
      }

      // Проверяем, истек ли срок бана
      if (isBanned.value) {
        const currentTime = Date.now();
        if (currentTime < banExpiration.value) {
          console.log(`uId ${uId.value} забанен до ${new Date(banExpiration.value).toLocaleString()}`);
        } else {
          const banKeyRef = dbRef(database, `banned/${boardState.value}/uIds/${banKey.value}`);
          await remove(banKeyRef); // Удаляем объект по ссылке
          isBanned.value = false
        }
      } else {
        console.log(`uId ${uId.value} не найден в бане`);
      }
    }

//-------      

    if (isBanned.value === false) {
      if (
        threadState.value &&
        boardState.value &&
        boards.some((board) => boardState.value.includes(board))
      ) {
        const postId = push(dbRef(database, `${boardState.value}/${threadState.value}`)).key // Генерация уникального ID

        replies.value = postText.value.match(/#([A-Za-z0-9_-]+)/g)

        loadImg()

        hashedString.value = await hashString(postPassword.value)
        const newPost = {
          name: postName.value ? (postName.value.length > 25 ? postName.value.slice(0, 25) : postName.value) : 'Аноним',
          password: postPassword.value ? hashedString.value : '',
          theme: postTheme.value.length < 45 ? postTheme.value : postTheme.value.slice(0, 25),
          text: (/\s{4,}/.test(postText.value) ? postText.value.replace(/\s{4,}/g, ' ') : postText.value).replace(/[^\w\s.,:;!?'"<>\\//{}$#()-]/g, ''),
          url: postUrl.value.length < 100 ? (imgSize.value !== 0 ? (imgSize.value < 4000000 ? postUrl.value : '') : postUrl.value) : '',
          time: new Date().toLocaleTimeString('ru-RU', {
            timeZone: 'Europe/Moscow',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          data: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
          day: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][new Date().getDay()],
          postId: postId,
          threadId: threadState.value,
          uId: uId.value
        }

        const savedTime = localStorage.getItem('tmlg')
          ? localStorage.getItem('tmlg')
          : localStorage.setItem('tmlg', Date.now() + 6)
        if (savedTime) {
          const currentTimeElapsed = Date.now() - savedTime
          if (currentTimeElapsed >= 5000) {
            if (postText.value.length < 450 && selectedEmoji.value === generatedEmoji.value) {
              // Сохраняем новый пост
              await set(dbRef(database, `${boardState.value}/${threadState.value}/posts/${postId}`), newPost)
              localStorage.setItem('tmlg', Date.now())

              try {
                // ----------- Обновление lastPostTimestamp в треде ----------- 
                await update(dbRef(database, `${boardState.value}/${threadState.value}`), {
                  lastPostTimestamp: Date.now() // Обновляем только метку времени последнего поста
                })
              } catch (err) {
                console.error(`Ошибка при обновлении метки последнего поста в треде: `, err)
              }

              // ----------- код обновления reply ----------- 
              if (replies.value && replies.value.length) {
                for (const id of replies.value) {
                  const sId = id.replace('#', '')
                  const postRef = dbRef(database, `${boardState.value}/${threadState.value}/posts/${sId}`)

                  try {
                    const snapshot = await get(postRef)
                    if (snapshot.exists()) {
                      const currentReplies = snapshot.val().replies || []
                      if (!currentReplies.includes(postId)) {
                        await update(postRef, {
                          replies: [...currentReplies, postId]
                        })
                        console.log(`Пост с id ${sId} успешно обновлен!`)
                      } else {
                        console.log(`Пост с id ${sId} уже содержит newPostId.`)
                      }
                    } else {
                      console.log(`Пост с id ${sId} не найден.`)
                    }
                  } catch (err) {
                    console.error(`Ошибка при обновлении документа с id ${sId}: `, err)
                  }
                }
              }
              // ----------- end -----------

              setTimeout(() => {
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: 'smooth'
                })
              }, 100)
              generateEmojis()

              postText.value = ''
              postUrl.value = ''
              postTheme.value = ''

            } else {
              errorMessage.value = 'Пост слишком длинный либо не решена капча! Максимальная длина 450 символов.'
              errorTrigger.value++; // Обновляем триггер
            }
          } else {
            errorMessage.value = 'Подождите 5 сек.'
            errorTrigger.value++; // Обновляем триггер          
          }
        }
      } else if (boardState.value && boards.some((board) => boardState.value.includes(board))) {
        const threadId = push(dbRef(database, 'threads')).key // Генерация уникального ID для нового треда
        const postId = push(dbRef(database, `${boardState.value}/${threadId}`)).key // Генерация уникального ID для поста

        hashedString.value = await hashString(postPassword.value)
        const newPost = {
          name: postName.value ? (postName.value.length > 25 ? postName.value.slice(0, 25) : postName.value) : 'Аноним',
          password: postPassword.value ? hashedString.value : '',
          theme: postTheme.value.length < 45 ? postTheme.value : postTheme.value.slice(0, 25),
          text: (/\s{4,}/.test(postText.value) ? postText.value.replace(/\s{4,}/g, ' ') : postText.value).replace(/[^\w\s.,:;!?'"<>\\//{}$#()-]/g, ''),
          url: postUrl.value.length < 100 ? postUrl.value : '',
          time: new Date().toLocaleTimeString('ru-RU', {
            timeZone: 'Europe/Moscow',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          data: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
          day: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][new Date().getDay()],
          postId: postId,
          threadId: threadId,
          uId: uId.value
        }

        const savedTime = localStorage.getItem('tmlg')
          ? localStorage.getItem('tmlg')
          : localStorage.setItem('tmlg', Date.now() + 6)
        if (savedTime) {
          const currentTimeElapsed = Date.now() - savedTime
          if (currentTimeElapsed >= 25000) {
            if (postText.value.length < 450 && /\.(jpeg|jpg|gif|png|mp4|webm|ogg)$/i.test(postUrl.value) && selectedEmoji.value === generatedEmoji.value) {
              await set(dbRef(database, `${boardState.value}/${threadId}/posts/${postId}`), newPost)

              // ----------- Установка lastPostTimestamp и 0p для нового треда ----------- 
              await update(dbRef(database, `${boardState.value}/${threadId}`), {
                lastPostTimestamp: Date.now(), // Обновляем только метку времени последнего поста
                op: newPost
              })


              localStorage.setItem('threadState', threadId)
              threadState.value = threadId

              generateEmojis()
              postText.value = ''
              postUrl.value = ''
              postTheme.value = ''

              fetchPosts()
            } else {
              errorMessage.value = 'Пост слишком длинный или не выбран файл! Максимальная длина 450 символов.';
              errorTrigger.value++; // Обновляем триггер
            }
          } else {
            errorMessage.value = 'Подождите 25 сек.';
            errorTrigger.value++; // Обновляем триггер
          }
        }
      }
    } else {
      errorMessage.value = `Забанен до ${new Date(banExpiration.value).toLocaleString()}`
      errorTrigger.value++; // Обновляем триггер
    }
  } catch (error) {
    console.error(error)
  }
}


const loadImg = () => {
    // Очищаем предыдущие значения
    imgSize.value = 0;

    // Получаем расширение файла
    const extension = postUrl.value.split('.').pop().toLowerCase();

    // Проверяем, является ли расширение допустимым
    if (['jpeg', 'jpg', 'gif', 'png'].includes(extension)) {
        const img = new Image();
        img.src = postUrl.value;

        // Обработчик события загрузки изображения
        img.onload = () => {
            imgSize.value = img.width * img.height; // Сохраняем размер изображения
            console.log(`Размер изображения: ${imgSize.value}`);
        };

        // Обработчик события ошибки загрузки изображения
        img.onerror = () => {
            console.error('Ошибка загрузки изображения по указанному URL');
            imgSize.value = 0; // Очищаем размер в случае ошибки
        };
    } else {
        //console.error('Недопустимый формат изображения');
        imgSize.value = 0; // Очищаем размер, если формат недопустимый
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

watch(
  () => props.replyId,
  (newReplyId) => {
    if (newReplyId) { // проверка на null
      postText.value = `${postText.value} #${String(newReplyId)}`;
    }
  }
);

//-----captcha
const emojis = ref(['😀', '😂', '😍', '😎', '😢', '🥳', '🤔', '😱', '😴'])
const generatedEmoji = ref(null)
const selectedEmoji = ref(null)
const resultMessage = ref('')

const generateEmojis = () => {
  // Генерируем случайный эмодзи
  generatedEmoji.value = emojis.value[Math.floor(Math.random() * emojis.value.length)]

  // Генерируем три случайных эмодзи, включая сгенерированный
  const randomEmojis = new Set()
  randomEmojis.add(generatedEmoji.value)
  while (randomEmojis.size < 3) {
    randomEmojis.add(emojis.value[Math.floor(Math.random() * emojis.value.length)])
  }
  emojis.value = Array.from(randomEmojis)
  selectedEmoji.value = null
  resultMessage.value = ''
}

const selectEmoji = (emoji) => {
  selectedEmoji.value = emoji
  localStorage.setItem('selectedEmoji', emoji)
  checkSelection()
}

const checkSelection = () => {
  if (selectedEmoji.value === generatedEmoji.value) {
    resultMessage.value = 'Капча решена!'
  } else {
    resultMessage.value = 'Попробуйте снова!'
  }
}

onMounted(() => {
  localStorage.setItem('tmlg', Date.now() + 6)
}, generateEmojis())

const addBold = () => {
  const textarea = document.querySelector('textarea')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  // Получаем выделенный текст
  const selectedText = postText.value.substring(start, end)

  if (selectedText) {
    // Обрамляем выделенный текст
    const wrappedText = `**${selectedText}**`

    // Обновляем текст с обрамленным выделением
    postText.value =
      postText.value.substring(0, start) + wrappedText + postText.value.substring(end)

    // Сбрасываем выделение
    textarea.focus()
    textarea.setSelectionRange(start, start + wrappedText.length)
  } else {
    // Если ничего не выбрано, добавляем ** **
    const wrappedText = '** **'
    postText.value =
      postText.value.substring(0, start) + wrappedText + postText.value.substring(end)

    // Устанавливаем курсор между звездочками
    textarea.focus()
    textarea.setSelectionRange(start + 3, start + 3) // Устанавливаем курсор между ** **
  }
}

const addCode = () => {
  const textarea = document.querySelector('textarea')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  // Получаем выделенный текст
  const selectedText = postText.value.substring(start, end)

  if (selectedText) {
    // Обрамляем выделенный текст
    const wrappedText = `\`${selectedText}\``

    // Обновляем текст с обрамленным выделением
    postText.value =
      postText.value.substring(0, start) + wrappedText + postText.value.substring(end)

    // Сбрасываем выделение
    textarea.focus()
    textarea.setSelectionRange(start, start + wrappedText.length)
  } else {
    // Если ничего не выбрано, добавляем ` `
    const wrappedText = `\` \``
    postText.value =
      postText.value.substring(0, start) + wrappedText + postText.value.substring(end)

    // Устанавливаем курсор между звездочками
    textarea.focus()
    textarea.setSelectionRange(start + 3, start + 3) // Устанавливаем курсор между ` `
  }
}

const addItalic = () => {
  const textarea = document.querySelector('textarea')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  // Получаем выделенный текст
  const selectedText = postText.value.substring(start, end)

  if (selectedText) {
    // Обрамляем выделенный текст
    const wrappedText = `*${selectedText}*`

    // Обновляем текст с обрамленным выделением
    postText.value =
      postText.value.substring(0, start) + wrappedText + postText.value.substring(end)

    // Сбрасываем выделение
    textarea.focus()
    textarea.setSelectionRange(start, start + wrappedText.length)
  } else {
    // Если ничего не выбрано, добавляем * *
    const wrappedText = `* *`
    postText.value =
      postText.value.substring(0, start) + wrappedText + postText.value.substring(end)

    // Устанавливаем курсор между звездочками
    textarea.focus()
    textarea.setSelectionRange(start + 3, start + 3) // Устанавливаем курсор между * *
  }
}

const addLink = () => {
  const textarea = document.querySelector('textarea')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  // Получаем выделенный текст
  const selectedText = postText.value.substring(start, end)

  if (selectedText) {
    // Обрамляем выделенный текст
    const wrappedText = `[${selectedText}](${selectedText})`

    // Обновляем текст с обрамленным выделением
    postText.value =
      postText.value.substring(0, start) + wrappedText + postText.value.substring(end)

    // Сбрасываем выделение
    textarea.focus()
    textarea.setSelectionRange(start, start + wrappedText.length)
  } else {
    // Если ничего не выбрано, добавляем [ ]( )
    const wrappedText = `[ ]( )`
    postText.value =
      postText.value.substring(0, start) + wrappedText + postText.value.substring(end)

    // Устанавливаем курсор между звездочками
    textarea.focus()
    textarea.setSelectionRange(start + 3, start + 3) // Устанавливаем курсор между [ ]( )
  }
}

const addQuote = () => {
  const textarea = document.querySelector('textarea')
  const start = textarea.selectionStart
  const end = textarea.selectionEnd

  // Получаем выделенный текст
  const selectedText = postText.value.substring(start, end)

  if (selectedText) {
    // Обрамляем выделенный текст
    const wrappedText = `>${selectedText}`

    // Обновляем текст с обрамленным выделением
    postText.value =
      postText.value.substring(0, start) + wrappedText + postText.value.substring(end)

    // Сбрасываем выделение
    textarea.focus()
    textarea.setSelectionRange(start, start + wrappedText.length)
  } else {
    // Если ничего не выбрано, добавляем >
    const wrappedText = `>`
    postText.value =
      postText.value.substring(0, start) + wrappedText + postText.value.substring(end)

    // Устанавливаем курсор между звездочками
    textarea.focus()
    textarea.setSelectionRange(start + 3, start + 3) // Устанавливаем курсор между >
  }
}
</script>

<template>
  <div class="container p-4 lg:p-4 lg:w-full lg:mx-0 lg:pl-0">
    <div class="pl-4 form-group w-full lg:w-2/3">
      <!-- Поля ввода с адаптацией по разрешению -->
      <div class="flex flex-col lg:flex-row gap-2">
        <input
          v-model="postName"
          placeholder="name"
          class="w-full lg:flex-1 text-sm p-2 ring-1 ring-slate-900/10 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 caret-pink-500 dark:bg-zinc-800 dark:ring-0 dark:highlight-white/5 dark:focus:ring-2 dark:focus:ring-pink-500 dark:focus:bg-zinc-900 dark:text-white"
          type="text"
        />
        <input
          v-model="postTheme"
          placeholder="theme"
          class="w-full lg:flex-1 text-sm p-2 ring-1 ring-slate-900/10 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 caret-pink-500 dark:bg-zinc-800 dark:ring-0 dark:highlight-white/5 dark:focus:ring-2 dark:focus:ring-pink-500 dark:focus:bg-zinc-900 dark:text-white"
          type="text"
        />
        <input
          v-model="postPassword"
          placeholder="passcode"
          class="w-full lg:flex-1 text-sm p-2 ring-1 ring-slate-900/10 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 caret-pink-500 dark:bg-zinc-800 dark:ring-0 dark:highlight-white/5 dark:focus:ring-2 dark:focus:ring-pink-500 dark:focus:bg-zinc-900 dark:text-white"
          type="text"
        />
      </div>

      <!-- Текстовое поле -->
      <div class="flex flex-col mt-2">
        <textarea
          @keyup.shift.enter="sendPost"
          v-model="postText"
          placeholder="post"
          class="w-full text-sm p-2 ring-1 ring-slate-900/10 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 caret-pink-500 dark:bg-zinc-800 dark:ring-0 dark:highlight-white/5 dark:focus:ring-2 dark:focus:ring-pink-500 dark:focus:bg-zinc-900 dark:text-white"
          rows="4"
        ></textarea>
      </div>

      <!-- Кнопка и управление форматированием -->
      <div class="form-group mt-2">
        <div class="flex flex-col lg:flex-row items-start lg:items-center gap-2 mt-2">
          <input
            v-model="postUrl"
            placeholder="url"
            class="w-full lg:flex-1 text-sm p-2 ring-1 ring-slate-900/10 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 caret-pink-500 dark:bg-zinc-800 dark:ring-0 dark:highlight-white/5 dark:focus:ring-2 dark:focus:ring-pink-500 dark:focus:bg-zinc-900 dark:text-white"
            type="text"
          />
          <button
            @click="sendPost"
            class="dark:bg-twitch bg-black text-white rounded-2xl p-1 w-full lg:min-w-32 lg:w-auto"
          >
            Post
          </button>

          <div class="flex gap-2 mt-2 lg:mt-0">
            <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer">
              <img
                src="../assets/clip.svg"
                alt="Icon"
                class="p-1 w-8 dark:rounded-2xl dark:bg-twitch"
              />
            </a>

            <div class="flex gap-2">
              <button
                class="text-sm dark:bg-twitch bg-black text-white rounded-full p-1 w-8 h-8"
                @click="addBold"
              >
                B
              </button>
              <button
                class="text-sm dark:bg-twitch bg-black text-white rounded-full p-1 w-8 h-8"
                @click="addCode"
              >
                C
              </button>
              <button
                class="text-sm dark:bg-twitch bg-black text-white rounded-full p-1 w-8 h-8"
                @click="addItalic"
              >
                I
              </button>
              <button
                class="text-sm dark:bg-twitch bg-black text-white rounded-full p-1 w-8 h-8"
                @click="addLink"
              >
                L
              </button>
              <button
                class="dark:bg-twitch bg-black text-white rounded-2xl p-1 w-8 h-8"
                @click="addQuote"
              >
                Q
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Капча с эмодзи -->
      <div class="flex bg-black w-full lg:w-2/3 rounded-2xl text-white p-1 dark:bg-twitch mt-4">
        <p class="ml-2">Найдите {{ generatedEmoji }}:</p>
        <div class="flex gap-2 pl-4">
          <div
            v-for="(emoji, index) in emojis"
            :key="index"
            @click="selectEmoji(emoji)"
            class="cursor-pointer hover:scale-110 transition-transform"
          >
            {{ emoji }}
          </div>
        </div>
        <div class="pl-4" v-if="checkSelection">{{ resultMessage }}</div>
      </div>
    </div>

    <!-- Компонент для отображения ошибок -->
    <ErrorNotification :message="errorMessage" :trigger="errorTrigger" />
  </div>
</template>
