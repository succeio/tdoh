<script setup>
import { ref, inject, watch, onMounted, onUnmounted} from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { database, storage } from '../firebase'
import { ref as dbRef, push, set, get, update, remove } from 'firebase/database'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import ErrorNotification from './ErrorNotification.vue';

//storage

const imagePreview = ref(null);
const mimeType = ref(null); // Сохраняем MIME-тип
const fileInput = ref(null);
const maxFileSize = 4 * 1024 * 1024; // Максимальный размер файла: 4MB
const allowedFormats = ['image/svg+xml', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];

const handlePaste = async (event) => {
  const items = event.clipboardData.items;
  for (let item of items) {
    const file = item.getAsFile();
    if (file) {
      // Проверяем формат и размер файла
      const error = validateFile(file);
      if (error) {
        alert(error); // Выводим ошибку
      } else {
        await uploadFile(file);
      }
    }
  }
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    // Проверяем формат и размер файла
    const error = validateFile(file);
    if (error) {
      //alert(error); // Выводим ошибку
    } else {
      await uploadFile(file);
    }
  }
};

const openFileDialog = () => {
  fileInput.value.click();
};

// Функция для проверки формата и размера файла
const validateFile = (file) => {
  if (!allowedFormats.includes(file.type)) {
    errorMessage.value = 'Неподдерживаемый формат файла. Допустимы только изображения и видео (jpeg, png, gif, webp, mp4, webm, svg).';
    errorTrigger.value++; // Обновляем триггер
    return
  }
  if (file.size > maxFileSize) {
    errorMessage.value = `Размер файла превышает 4MB. Текущий размер: ${(file.size / 1024 / 1024).toFixed(2)}MB.`;
    errorTrigger.value++; // Обновляем триггер
    return 
  }
  return null; // Если ошибок нет
};

const uploadFile = async (file) => {
  const uniqueFileName = `${Date.now()}-${file.name}`;
  const storageReference = storageRef(storage, `uploads/${route.params.board}/${route.params.thread}/${uniqueFileName}`);

  // Загружаем файл в Firebase Storage
  await uploadBytes(storageReference, file);

  // Получаем прямую ссылку на загруженный файл
  const downloadURL = await getDownloadURL(storageReference);
  imagePreview.value = downloadURL; // Устанавливаем URL для предпросмотра
  mimeType.value = file.type; // Сохраняем MIME-тип
  postUrl.value = downloadURL;
};

onMounted(() => {
  window.addEventListener('paste', handlePaste);
});

onUnmounted(() => {
  window.removeEventListener('paste', handlePaste);
});

//---------------------- v2

// const imagePreview = ref(null);
// const mimeType = ref(null); // Сохраняем MIME-тип
// const fileInput = ref(null);
// const maxFileSize = 4 * 1024 * 1024; // Максимальный размер файла: 4MB
// const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];

// const handlePaste = async (event) => {
//   const items = event.clipboardData.items;
//   for (let item of items) {
//     const file = item.getAsFile();
//     if (file) {
//       // Проверяем формат и размер файла
//       const error = validateFile(file);
//       if (error) {
//         alert(error); // Выводим ошибку
//       } else {
//         await checkFileExistsAndUpload(file);
//       }
//     }
//   }
// };

// const handleFileUpload = async (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     // Проверяем формат и размер файла
//     const error = validateFile(file);
//     if (error) {
//       //alert(error); // Выводим ошибку
//     } else {
//       await checkFileExistsAndUpload(file);
//     }
//   }
// };

// const openFileDialog = () => {
//   fileInput.value.click();
// };

// // Функция для проверки формата и размера файла
// const validateFile = (file) => {
//   if (!allowedFormats.includes(file.type)) {
//     errorMessage.value = 'Неподдерживаемый формат файла. Допустимы только изображения и видео (jpeg, png, gif, webp, mp4, webm).';
//     errorTrigger.value++; // Обновляем триггер
//     return;
//   }
//   if (file.size > maxFileSize) {
//     errorMessage.value = `Размер файла превышает 4MB. Текущий размер: ${(file.size / 1024 / 1024).toFixed(2)}MB.`;
//     errorTrigger.value++; // Обновляем триггер
//     return;
//   }
//   return null; // Если ошибок нет
// };

// // Функция для проверки существования файла и загрузки, если его нет
// const checkFileExistsAndUpload = async (file) => {
//   //const storageReference = storageRef(storage, `uploads/${route.params.board}/${route.params.thread}/${file.name}`);
//   const storageReference = storageRef(storage, `uploads/${file.name}`);

