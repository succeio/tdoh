<script setup>
import { ref, inject, watch, onMounted } from 'vue'
import { database } from '../firebase'
import { ref as dbRef, push, set, get, update } from 'firebase/database'

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

const imgSize = ref(0)

const boards = [
  'Anime',
  'Asylum',
  'b',
  'dev',
  'Videogames',
  'VisualNovels',
  'Gamedev',
  'Art',
  'Consoles',
  'Manga',
  'MobileDevices',
  'BoardGames',
  'Paranormal',
  'Programming',
  'Technology'
]

const sendPost = async () => {
  try {
    threadState.value = localStorage.getItem('threadState')
      ? localStorage.getItem('threadState')
      : localStorage.setItem('threadState', '')
    boardState.value = localStorage.getItem('boardState')
      ? localStorage.getItem('boardState')
      : localStorage.setItem('boardState', '')

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
        theme: postTheme.value.length < 25 ? postTheme.value : postTheme.value.slice(0, 25),
        text: postText.value,
        url: postUrl.value.length < 100 ? ( imgSize.value !== 0 ? ( imgSize.value < 4000000 ? postUrl.value : ''  ) : postUrl.value  )  : '',
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

      const savedTime = localStorage.getItem('tmlg')
        ? localStorage.getItem('tmlg')
        : localStorage.setItem('tmlg', Date.now() + 6)
      if (savedTime) {
        const currentTime = Date.now()
        const timeElapsed = currentTime - savedTime
        if (timeElapsed >= 5000) {
          if (postText.value.length < 250 && selectedEmoji.value === generatedEmoji.value) {
            await set(
              dbRef(database, `${boardState.value}/${threadState.value}/${postId}`),
              newPost
            )
            localStorage.setItem('tmlg', Date.now())
            generateEmojis()

            postText.value = ''
            postUrl.value = ''
            postTheme.value = ''

            // ----------- код обновления reply -----------
            if (replies.value && replies.value.length) {
              for (const id of replies.value) {
                const sId = id.replace('#', '')
                const postRef = dbRef(database, `${boardState.value}/${threadState.value}/${sId}`) // Путь к посту

                try {
                  const snapshot = await get(postRef)
                  if (snapshot.exists()) {
                    const currentReplies = snapshot.val().replies || []
                    // Проверяем, если newPostId уже существует в массиве
                    if (!currentReplies.includes(postId)) {
                      // Обновляем массив replies
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
          } else {
            console.log('Много букв')
          }
        }
      }
    } else if (boardState.value && boards.some((board) => boardState.value.includes(board))) {
      const threadId = push(dbRef(database, 'threads')).key // Генерация уникального ID
      const postId = push(dbRef(database, `${boardState.value}/${threadId}`)).key // Генерация уникального ID

      hashedString.value = await hashString(postPassword.value)
      const newPost = {
        name: postName.value ? (postName.value.length > 25 ? postName.value.slice(0, 25) : postName.value) : 'Аноним',
        password: postPassword.value ? hashedString.value : '',
        theme: postTheme.value.length < 25 ? postTheme.value : postTheme.value.slice(0, 25),
        text: postText.value,
        url: postUrl.value.length < 25 ? postUrl.value : '',
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

      const savedTime = localStorage.getItem('tmlg')
        ? localStorage.getItem('tmlg')
        : localStorage.setItem('tmlg', Date.now() + 6)
      if (savedTime) {
        const currentTime = Date.now()
        const timeElapsed = currentTime - savedTime
        if (timeElapsed >= 5000) {
          if (
            postText.value.length < 250 &&
            /\.(jpeg|jpg|gif|png|mp4|webm|ogg)$/i.test(postUrl.value) &&
            selectedEmoji.value === generatedEmoji.value
          ) {
            await set(dbRef(database, `${boardState.value}/${threadId}/${postId}`), newPost)
            generateEmojis()
            postText.value = ''
            postUrl.value = ''
            postTheme.value = ''

            localStorage.setItem('threadState', threadId)
            threadState.value = threadId

            fetchPosts()
          } else {
            console.log('Много букв или не выбран файл')
          }
        } else {
          console.log('Раздел не выбран')
        }
      }
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
    postText.value = `${postText.value} #${String(newReplyId)}`
  }
)

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
  <div class="container p-4">
    <div class="form-group w-2/3 min-w-max">
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

      <div class="flex flex-col mt-2">
        <textarea
          @keyup.shift.enter="sendPost"
          v-model="postText"
          placeholder="post"
          class="flex-1 text-sm p-2 ring-1 ring-slate-900/10 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 caret-pink-500 dark:bg-zinc-800 dark:ring-0 dark:highlight-white/5 dark:focus:ring-2 dark:focus:ring-pink-500 dark:focus:bg-zinc-900 dark:text-white"
          rows="4"
        ></textarea>
      </div>

      <div class="form-group mt-2">
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

          <div class="">
            <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer">
              <img
                src="../assets/clip.svg"
                alt="Icon"
                class="p-1 w-8 ml-2 dark:rounded-2xl dark:bg-twitch"
              />
            </a>
          </div>

          <div class="flex">
            <button
              class="text-sm dark:bg-twitch ml-2 bg-black text-white rounded-full min-w-8"
              @click="addBold"
            >
              B
            </button>
            <button
              class="text-sm dark:bg-twitch ml-2 bg-black text-white rounded-full min-w-8"
              @click="addCode"
            >
              C
            </button>
            <button
              class="text-sm dark:bg-twitch ml-2 bg-black text-white rounded-full min-w-8"
              @click="addLink"
            >
              L
            </button>
            <button
              class="dark:bg-twitch ml-2 bg-black text-white rounded-2xl p-1 min-w-8"
              @click="addQuote"
            >
              Q
            </button>
          </div>
        </div>
      </div>

      <div class="flex bg-black w-2/3 rounded-2xl text-white p-1 dark:bg-twitch min-w-max">
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
  </div>
</template>
