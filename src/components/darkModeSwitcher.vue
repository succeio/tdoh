<script setup>
import { ref, watch } from 'vue';

const isDarkMode = ref(false);

// Проверяем сохраненные настройки темы в localStorage
if (localStorage.getItem('dark-mode') === 'true') {
  isDarkMode.value = true;
  document.documentElement.classList.add('dark');
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('dark-mode', 'true');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('dark-mode', 'false');
  }
};

// Слежение за изменением состояния темы
watch(isDarkMode, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>

<template>
  <div>
    <button @click="toggleTheme" class="p-2 bg-gray-200 dark:bg-zinc-900 dark:text-white font-bold rounded">
      {{ isDarkMode ? 'Темная тема' : 'Светлая тема' }}
    </button>
  </div>
</template>