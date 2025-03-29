<script setup lang="ts">
import { ref } from 'vue';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  loading?: boolean;
}

const userInput = ref('');
const messages = ref<Message[]>([
  // Mensaje inicial de bienvenida
  {
    id: '0',
    type: 'assistant',
    text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?'
  }
]);
const messagesEndRef = ref<HTMLElement | null>(null);
const loading = ref(false);

function scrollToBottom() {
  setTimeout(() => {
    messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

function sendMessage() {
  if (userInput.value.trim() === '') return;

  // Agregar el mensaje del usuario
  const newMessage: Message = {
    id: Date.now().toString(),
    type: 'user',
    text: userInput.value
  };

  messages.value.push(newMessage);
  userInput.value = '';
  scrollToBottom();

  // Agregar mensaje de "pensando" de la IA
  const assistantMessage: Message = {
    id: (Date.now() + 1).toString(),
    type: 'assistant',
    text: '',
    loading: true
  };

  messages.value.push(assistantMessage);
  scrollToBottom();
  loading.value = true;

  // Simular respuesta de la IA con efecto de escritura
  const response = 'Esta es una respuesta simulada de la IA. En una implementación real, aquí se conectaría a una API de un modelo de lenguaje para obtener respuestas.';
  let charIndex = 0;

  setTimeout(() => {
    const interval = setInterval(() => {
      if (charIndex < response.length) {
        assistantMessage.text += response[charIndex];
        assistantMessage.loading = false;
        charIndex++;
        scrollToBottom();
      } else {
        clearInterval(interval);
        loading.value = false;
        scrollToBottom();
      }
    }, 20);
  }, 1000);
}
</script>

<template>
  <div class="chat-container">
    <!-- Header -->
    <div class="chat-header">
      <h1>Chat con IA</h1>
      <p class="subtitle">Consulta lo que necesites saber</p>
    </div>

    <!-- Chat messages -->
    <div class="chat-messages">
      <template v-for="message in messages" :key="message.id">
        <!-- Usuario -->
        <div v-if="message.type === 'user'" class="user-message">
          <div class="message-bubble user-bubble">
            <p>{{ message.text }}</p>
          </div>
          <div class="avatar user-avatar">
            U
          </div>
        </div>

        <!-- IA -->
        <div v-else class="assistant-message">
          <div class="avatar assistant-avatar">
            IA
          </div>
          <div class="message-bubble assistant-bubble">
            <p v-if="message.loading" class="loading-text">
              <span class="dot-animation">...</span>
            </p>
            <p v-else>{{ message.text }}</p>
          </div>
        </div>
      </template>

      <!-- Elemento para desplazamiento automático -->
      <div ref="messagesEndRef"></div>
    </div>

    <!-- Input de mensaje -->
    <div class="input-container">
      <div class="input-wrapper">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Escribe tu mensaje..."
          class="message-input"
          :disabled="loading"
        />
        <button
          @click="sendMessage"
          class="send-button"
          :disabled="loading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="send-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos generales */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 80vh;
  max-width: 768px;
  margin: 0 auto;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

/* Estilos del encabezado */
.chat-header {
  padding: 1rem 1.5rem;
  background-color: var(--vt-c-indigo);
  color: white;
  border-bottom: 1px solid var(--color-border);
}

.chat-header h1 {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
}

.subtitle {
  font-size: 0.875rem;
  margin-top: 0.25rem;
  opacity: 0.8;
}

/* Estilos de los mensajes */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: var(--color-background);
}

/* Estilos de mensajes */
.user-message {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.assistant-message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.message-bubble {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  max-width: 70%;
  word-break: break-word;
}

.user-bubble {
  background-color: var(--vt-c-indigo);
  color: white;
}

.assistant-bubble {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

.user-avatar {
  background-color: var(--vt-c-indigo);
  margin-left: 0.75rem;
}

.assistant-avatar {
  background-color: #42b883; /* Color verde de Vue */
  margin-right: 0.75rem;
}

/* Estilos del formulario */
.input-container {
  padding: 1rem;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-background-soft);
}

.input-wrapper {
  position: relative;
}

.message-input {
  width: 100%;
  padding: 0.75rem;
  padding-right: 3rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: var(--color-background);
  color: var(--color-text);
}

.message-input:focus {
  border-color: var(--vt-c-indigo);
  box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.2);
}

.message-input:disabled {
  background-color: var(--color-background-mute);
  cursor: not-allowed;
}

.send-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text);
  padding: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: color 0.2s;
}

.send-button:hover {
  color: var(--vt-c-indigo);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-icon {
  height: 1.5rem;
  width: 1.5rem;
}

/* Animación de puntos suspensivos */
.loading-text {
  display: flex;
  align-items: center;
}

.dot-animation {
  display: inline-block;
  animation: dotAnimation 1.4s infinite;
}

@keyframes dotAnimation {
  0% { content: "."; }
  33% { content: ".."; }
  66% { content: "..."; }
}

/* Estilos responsivos */
@media (min-width: 1024px) {
  .chat-container {
    height: 70vh;
  }
}
</style>
