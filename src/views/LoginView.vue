<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/api';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

// Autenticación con el backend
async function login() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor completa todos los campos';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await authService.login({
      email: email.value,
      password: password.value
    });

    // Guardar datos de autenticación
    authService.saveAuthData(response);

    // Redireccionar al chat
    router.push('/chat');
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'Error en el inicio de sesión';
    }
  } finally {
    isLoading.value = false;
  }
}

function goToRegister() {
  router.push('/register');
}

function goToHome() {
  router.push('/');
}
</script>

<template>
  <div class="login-view">
    <div class="back-button-container">
      <button @click="goToHome" class="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Volver</span>
      </button>
    </div>

    <div class="login-container">
      <div class="login-header">
        <h1>Iniciar Sesión</h1>
        <p>Accede a tu cuenta para usar el chat de IA</p>
      </div>

      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Ingresa tu correo electrónico"
            required
          >
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Ingresa tu contraseña"
            required
          >
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Cargando...</span>
          <span v-else>Iniciar Sesión</span>
        </button>
      </form>

      <div class="register-link">
        ¿No tienes una cuenta?
        <a href="#" @click.prevent="goToRegister">Regístrate</a>
      </div>

      <!-- <div class="demo-info">
        <strong>Credenciales de prueba:</strong>
        <div>Email: demo@example.com</div>
        <div>Contraseña: password</div>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.login-view {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: var(--color-background-mute);
  position: relative;
}

.back-button-container {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 100;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.back-button:hover {
  background-color: var(--vt-c-indigo);
  color: white;
}

.back-icon {
  width: 1.2rem;
  height: 1.2rem;
}

.login-container {
  max-width: 450px;
  width: 100%;
  padding: 2rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: var(--vt-c-indigo);
}

.login-header p {
  color: var(--color-text);
  opacity: 0.8;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
}

.form-group input {
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  border-color: var(--vt-c-indigo);
  box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.2);
}

.error-message {
  padding: 0.75rem;
  background-color: rgba(245, 108, 108, 0.1);
  color: #f56c6c;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid rgba(245, 108, 108, 0.3);
}

.login-button {
  padding: 0.75rem;
  background-color: var(--vt-c-indigo);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #253444;
}

.login-button:disabled {
  background-color: #6c7983;
  cursor: not-allowed;
}

.register-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text);
}

.register-link a {
  color: var(--vt-c-indigo);
  text-decoration: none;
  font-weight: 600;
}

.register-link a:hover {
  text-decoration: underline;
}

.demo-info {
  margin-top: 2rem;
  padding: 1rem;
  background-color: rgba(66, 184, 131, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px dashed #42b883;
}

@media (max-width: 768px) {
  .login-view {
    padding: 1rem;
  }

  .login-container {
    padding: 1.5rem;
  }

  .back-button-container {
    top: 0.5rem;
    left: 0.5rem;
  }

  .back-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .back-icon {
    width: 1rem;
    height: 1rem;
  }
}
</style>
