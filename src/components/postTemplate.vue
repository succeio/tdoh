<script setup>
import { database } from '../firebase'
import { ref as dbRef, update, onValue, get, push, remove } from 'firebase/database'
import { computed, ref, inject, onMounted, onBeforeUnmount, watchEffect} from 'vue'
import { useRoute } from 'vue-router';
import { VueShowdown } from 'vue-showdown'

const getPostId = inject('getPostId')

//---------- router
const route = useRoute();
//----------- router

const props = defineProps({
  id: Number,
  theme: String,
  time: String,
  data: String,
  name: String,
  url: String,
  mimeType: String,
  text: String,
  password: String,
  day: String,
  threadId: String,
  postId: String,
  replies: Array
})

//  route.params.board, route.params.thread
const prms = ref('')
const keys = ref([])
const root = localStorage.getItem('xf')

const pin = async (threadId) => {
  prms.value = await hashString(localStorage.getItem('xf'))
  prms.value = await hashString(prms.value)

  const keyRef = dbRef(database, `xf/xx/-O8pvIYAqJwO5UCMrbwv`)

   onValue(keyRef, (snapshot) => {
    const data = snapshot.val()
    keys.value = Object.values(data)
   }) 
  
  if (keys.value[0] == prms.value) {
    const postRef = dbRef(database, `${route.params.board}/${threadId}/op`)
    const snapshot = await get(dbRef(database, `${route.params.board}/${threadId}`))
    if (snapshot.exists()) {
      const data = snapshot.val()
      if (data.lastPostTimestamp !== 9999999999999) {
        console.log(data.lastPostTimestamp)
        await update(dbRef(database, `${route.params.board}/${threadId}`), {
          lastPostTimestamp: 9999999999999 
        })
        await update(postRef, {
          time: "PINNED"
        })        
      } else {
        await update(dbRef(database, `${route.params.board}/${threadId}`), {
          lastPostTimestamp: Date.now()
        })
          await update(postRef, {
          time: "00:00:00"
        })        
      }
    }
  }
}

const del = async (threadId, postId) => {
  prms.value = await hashString(localStorage.getItem('xf'))
  prms.value = await hashString(prms.value)

  const keyRef = dbRef(database, `xf/xx/-O8pvIYAqJwO5UCMrbwv`)

   onValue(keyRef, (snapshot) => {
    const data = snapshot.val()
    keys.value = Object.values(data)
   }) 

  if (keys.value[0] == prms.value){
    const postRef = dbRef(database, `${route.params.board}/${threadId}/posts/${postId}`)
    update(postRef, { text: '*Пост был изъят.*'})
    update(postRef, { url: ''})
    update(postRef, { theme: ''})
    update(postRef, { name: 'Аноним'})
    update(postRef, { password: ''})
    console.log('OK')    
  } else {
    console.log('DENIED')
  }
}

const dAll = async (threadId, postId) => {
  try {
    // Получаем состояние доски и хэшируем параметры
    prms.value = await hashString(localStorage.getItem('xf'));
    prms.value = await hashString(prms.value);

    // Получаем ключи
    const keyRef = dbRef(database, `xf/xx/-O8pvIYAqJwO5UCMrbwv`);
    const keySnapshot = await get(keyRef);
    const keys = keySnapshot.exists() ? Object.values(keySnapshot.val()) : [];

    // Проверяем, совпадает ли первый ключ с параметрами
    if (keys[0] !== prms.value) {
      console.log('DENIED');
      return;
    }

    // Получаем данные поста по postId
    const postRef = dbRef(database, `${route.params.board}/${threadId}/posts/${postId}`);
    const postSnapshot = await get(postRef);

    if (postSnapshot.exists()) {
      const postData = postSnapshot.val();
      const uId = postData.uId; // Получаем значение по ключу 'uId'

      // Получаем все посты по threadId
      const postsRef = dbRef(database, `${route.params.board}/${threadId}/posts/`);
      const postsSnapshot = await get(postsRef);

      if (postsSnapshot.exists()) {
        const posts = postsSnapshot.val();

        // Проходим по всем постам и обновляем те, у которых совпадает uId
        for (const id in posts) {
          if (posts[id].uId === uId) {
            const updateRef = dbRef(database, `${route.params.board}/${threadId}/posts/${id}`);
              await remove(updateRef)
          }
        }

        //заносим uId в бан
        const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 1 день в миллисекундах
        const banData = {
          uId: uId,
          exp: expirationTime
        };
        
        await push(dbRef(database, `banned/${route.params.board}/uIds`), banData)

      } else {
        console.log("Посты не найдены");
      }
    } else {
      console.log("Данные поста не найдены");
    }
  } catch (error) {
    console.error("Ошибка:", error);
  }
};

