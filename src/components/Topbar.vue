<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/api';

defineOptions({
  name: 'ChatTopbar'
});

const router = useRouter();
const showUserMenu = ref(false);

// Obtener información del usuario
const userName = computed(() => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.username || 'Usuario';
    } catch {
      return 'Usuario';
    }
  }
  return 'Usuario';
});

function goToHome() {
  router.push('/');
}

function logout() {
  authService.logout();
  router.push('/login');
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value;
}

// Emit evento para alternar sidebar
function toggleSidebar() {
  emit('toggle-sidebar');
}

const emit = defineEmits(['toggle-sidebar']);
</script>

<template>
  <div class="topbar">
    <div class="left-section">
      <!-- Botón para mostrar sidebar en móvil y tablet -->
      <button @click="toggleSidebar" class="sidebar-toggle">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <button @click="goToHome" class="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Volver</span>
      </button>
    </div>

    <div class="right-section">
      <div class="user-profile" @click="toggleUserMenu">
        <div class="avatar">{{ userName.charAt(0) }}</div>
        <span class="user-name">{{ userName }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>

        <!-- Menú desplegable de usuario -->
        <div v-if="showUserMenu" class="user-menu">
          <button @click="logout" class="logout-button">
            <svg xmlns="http://www.w3.org/2000/svg" class="logout-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--vt-c-indigo);
  color: white;
  z-index: 100;
  width: 100%;
  position: sticky;
  top: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.left-section, .right-section {
  display: flex;
  align-items: center;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: transparent;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.9rem;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.back-icon {
  width: 1.2rem;
  height: 1.2rem;
}

.sidebar-toggle {
  display: none;
  background-color: transparent;
  border: none;
  color: white;
  padding: 0.5rem;
  margin-right: 0.5rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.sidebar-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-toggle .icon {
  width: 1.5rem;
  height: 1.5rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;
}

.user-profile:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: var(--vt-c-indigo-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
}

.arrow-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s;
}

.user-profile:hover .arrow-icon {
  transform: rotate(180deg);
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  margin-top: 0.5rem;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  border: none;
  background-color: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #f56c6c;
  font-size: 0.9rem;
  text-align: left;
}

.logout-button:hover {
  background-color: rgba(245, 108, 108, 0.1);
}

.logout-icon {
  width: 1.2rem;
  height: 1.2rem;
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .sidebar-toggle {
    display: block;
  }

  .back-button {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }

  .user-name {
    display: none;
  }

  .avatar {
    width: 1.8rem;
    height: 1.8rem;
    font-size: 0.9rem;
  }

  .user-menu {
    width: 160px;
    right: -10px;
  }
}

@media (max-width: 480px) {
  .back-button span {
    display: none;
  }

  .back-icon {
    width: 1.4rem;
    height: 1.4rem;
  }
}

@media (min-width: 1024px) {
  .sidebar-toggle {
    display: none;
  }
}
</style>