//   try {
//     // Проверяем существование файла
//     await getMetadata(storageReference);
//     // Если файл существует, получаем его URL
//     const downloadURL = await getDownloadURL(storageReference);
//     imagePreview.value = downloadURL; // Устанавливаем URL для предпросмотра
//     mimeType.value = file.type; // Сохраняем MIME-тип
//     postUrl.value = downloadURL; // Устанавливаем URL для поста
//   } catch (error) {
//     if (error.code === 'storage/object-not-found') {
//       // Файл не существует, загружаем его
//       await uploadFile(file);
//     } else {
//       console.error('Ошибка при проверке существования файла:', error);
//     }
//   }
// };

// const uploadFile = async (file) => {
//   //const storageReference = storageRef(storage, `uploads/${route.params.board}/${route.params.thread}/${file.name}`);
//   const storageReference = storageRef(storage, `uploads/${file.name}`);
//   // Загружаем файл в Firebase Storage
//   await uploadBytes(storageReference, file);

//   // Получаем прямую ссылку на загруженный файл
//   const downloadURL = await getDownloadURL(storageReference);
//   imagePreview.value = downloadURL; // Устанавливаем URL для предпросмотра
//   mimeType.value = file.type; // Сохраняем MIME-тип
//   postUrl.value = downloadURL; // Устанавливаем URL для поста
// };

// onMounted(() => {
//   window.addEventListener('paste', handlePaste);
// });

// onUnmounted(() => {
//   window.removeEventListener('paste', handlePaste);
// });

//-----------v3 тут как бы если есть файл с таким же названием, то передается его ссылка, проблемы возникают с image из буфера

// const imagePreview = ref(null);
// const mimeType = ref(null); // Сохраняем MIME-тип
// const fileInput = ref(null);
// const maxFileSize = 4 * 1024 * 1024; // Максимальный размер файла: 4MB
// const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];

// const handlePaste = async (event) => {
//   event.clipboardData.clearData(); // Сбрасываем данные буфера обмена
//   const items = event.clipboardData.items;
//   let foundFile = false;

//   for (let item of items) {
//     const file = item.getAsFile();
//     if (file) {
//       foundFile = true;
//       console.log('Получен файл из буфера обмена:', file);
//       imagePreview.value = null;
//       mimeType.value = null;

//       const error = validateFile(file);
//       if (error) {
//         alert(error);
//       } else {
//         await checkFileExistsAndUpload(file);
//       }
//     }
//   }

//   if (!foundFile) {
//     console.log('Файл не найден в буфере обмена');
//     imagePreview.value = null;
//     mimeType.value = null;
//   }
// };


// const handleFileUpload = async (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     // Очищаем данные предыдущего файла
//     imagePreview.value = null;
//     mimeType.value = null;

//     // Проверяем формат и размер файла
//     const error = validateFile(file);
//     if (error) {
//       alert(error); // Выводим ошибку
//     } else {
//       await checkFileExistsAndUpload(file);
//     }
//   }
// };

// const openFileDialog = () => {
//   fileInput.value.click();
// };

// // Функция для проверки формата и размера файла
// const validateFile = (file) => {
//   if (!allowedFormats.includes(file.type)) {
//     return 'Неподдерживаемый формат файла. Допустимы только изображения и видео (jpeg, png, gif, webp, mp4, webm).';
//   }
//   if (file.size > maxFileSize) {
//     return `Размер файла превышает 4MB. Текущий размер: ${(file.size / 1024 / 1024).toFixed(2)}MB.`;
//   }
//   return null; // Если ошибок нет
// };

// // Функция для проверки существования файла и загрузки, если его нет
// const checkFileExistsAndUpload = async (file) => {
//   const storageReference = storageRef(storage, `uploads/${file.name}`);

//   try {
//     // Проверяем существование файла
//     await getMetadata(storageReference);
//     // Если файл существует, получаем его URL
//     const downloadURL = await getDownloadURL(storageReference);
//     imagePreview.value = downloadURL; // Устанавливаем URL для предпросмотра
//     mimeType.value = file.type; // Сохраняем MIME-тип
//     postUrl.value = downloadURL; // Устанавливаем URL для поста
//   } catch (error) {
//     if (error.code === 'storage/object-not-found') {
//       // Файл не существует, загружаем его
//       await uploadFile(file);
//     } else {
//       console.error('Ошибка при проверке существования файла:', error);
//     }
//   }
// };

// const uploadFile = async (file) => {
//   const storageReference = storageRef(storage, `uploads/${file.name}`);
//   // Загружаем файл в Firebase Storage
//   await uploadBytes(storageReference, file);