const hashString = async (input) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex.substring(8, 16)
}

// Проверка, является ли ссылка изображением
const isImage = computed(() => {
  // Проверка на наличие 'image' в URL

  // Проверяем существование props.mimeType перед вызовом startsWith
  const isMimeTypeImage = props.mimeType && typeof props.mimeType === 'string' && props.mimeType.startsWith('image/');
  
  // Проверяем, что props.url существует и является строкой
  const isUrlImage = props.url && typeof props.url === 'string' && /\.(jpeg|jpg|gif|png)$/i.test(props.url);
  
  return isMimeTypeImage || isUrlImage;
});

const isVideo = computed(() => {
   // Проверка по MIME-типу и расширению файла
  const isMimeTypeVideo = props.mimeType && typeof props.mimeType === 'string' && props.mimeType.startsWith('video/');
  const isUrlVideo = props.url && typeof props.url === 'string' && /\.(mp4|webm|ogg)$/i.test(props.url);

  return isMimeTypeVideo || isUrlVideo;
});


const isSoundCloud = computed(() => {
  return /api\.soundcloud\.com/i.test(props.url);  
})

const scLink = ref('')
scLink.value = props.url.match(/(api\.soundcloud\.com\/tracks\/\d+)/i) ? props.url.match(/(api\.soundcloud\.com\/tracks\/\d+)/i) : ''

// Проверка, содержит ли строка youtube.com
const isYouTube = computed(() => {
  return props.url ? props.url.includes('youtube.com') : false
})
const ytLink = ref('')
ytLink.value = props.url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/i) ? props.url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/i)[1] : '';


const passwordMap = ref([{ password: '6da027bf', value: '🍇🌚🍤coyc' }])

// Проверка на совпадение пароля
const isPasswordMatched = computed(() => {
  return passwordMap.value.some((item) => item.password === props.password)
})

// Получение значения в зависимости от пароля
const displayValue = computed(() => {
  const matchedItem = passwordMap.value.find((item) => item.password === props.password)
  return matchedItem ? matchedItem.value : '!' + props.password
})

// Прокрутка к элементу с соответствующим id
const scrollToElement = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })

    // Добавляем класс для подсветки
    element.classList.add('glow-purple')

    // Убираем подсветку через 2 секунды
    setTimeout(() => {
      element.classList.remove('glow-purple')
    }, 2000)

  }
}

// Функция для разбора текста и выделения ссылок
const splitTextWithLinks = computed(() => {
  if (!props.text) return []

  const parts = props.text.split(/(#[A-Za-z0-9_-]+)/g) // Разделяем текст по шаблону #ID
  return parts.map((part) => {
    if (part.startsWith('#')) {
      const id = part.substring(1) // Удаляем символ #
      return { isLink: true, text: part, id }
    } else {
      return { isLink: false, text: part }
    }
  })
})

const repl = (id) => {
  setTimeout(() => {
    const element = document.getElementById(id)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })


    // Добавляем класс для подсветки
    element.classList.add('glow-purple')

    // Убираем подсветку через 2 секунды
    setTimeout(() => {
      element.classList.remove('glow-purple')
    }, 2000)


    } else {
      console.warn(`Element with id "${id}" not found.`)
    }
  }, 100)
}

// Для управления позицией всплывающего поста
const hoverPost = ref(null)
const tooltipPosition = ref({ top: 0, left: 0 })

// Обработчик для отображения поста при наведении
const showPostPreview = (event, postId) => {
  const element = document.getElementById(postId) // Ищем элемент по id
  if (element) {
    const postData = element.querySelector('#postData') // Находим элемент с id="postData"
    const postCore = element.querySelector('#postCore')
    if (postData) {
      // Извлекаем данные из элементов внутри postData
      const postTheme = postData.querySelector('#post-theme')?.innerText || ' '
      const postName = postData.querySelector('#post-name')?.innerText || ' '
      const postPasscode = postData.querySelector('#post-passcode')?.innerText || ' '
      const postTime = postData.querySelector('#post-time')?.innerText || ' '
      const postDate = postData.querySelector('#post-date')?.innerText || ' '

      // Извлекаем содержимое всех элементов с data-post-text
      const postTextElements = postCore.querySelectorAll('[data-post-text]')
      const postText =
        Array.from(postTextElements)
          .map((el) => el.innerText.trim()) // Извлекаем и очищаем текст
          .filter((text) => text.length > 0) // Фильтруем пустые тексты
          .join(' ') || '' // Объединяем все тексты в один

      // Сохраняем данные в hoverPost для отображения в тултипе
      hoverPost.value = {
        postId,
        theme: postTheme,
        text: postText,
        name: postName,
        time: postTime,
        data: postDate,
        passcode: postPasscode
      }

      // Устанавливаем позицию тултипа рядом с курсором
      tooltipPosition.value = { top: event.clientY + 10, left: event.clientX + 10 }
    } else {
      console.warn(`Элемент с id "postData" не найден внутри поста с id ${postId}.`)
    }
  } else {
    //console.warn(`Элемент с id ${postId} не найден.`)
  }
}

