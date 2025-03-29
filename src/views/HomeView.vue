<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/api';

const router = useRouter();

// Comprobar si el usuario está autenticado
const isLoggedIn = computed(() => {
  return authService.isAuthenticated();
});

// Obtener el nombre del usuario
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
  return null;
});

function goToChat() {
  router.push('/chat');
}

function goToLogin() {
  router.push('/login');
}

function goToRegister() {
  router.push('/register');
}

function logout() {
  authService.logout();
  window.location.reload();
}
</script>

<template>
  <main>
    <div class="home-container">
      <h1 class="home-title">Bienvenido al Asistente IA</h1>

      <!-- Mensaje de bienvenida personalizado para usuarios autenticados -->
      <div v-if="isLoggedIn" class="welcome-user">
        <p>¡Hola, <strong>{{ userName }}</strong>! Ya estás listo para usar nuestro chat inteligente.</p>
        <div class="user-actions">
          <button @click="goToChat" class="action-button primary-button">Ir al Chat</button>
          <button @click="logout" class="action-button secondary-button">Cerrar Sesión</button>
        </div>
      </div>

      <!-- Sección para usuarios no autenticados -->
      <div v-else class="auth-actions">
        <p class="auth-message">Para utilizar nuestro chat inteligente, inicia sesión o regístrate:</p>
        <div class="auth-buttons">
          <button @click="goToLogin" class="auth-button login-button">Iniciar Sesión</button>
          <button @click="goToRegister" class="auth-button register-button">Registrarse</button>
        </div>
      </div>

      <div class="feature-section">
        <div class="feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2>Chat Inteligente</h2>
          <p>Interactúa con nuestra IA para obtener respuestas a tus preguntas de forma rápida y precisa.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2>Respuestas Inteligentes</h2>
          <p>Respuestas generadas por modelos de lenguaje de última generación que entienden el contexto de tus preguntas.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h2>Personalización</h2>
          <p>Interfaz adaptable que se ajusta a tus necesidades y guarda tus preferencias.</p>
        </div>
      </div>

      <div class="cta-section">
        <h2>¿Listo para comenzar?</h2>
        <p>Prueba nuestro chat inteligente y descubre lo que puede hacer por ti.</p>

        <!-- CTA diferente según el estado de autenticación -->
        <button v-if="isLoggedIn" @click="goToChat" class="cta-button">Ir al Chat</button>
        <button v-else @click="goToRegister" class="cta-button">Crear Cuenta</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  height: 100%;
}

.home-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--vt-c-indigo);
  text-align: center;
  margin-bottom: 2rem;
}

/* Estilos para usuario autenticado */
.welcome-user {
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-user p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.user-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.action-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.primary-button {
  background-color: #42b883;
  color: white;
  border: none;
}

.primary-button:hover {
  background-color: #3aa876;
}

.secondary-button {
  background-color: transparent;
  color: var(--vt-c-indigo);
  border: 1px solid var(--vt-c-indigo);
}

.secondary-button:hover {
  background-color: var(--vt-c-indigo);
  color: white;
}

/* Estilos para acciones de autenticación */
.auth-actions {
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 3rem;
}

.auth-message {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.auth-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.auth-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.login-button {
  background-color: var(--vt-c-indigo);
  color: white;
  border: none;
}

.login-button:hover {
  background-color: #253444;
}

.register-button {
  background-color: transparent;
  color: var(--vt-c-indigo);
  border: 1px solid var(--vt-c-indigo);
}

.register-button:hover {
  background-color: var(--vt-c-indigo);
  color: white;
}

.feature-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 4rem;
}

.feature-card {
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 2rem;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  background-color: rgba(66, 184, 131, 0.1);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.icon {
  width: 35px;
  height: 35px;
  color: #42b883; /* Verde de Vue */
}

.feature-card h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--vt-c-indigo);
}

.feature-card p {
  color: var(--color-text);
  line-height: 1.6;
}

.cta-section {
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
}

.cta-section h2 {
  font-size: 2rem;
  font-weight: bold;
  color: var(--vt-c-indigo);
  margin-bottom: 1rem;
}

.cta-section p {
  color: var(--color-text);
  font-size: 1.125rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
  display: inline-block;
  background-color: #42b883; /* Verde de Vue */
  color: white;
  font-weight: bold;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1rem;
}

.cta-button:hover {
  background-color: #3aa876;
}

@media (min-width: 768px) {
  .feature-section {
    grid-template-columns: repeat(3, 1fr);
  }

  .auth-buttons, .user-actions {
    flex-direction: row;
  }
}

@media (max-width: 767px) {
  .home-title {
    font-size: 2rem;
  }

  .auth-buttons, .user-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .welcome-user p, .auth-message {
    font-size: 1.1rem;
  }

  .cta-section h2 {
    font-size: 1.75rem;
  }

  .home-container {
    height: 100vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    touch-action: auto;
    position: relative;
    z-index: 10;
  }

  main {
    height: 100vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
