<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { isApiConfigured, sendChatMessage, createChatRequest } from '../services/api';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  loading?: boolean;
  processedText?: {
    main: string;
    thinking: string[];
  };
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
const error = ref<string | null>(null);

onMounted(() => {
  // Verificar que tenemos la URL de la API configurada
  if (!isApiConfigured()) {
    error.value = 'Error: La URL de la API no está configurada. Por favor verifica el archivo .env';
    console.error('Error: VITE_API_BASE_URL no está definida en el archivo .env');
  }

  // Manejar el scroll en dispositivos móviles
  const chatMessages = document.querySelector('.chat-messages');
  if (chatMessages) {
    chatMessages.addEventListener('touchstart', (e) => {
      e.stopPropagation();
    }, { passive: true });

    chatMessages.addEventListener('touchmove', (e) => {
      e.stopPropagation();
    }, { passive: true });
  }

  // Iniciar con scroll al fondo
  scrollToBottom();
});

function scrollToBottom() {
  setTimeout(() => {
    if (messagesEndRef.value) {
      messagesEndRef.value.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });

      // Hack para iOS Safari
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        const scrollHeight = chatMessages.scrollHeight;
        chatMessages.scrollTop = scrollHeight;
      }
    }
  }, 100);
}

// Función para procesar el texto y extraer las etiquetas <think>
function processText(text: string) {
  const thinkRegex = /<think>([\s\S]*?)<\/think>/g;
  const thinking: string[] = [];
  let mainText = text;

  // Extraer contenido de etiquetas <think>
  let match;
  while ((match = thinkRegex.exec(text)) !== null) {
    thinking.push(match[1].trim());
  }

  // Eliminar etiquetas <think> del texto principal
  mainText = text.replace(thinkRegex, '');

  return {
    main: mainText.trim(),
    thinking
  };
}

async function sendMessage() {
  if (userInput.value.trim() === '') return;

  // Limpiar mensaje de error previo
  error.value = null;

  // Agregar el mensaje del usuario
  const newMessage: Message = {
    id: Date.now().toString(),
    type: 'user',
    text: userInput.value
  };

  messages.value.push(newMessage);

  // Guardar el input y limpiarlo
  const userQuestion = userInput.value;
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

  try {
    // Crear la petición con el mensaje del usuario
    const chatRequest = createChatRequest(userQuestion);

    // Enviar la petición a la API
    const responseData = await sendChatMessage(chatRequest);

    // Extraer la respuesta de la IA
    let aiResponse = '';
    if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message) {
      aiResponse = responseData.choices[0].message.content;
    } else {
      aiResponse = 'Lo siento, no pude generar una respuesta.';
    }

    // Procesar la respuesta para extraer las etiquetas <think>
    const processedResponse = processText(aiResponse);
    assistantMessage.processedText = processedResponse;

    // Simulamos el efecto de escritura solo para el texto principal
    let charIndex = 0;
    const fullText = aiResponse; // Guardamos el texto completo para procesarlo después
    const typeInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        assistantMessage.text = fullText.substring(0, charIndex + 1);
        assistantMessage.loading = false;
        charIndex++;
        scrollToBottom();
      } else {
        clearInterval(typeInterval);
        loading.value = false;
        // Asignar el texto completo y procesado al finalizar
        assistantMessage.text = fullText;
        scrollToBottom();
      }
    }, 15);

  } catch (err) {
    console.error('Error al comunicarse con la API:', err);
    assistantMessage.loading = false;

    // Mostrar un mensaje de error al usuario
    if (err instanceof Error) {
      assistantMessage.text = `Lo siento, ocurrió un error: ${err.message}`;
      error.value = err.message;
    } else {
      assistantMessage.text = 'Lo siento, ocurrió un error desconocido al conectar con el servicio.';
      error.value = 'Error desconocido';
    }

    loading.value = false;
  }
}
</script>

<template>
  <div class="chat-container">
    <!-- Mensaje de error, si existe -->
    <div v-if="error" class="error-banner">
      <p>{{ error }}</p>
      <button @click="error = null" class="close-error">×</button>
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
            <div v-if="message.loading" class="loading-text">
              <span class="dot-animation">...</span>
            </div>
            <div v-else>
              <!-- Renderiza los mensajes originales mientras se están escribiendo -->
              <template v-if="message.processedText && !message.loading">
                <!-- Primero mostramos los bloques de razonamiento -->
                <div v-if="message.processedText.thinking.length > 0" class="thinking-container">
                  <div v-for="(thought, index) in message.processedText.thinking"
                       :key="index"
                       class="thinking-block">
                    <div class="thinking-header">Razonamiento:</div>
                    <p>{{ thought }}</p>
                  </div>
                </div>
                <!-- Luego mostramos la respuesta principal -->
                <div class="main-response">
                  <p>{{ message.processedText.main }}</p>
                </div>
              </template>
              <!-- Renderiza el texto plano para mensajes sin procesar -->
              <p v-else>{{ message.text }}</p>
            </div>
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
  height: 100vh;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  background-color: var(--color-background-soft);
  box-shadow: none;
  overflow: hidden;
  border: none;
}

/* Mensaje de error */
.error-banner {
  background-color: #f56c6c;
  color: white;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-error {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0 0.5rem;
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
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
  max-width: 800px;
  -webkit-overflow-scrolling: touch; /* Para mejorar el scroll en iOS */
  overscroll-behavior-y: contain; /* Previene scroll de rebote */
  height: 100%;
  touch-action: auto; /* Asegura que los gestos táctiles funcionen */
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
  max-width: 90%;
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

/* Contenedor para los bloques de razonamiento */
.thinking-container {
  margin-bottom: 1rem;
}

/* Estilo para los bloques de pensamiento */
.thinking-block {
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  border: 2px dashed #42b883;
  border-radius: 6px;
  background-color: rgba(66, 184, 131, 0.05);
  font-size: 0.95em;
  color: #444;
  position: relative;
}

.thinking-header {
  font-weight: bold;
  color: #42b883;
  margin-bottom: 0.5rem;
  font-size: 0.9em;
  text-transform: uppercase;
}

.thinking-block p {
  margin: 0;
}

/* Estilo para la respuesta principal */
.main-response {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-border);
}

.main-response p {
  margin: 0;
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
@media (max-width: 768px) {
  .chat-container {
    width: 100%;
    height: 100vh;
    border-radius: 0;
    border: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }

  .chat-messages {
    max-width: 100%;
    padding: 1rem 0.75rem;
    height: calc(100% - 60px); /* Espacio para el input */
  }

  .message-bubble {
    max-width: 90%;
  }

  .thinking-block {
    padding: 0.5rem;
  }

  .input-container {
    padding: 0.75rem;
    position: relative;
    z-index: 2;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .chat-messages {
    padding: 1.5rem 2rem;
    max-width: 760px;
  }

  .message-bubble {
    max-width: 80%;
  }
}

@media (min-width: 1024px) {
  .chat-container {
    max-width: 100%;
    margin: 0 auto;
    box-shadow: none;
    border-radius: 0;
    height: calc(100vh - 60px); /* Restar la altura del topbar */
    margin-top: 0;
    margin-bottom: 0;
    border: none;
  }

  .chat-messages {
    padding: 1.5rem 2rem;
    max-width: 900px;
  }

  .message-bubble {
    max-width: 75%;
  }
}

@media (min-width: 1200px) {
  .chat-messages {
    padding: 2rem;
    max-width: 1000px;
  }

  .message-bubble {
    max-width: 65%;
  }
}
</style>

