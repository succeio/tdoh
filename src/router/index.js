// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';

const routes = [

  {
    path: '/:board/:thread?', // Параметры URL: boardState обязательно, threadState опционально
    name: 'id',
    component: App,
    props: true,  // Передаем параметры как пропсы
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;