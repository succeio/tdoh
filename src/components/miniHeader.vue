<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const isVisible = ref(false);
const isScrollDownVisible = ref(false);

const handleScroll = () => {
  isVisible.value = window.scrollY > 400; // 
  isScrollDownVisible.value = window.scrollY < document.body.scrollHeight - window.innerHeight - 400; // Показывать кнопку "Вниз", если не внизу страницы
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
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
      class="fixed top-4 right-4 dark:bg-twitch bg-black text-white rounded-2xl min-w-24 p-1 z-50 opacity-15 hover:opacity-25"
    >
      Наверх
    </button>

    <button
      v-if="isScrollDownVisible"
      @click="scrollToBottom"
      class="fixed bottom-4 right-4 dark:bg-twitch bg-black text-white rounded-2xl min-w-24 p-1 z-50 opacity-15 hover:opacity-25"
    >
      Вниз
    </button>
  </div>
</template>