const hidePostPreview = () => {
  hoverPost.value = null
}

const updateTooltipPosition = (event) => {
  tooltipPosition.value = { top: event.clientY + 10, left: event.clientX + 10 }
}


// При монтировании проверяем и добавляем обработчики
onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  window.addEventListener('mousemove', updateTooltipPosition);
});

// При уничтожении компонента удаляем обработчики
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
  window.removeEventListener('mousemove', updateTooltipPosition);
});

const isEnlarged = ref(false); // Using the Composition API

const videoElement = ref(null); // Референс на видео элемент

// const toggleImageSize = () => {
//   isEnlarged.value = !isEnlarged.value; // Toggle the state

//     if (videoElement.value) {
//     if (!isEnlarged.value) {
//       videoElement.value.play();  // Воспроизводим, если увеличено
//     } else {
//       videoElement.value.pause(); // Останавливаем, если уменьшено
//     }
//   }
// };

const toggleImageSize = async () => {
  isEnlarged.value = !isEnlarged.value; // Переключаем состояние
  const video = videoElement.value; // Получаем видео элемент

  if (!video) {
    //console.error("Video element is null");
    return; // Если видео элемента нет, ничего не делаем
  }

  if (!isEnlarged.value) {
    try {
      await video.play(); // Пробуем воспроизвести видео
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Video play request was interrupted.');
      } else {
        console.error('Error playing video:', error);
      }
    }
  } else {
    video.pause(); // При сворачивании останавливаем воспроизведение
  }
};

const handleVideoEnded = () => {
  isEnlarged.value = false; // Сбрасываем состояние на уменьшенное
  const video = videoElement.value;
  
  if (video) {
    video.pause(); // Останавливаем видео
  }
};


const isMobile = ref(false); // Флаг для мобильных устройств

// Проверка ширины экрана для мобильных устройств
const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 640; // Мобильное устройство если <= 640px
};

// Автоматическое обновление состояния экрана
watchEffect(() => {
  checkScreenSize();
});

</script>

