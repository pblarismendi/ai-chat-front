<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: 'ChatSidebar'
});

// Simular datos de historial de chats
const chatHistory = ref([
  { id: 1, title: 'Consulta sobre Vue.js', date: '15 Jun 2023', active: true },
  { id: 2, title: 'Pregunta sobre APIs', date: '14 Jun 2023', active: false },
  { id: 3, title: 'Ayuda con CSS Flexbox', date: '10 Jun 2023', active: false },
  { id: 4, title: 'Información sobre TypeScript', date: '8 Jun 2023', active: false },
]);

const isOpen = ref(false);

function toggleSidebar() {
  isOpen.value = !isOpen.value;
}

function selectChat(chatId: number) {
  // Marcar el chat seleccionado como activo
  chatHistory.value.forEach(chat => {
    chat.active = chat.id === chatId;
  });

  // En una implementación real, aquí cargaríamos el chat seleccionado
  console.log('Chat seleccionado:', chatId);

  // En móvil, cerrar sidebar al seleccionar
  if (window.innerWidth < 768) {
    isOpen.value = false;
  }
}

// Crear nuevo chat
function newChat() {
  console.log('Crear nuevo chat');
  // Implementación: resetear el chat actual o redirigir a una nueva conversación
}
</script>

<template>
  <div class="sidebar-container" :class="{ 'open': isOpen }">
    <!-- Botón para abrir/cerrar en móvil -->
    <button @click="toggleSidebar" class="toggle-sidebar">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path v-if="isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Contenido del sidebar -->
    <div class="sidebar-content">
      <div class="sidebar-header">
        <h2>Historial de Chats</h2>
        <button @click="newChat" class="new-chat-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Chat
        </button>
      </div>

      <div class="chat-list">
        <div
          v-for="chat in chatHistory"
          :key="chat.id"
          class="chat-item"
          :class="{ 'active': chat.active }"
          @click="selectChat(chat.id)"
        >
          <div class="chat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div class="chat-info">
            <div class="chat-title">{{ chat.title }}</div>
            <div class="chat-date">{{ chat.date }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay para cerrar en móvil al hacer clic fuera -->
    <div v-if="isOpen" class="sidebar-overlay" @click="toggleSidebar"></div>
  </div>
</template>

<style scoped>
.sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background-color: var(--color-background);
  border-right: 1px solid var(--color-border);
  z-index: 1000;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding-top: 60px; /* Espacio para el topbar */
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  background-color: var(--color-background);
  z-index: 5;
}

.sidebar-header h2 {
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  color: var(--color-heading);
}

.new-chat-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.9rem;
}

.new-chat-btn:hover {
  background-color: var(--color-background-mute);
}

.new-chat-btn .icon {
  width: 1.2rem;
  height: 1.2rem;
}

.chat-list {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  flex: 1;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-item:hover {
  background-color: var(--color-background-mute);
}

.chat-item.active {
  background-color: var(--color-background-soft);
  border-left: 3px solid var(--vt-c-indigo);
}

.chat-icon {
  margin-right: 0.75rem;
}

.chat-icon .icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-text);
}

.chat-info {
  flex: 1;
  overflow: hidden;
}

.chat-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-text);
}

.chat-date {
  font-size: 0.8rem;
  color: var(--color-text-light);
  margin-top: 0.25rem;
}

.toggle-sidebar {
  display: none;
  position: absolute;
  top: 1rem;
  right: -3rem;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
}

.toggle-sidebar .icon {
  width: 1.5rem;
  height: 1.5rem;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Estilos responsivos */
@media (max-width: 1023px) {
  .sidebar-container {
    transform: translateX(-100%);
    width: 250px;
  }

  .sidebar-container.open {
    transform: translateX(0);
  }

  .toggle-sidebar {
    display: flex;
  }

  .sidebar-overlay {
    display: block;
  }
}

@media (min-width: 1024px) {
  .sidebar-content {
    padding-top: 0;
  }

  .sidebar-header {
    top: 0;
  }
}
</style>
