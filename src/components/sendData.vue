<script setup>
import { ref, onMounted } from 'vue';
import { database } from '../firebase';
import { ref as dbRef, onValue, push } from 'firebase/database';


// ------------------------------------------------------------------------------------------------------

const newMessage = ref('')
const messages = ref([])

const messagesRef = dbRef(database, 'messages');
const sendMessage = () => {
  const message = {
    text: newMessage.value,
    timestamp: Date.now() // Можно использовать временную метку
  };

  // Запись сообщения в узел 'messages' с использованием push()
  push(messagesRef, message)
    .then(() => {
      newMessage.value = ''; // Очищаем поле ввода
    })
    .catch((error) => {
      console.error("Ошибка при отправке сообщения: ", error);
    });
};

onMounted(() => {
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    messages.value = data ? Object.values(data) : []; // Обновляем сообщения
  });
});

// -------------------------------------------------------------------------------------------------------------

// const messagesRef = dbRef(database, 'messages');

// const writeData = () => {
// set(dbRef(database, String(Date.now())), {
//     username: newMessage.value,
//   });  
// }

// // Подписка на изменения в базе данных
// onMounted(() => {
//   onValue(messagesRef, (snapshot) => {
//     const data = snapshot.val();
//     messages.value = data ? Object.values(data) : []; // Обновляем сообщения
//   });
// });

</script>

<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <span class="timestamp">{{ new Date(message.timestamp).toLocaleTimeString() }}</span>
        <span class="text">{{ message.text }}</span>
      </div>
    </div>
    <div class="input-container">
      <input
        type="text"
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Введите сообщение..."
      />
      <button @click="sendMessage">Отправить</button>
    </div>
  </div>
</template>