<template>
  <div
    :id="postId"
    class=" max-w-fit w-full sm:w-auto mt-2 bg-zinc-200 dark:text-zinc-200 p-2 rounded-2xl dark:bg-zinc-900" 
    :class="{
      'sm:w-2/3': props.text.length > 150,
      'ml-2': props.id !== 0,
      'border-twitch border-l-2 dark:border-twitch dark:border-l-2': props.id === 0
    }"
  >
    <div id="postData" class="flex flex-wrap gap-1 text-sm sm:text-base">
      <p id="post-theme" class="font-sans font-bold">{{ theme }}</p>
      <p
        id="post-name"
        :class="{
          'text-twitch': props.password === '73fd4da4',
          'font-bold': props.password === '73fd4da4'
        }"
      >
        {{ name }}
      </p>
      <p
        id="post-passcode"
        v-if="props.password"
        :class="{ 'text-twitch': isPasswordMatched, 'font-bold': isPasswordMatched }"
      >
        {{ displayValue }}
      </p>
      <p id="post-time">{{ time === 'PINNED' ? '00:00:00' : time }}</p>
      <p v-if="props.day">{{ day }}</p>
      <p id="post-date">{{ data }}</p>
      <p @click="getPostId(postId)" class="hover:text-twitch cursor-pointer">
        #{{ postId ? postId.slice(12, 20) : postId }}
      </p>
      <p class="hover:text-twitch cursor-pointer text-green-600">
        {{ id === 0 ? '' : id }}
      </p>

      <p
        v-if="time === 'PINNED'"
        class=""
      >
        <img
          src="../assets/pin.svg"
          alt="Icon"
          class="h-5 w-5 dark:rounded-2xl dark:bg-twitch select-none"
        />
      </p>

      <p
        v-if="id === 0 && !route.params.thread"
        
        
        class="hover:cursor-pointer"
      >
      <router-link :to="`/${route.params.board}/${props.threadId}`">
        <img
          src="../assets/right-circle.svg"
          alt="Icon"
          class="h-5 w-5 dark:rounded-2xl dark:bg-twitch"
        />
      </router-link>
      </p>
      <p
        v-show="root"
        @click="del(props.threadId, props.postId)"
        class="font-bold hover:cursor-pointer hover:text-red-600"
      >
        X
      </p>
      <p
        v-show="root"
        @click="dAll(props.threadId, props.postId)"
        class="font-bold hover:cursor-pointer hover:text-red-600"
      >
        F
      </p>
      <p
        v-show="root"
        v-if="id === 0"
        @click="pin(props.threadId)"
        class="font-bold hover:cursor-pointer hover:text-red-600"
      >
        P
      </p>      
    </div>

    <div class="gap-2 flex flex-col sm:flex-row">
      <div v-show="props.url"  class="gap-2 mt-2 relative">
  <img
    v-if="isImage"
    :class="[ 
      'transition-all duration-150 bg-white rounded-2xl cursor-pointer',
      //isEnlarged ? 'w-80 sm:max-w-2xl' : 'w-48 sm:max-w-xs'
      isEnlarged ? 'w-full sm:max-w-2xl' : 'w-48 sm:max-w-xs'
    ]"
    :src="url"
    alt="post-pic"
    @click="toggleImageSize"
  />

  <video
    v-if="isVideo"
    ref="videoElement"  
    :class="[
      'transition-all duration-150 bg-white rounded-2xl cursor-pointer',
      isEnlarged ? 'w-full sm:max-w-2xl' : 'w-full sm:max-w-xs'
    ]"
    :src="url"
    controls
    volume="0.1"
    @click="toggleImageSize"
    @ended="handleVideoEnded"
  ></video>

        <iframe
          class="rounded-2xl w-full"
          v-if="isSoundCloud"
          height="200"
          scrolling="no"
          frameborder="no"
          allow="autoplay"
          :src="`https://w.soundcloud.com/player/?url=https%3A//${scLink[0]}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`"
        ></iframe>

        <iframe
          class="rounded-2xl w-full"
          v-if="isYouTube"
          width="100%"
          height="200"
          :src="`https://www.youtube.com/embed/${ytLink}`"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>

      <!-- Text with processed links -->
      <div id="postCore" class="max-w-prose">
        <p class="ml-2 pt-2 whitespace-normal break-words text-sm sm:text-base">
          <span v-for="(part, index) in splitTextWithLinks" :key="index">
            <span
              v-if="part.isLink"
              @click="scrollToElement(part.id)"
              @mouseover="showPostPreview($event, part.id)"
              @mouseleave="hidePostPreview"
              class="text-twitch hover:underline cursor-pointer"
              >{{ '#' + part.text.slice(13, 21) }}</span
            >

            <div :data-post-text="index" v-else class="whitespace-normal break-words markdown">
              <vue-showdown :markdown="part.text" />
            </div>
          </span>
        </p>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 ml-4 mt-2">
      <div v-for="reply in props.replies" :key="reply.id">
        <p
          class="cursor-pointer hover:text-twitch"
          @click="repl(reply)"
          @mouseover="showPostPreview($event, reply)"
          @mouseleave="hidePostPreview"
        >
          #{{ reply ? reply.slice(13, 20) : '' }}
        </p>
      </div>
    </div>

  <!-- Tooltip показывается только если есть hoverPost и это не мобильное устройство -->
  <div
    v-if="hoverPost && !isMobile"
    :style="{ top: tooltipPosition.top + 'px', left: tooltipPosition.left + 'px' }"
    class="fixed bg-black dark:bg-twitch text-white p-2 rounded-2xl shadow-lg max-w-md z-50"
  >
    <!-- Верхняя часть всплывающего окна с информацией о посте -->
    <div class="flex flex-wrap gap-1">
      <p>{{ hoverPost.theme }}</p>
      <p>{{ hoverPost.name }}</p>
      <p>{{ hoverPost.passcode }}</p>
      <p>{{ hoverPost.time }}</p>
      <p>{{ hoverPost.data }}</p>
      <p>#{{ hoverPost.postId.slice(12, 20) }}</p>
    </div>

    <!-- Текст поста -->
    <div>      
      <p class="pl-4 pt-2 pb-2">{{ hoverPost.text }}</p>
    </div>
  </div>
  </div>
</template>