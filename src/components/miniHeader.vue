<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const isVisible = ref(false);
const isScrollDownVisible = ref(false);

const handleScroll = () => {
  isVisible.value = window.scrollY > 400;
  const isAtBottom = window.scrollY >= document.body.scrollHeight - window.innerHeight;
  isScrollDownVisible.value = !isAtBottom;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // Принудительно проверяем размеры страницы после загрузки
  if (document.body.scrollHeight > window.innerHeight) {
    isScrollDownVisible.value = true; // Кнопка вниз должна отображаться сразу, если страница больше экрана
  }
  handleScroll(); // Проверяем положение после загрузки
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div>
    <!-- Ваш контент здесь -->

    <button
      v-if="isVisible"
      @click="scrollToTop"
      class="fixed top-6 right-6 dark:bg-twitch text-white rounded-full p-0 z-50 opacity-35 hover:opacity-55"
    >
      <img
        src="../assets/up.svg"
        alt="Icon"
        class="h-8 w-8 dark:rounded-full dark:bg-twitch"
      />
    </button>

    <button
      v-if="isScrollDownVisible"
      @click="scrollToBottom"
      class="fixed bottom-6 right-6 dark:bg-twitch text-white rounded-full p-0 z-50 opacity-35 hover:opacity-55"
    >
      <img
        src="../assets/down.svg"
        alt="Icon"
        class="h-8 w-8 dark:rounded-full dark:bg-twitch"
      />
    </button>
  </div>
</template>