//   // Получаем прямую ссылку на загруженный файл
//   const downloadURL = await getDownloadURL(storageReference);
//   imagePreview.value = downloadURL; // Устанавливаем URL для предпросмотра
//   mimeType.value = file.type; // Сохраняем MIME-тип
//   postUrl.value = downloadURL; // Устанавливаем URL для поста
// };

// onMounted(() => {
//   window.addEventListener('paste', handlePaste);
// });

// onUnmounted(() => {
//   window.removeEventListener('paste', handlePaste);
// });



const errorMessage = ref('');
const errorTrigger = ref(0); // Триггер для обновления компонента ошибки

//---------- router
const route = useRoute();
const router = useRouter();
//----------- router

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

    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    const ipAddress = data.ip; // Получаем только IP-адрес
    uId.value = await hashString(ipAddress); // Хешируем только IP-адрес

//-------

    // Получаем все забаненные объекты
    const bannedRef = dbRef(database, `banned/${route.params.board}/uIds`);
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
          const banKeyRef = dbRef(database, `banned/${route.params.board}/uIds/${banKey.value}`);
          await remove(banKeyRef); // Удаляем объект по ссылке
          isBanned.value = false
        }
      }
    }

//-------      

    if (isBanned.value === false) {
      if (
        route.params.thread &&
        route.params.board &&
        boards.some((board) => route.params.board.includes(board))
      ) {
        const postId = push(dbRef(database, `${route.params.board}/${route.params.thread}`)).key // Генерация уникального ID

        replies.value = postText.value.match(/#([A-Za-z0-9_-]+)/g)

        loadImg()

        hashedString.value = await hashString(postPassword.value)
        const newPost = {
          name: postName.value ? (postName.value.length > 25 ? postName.value.slice(0, 25) : postName.value) : 'Аноним',
          password: postPassword.value ? hashedString.value : '',
          theme: postTheme.value.length < 45 ? postTheme.value : postTheme.value.slice(0, 25),
          text: (/\s{4,}/.test(postText.value) ? postText.value.replace(/\s{4,}/g, ' ') : postText.value).replace(/[^A-Za-zА-Яа-я0-9\s\w\s.ё—`,:;!?'"<>\\//{}$#(@%^&*_+=)-]/g, ''),
          url: postUrl.value,
          time: new Date().toLocaleTimeString('ru-RU', {
            timeZone: 'Europe/Moscow',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          data: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
          day: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][new Date().getDay()],
          postId: postId,
          threadId: route.params.thread,
          uId: uId.value,
          mimeType: typeof mimeType.value === 'string' ? mimeType.value : ''
        }

        const savedTime = localStorage.getItem('tmlg')
          ? localStorage.getItem('tmlg')
          : localStorage.setItem('tmlg', Date.now() + 6)
        if (savedTime) {
          const currentTimeElapsed = Date.now() - savedTime
          if (currentTimeElapsed >= 5000) {
            if (postText.value.length < 450 && selectedEmoji.value === generatedEmoji.value) {
              // Сохраняем новый пост
              await set(dbRef(database, `${route.params.board}/${route.params.thread}/posts/${postId}`), newPost)
              localStorage.setItem('tmlg', Date.now())
              imagePreview.value = ""

              try {

                const snapshot = await get(dbRef(database, `${route.params.board}/${route.params.thread}`))
                if (snapshot.exists()) {
                  const data = snapshot.val()
                  if (data.lastPostTimestamp != 9999999999999) {
                    // ----------- Обновление lastPostTimestamp в треде ----------- 
                    await update(dbRef(database, `${route.params.board}/${route.params.thread}`), {
                      lastPostTimestamp: Date.now() // Обновляем только метку времени последнего поста
                    })
                  }
                }
              } catch (err) {
                console.error(`Ошибка при обновлении метки последнего поста в треде: `, err)
              }

              // ----------- код обновления reply ----------- 
              if (replies.value && replies.value.length) {
                for (const id of replies.value) {
                  const sId = id.replace('#', '')
                  const postRef = dbRef(database, `${route.params.board}/${route.params.thread}/posts/${sId}`)

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
      } else if (route.params.board && boards.some((board) => route.params.board.includes(board))) {
        const threadId = push(dbRef(database, 'threads')).key // Генерация уникального ID для нового треда
        const postId = push(dbRef(database, `${route.params.board}/${threadId}`)).key // Генерация уникального ID для поста

        hashedString.value = await hashString(postPassword.value)
        const newPost = {
          name: postName.value ? (postName.value.length > 25 ? postName.value.slice(0, 25) : postName.value) : 'Аноним',
          password: postPassword.value ? hashedString.value : '',
          theme: postTheme.value.length < 45 ? postTheme.value : postTheme.value.slice(0, 25),
          text: (/\s{4,}/.test(postText.value) ? postText.value.replace(/\s{4,}/g, ' ') : postText.value).replace(/[^A-Za-zА-Яа-я0-9\s\w\sё—`.,:;!?'"<>\\//{}$#(@%^&*_+=)-]/g, ''),
          url: postUrl.value.length < 1000 ? postUrl.value : '',
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
          uId: uId.value,
          mimeType: typeof mimeType.value === 'string' ? mimeType.value : ''
        }

        const savedTime = localStorage.getItem('tmlg')
          ? localStorage.getItem('tmlg')
          : localStorage.setItem('tmlg', Date.now() + 6)
        if (savedTime) {
          const currentTimeElapsed = Date.now() - savedTime
          if (currentTimeElapsed >= 25000) {
            if (postText.value.length < 450 && (/\.(jpeg|jpg|gif|png|mp4|webm|ogg)$/i.test(postUrl.value) || postUrl.value.includes('fire') ) && selectedEmoji.value === generatedEmoji.value) {
              await set(dbRef(database, `${route.params.board}/${threadId}/posts/${postId}`), newPost)
              imagePreview.value = ""

              // ----------- Установка lastPostTimestamp и 0p для нового треда ----------- 
              await update(dbRef(database, `${route.params.board}/${threadId}`), {
                lastPostTimestamp: Date.now(), // Обновляем только метку времени последнего поста
                op: newPost
              })

              generateEmojis()
              postText.value = ''
              postUrl.value = ''
              postTheme.value = ''

              router.push({ path: `/${route.params.board}/${threadId}` })
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
const emojisPool = ref(['😀', '😂', '😍', '😎', '😢', '🥳', '🤔', '😱', '😴'])
const generatedEmoji = ref(null)
const selectedEmoji = ref(null)
const resultMessage = ref('')
const emojis = ref([]) // Отдельно храним набор для показа

const generateEmojis = () => {
  // Используем исходный набор эмодзи для генерации
  const fullEmojis = [...emojisPool.value]

  // Генерируем случайный эмодзи
  generatedEmoji.value = fullEmojis[Math.floor(Math.random() * fullEmojis.length)]

  // Генерируем три случайных эмодзи, включая сгенерированный
  const randomEmojis = new Set()
  randomEmojis.add(generatedEmoji.value)
  while (randomEmojis.size < 3) {
    randomEmojis.add(fullEmojis[Math.floor(Math.random() * fullEmojis.length)])
  }

  // Перемешиваем эмодзи
  emojis.value = Array.from(randomEmojis).sort(() => Math.random() - 0.5)
  
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
        <div class="relative">
<textarea
          @keyup.shift.enter="sendPost"
          v-model="postText"
          placeholder="post"
          class="w-full text-sm p-2 ring-1 ring-slate-900/10 shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 caret-pink-500 dark:bg-zinc-800 dark:ring-0 dark:highlight-white/5 dark:focus:ring-2 dark:focus:ring-pink-500 dark:focus:bg-zinc-900 dark:text-white"
          rows="4"
        ></textarea>

        <div
          :class="{
            'text-red-500': postText.length > 450,
            'text-zinc-300': postText.length <= 450,
            'select-none': true
          }"
          class="absolute bottom-2 right-2 text-xs"
        >
          {{ postText.length }}/450
        </div>          
      </div>
              
  <div 
    class="w-full p-4 border-dashed border border-gray-300 rounded-md  hover:cursor-pointer text-zinc-500 text-sm"
    @click="openFileDialog"
  >
    <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;" />
    <p v-show="!imagePreview">Нажмите или вставьте изображение из буфера</p>
    <img v-if="imagePreview && /svg|jpeg|jpg|gif|png|JPG|JPEG|GIF|PNG|SVG/.test(postUrl)" :src="imagePreview" alt="Preview" class=" w-1/3 h-auto rounded-2xl" />
    <video v-if="imagePreview && /mp4|webm|ogg/.test(postUrl)" :src="imagePreview"  class=" w-1/3 h-auto rounded-2xl"></video>
   
  </div>

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

           <button v-if="imagePreview"
            @click="imagePreview = '', postUrl = ''"
            class="dark:bg-twitch bg-black text-white rounded-full p-1 w-full lg:w-8"
          >
            X
          </button>          


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
