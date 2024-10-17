<template>
  <div v-if="visible" class="fixed top-16 right-4  text-white p-3 text-sm rounded-3xl shadow-lg max-w-sm bg-black dark:bg-twitch select-none">
    {{ message }}
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  message: String,   // текст сообщения
  trigger: Number,   // триггер для повторного показа ошибки
});

const visible = ref(false);  // контролируем видимость сообщения

// Следим за изменениями триггера
watch(
  () => props.trigger,
  () => {
    if (props.message) {
      visible.value = true;   // показываем сообщение
      // Убираем сообщение через 3 секунды
      setTimeout(() => {
        visible.value = false;
      }, 3000);
    }
  }
);
</script>
