import './assets/main.css'

import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { createApp } from 'vue'
import App from './App.vue'

// Импортируем маршрутизатор
import router from './router';

import { VueShowdownPlugin } from 'vue-showdown';

const app = createApp(App)

app.use(autoAnimatePlugin)

app.use(VueShowdownPlugin, {
  options: {
    simpleLineBreaks: true, // Обрабатываем простые разрывы строк
    openLinksInNewWindow: true, // Открывать ссылки в новом окне
    tables: true,  // Включить поддержку таблиц (если нужно)
    ghCodeBlocks: true, // Поддержка GitHub-стиля блоков кода
    backslashEscapesHTMLTags: false, // Отключаем экранирование HTML тегов
    parseImgDimensions: true, // Парсинг размеров изображений
    strikethrough: true, // Поддержка зачёркнутого текста
    tasklists: true, // Поддержка task lists
  }
})

app.use(router)

app.mount('#app')
