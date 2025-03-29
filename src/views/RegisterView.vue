<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/api';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const registerSuccess = ref(false);

// Registro con el backend
async function register() {
  // Validaciones básicas
  if (!username.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Por favor completa todos los campos';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await authService.register({
      username: username.value,
      email: email.value,
      password: password.value
    });

    // Registro exitoso
    registerSuccess.value = true;

    // Guardar datos de autenticación
    authService.saveAuthData(response);

    // Después de 2 segundos, redireccionamos al chat
    setTimeout(() => {
      router.push('/chat');
    }, 2000);
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'Error en el registro';
    }
  } finally {
    isLoading.value = false;
  }
}

function goToLogin() {
  router.push('/login');
}

function goToHome() {
  router.push('/');
}
</script>

<template>
  <div class="register-view">
    <div class="back-button-container">
      <button @click="goToHome" class="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Volver</span>
      </button>
    </div>

    <div class="register-container">
      <div v-if="registerSuccess" class="success-message">
        <svg xmlns="http://www.w3.org/2000/svg" class="success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <h2>¡Registro Exitoso!</h2>
        <p>Tu cuenta ha sido creada correctamente. Serás redirigido al chat...</p>
      </div>

      <template v-else>
        <div class="register-header">
          <h1>Registro</h1>
          <p>Crea una cuenta para usar el chat de IA</p>
        </div>

        <form @submit.prevent="register" class="register-form">
          <div class="form-group">
            <label for="username">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              v-model="username"
              placeholder="Ingresa tu nombre de usuario"
              required
            >
          </div>

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

          <div class="form-group">
            <label for="confirmPassword">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="Confirma tu contraseña"
              required
            >
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            class="register-button"
            :disabled="isLoading"
          >
            <span v-if="isLoading">Cargando...</span>
            <span v-else>Registrarse</span>
          </button>
        </form>

        <div class="login-link">
          ¿Ya tienes una cuenta?
          <a href="#" @click.prevent="goToLogin">Inicia sesión</a>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.register-view {
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

.register-container {
  max-width: 450px;
  width: 100%;
  padding: 2rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: var(--vt-c-indigo);
}

.register-header p {
  color: var(--color-text);
  opacity: 0.8;
}

.register-form {
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

.success-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
}

.success-icon {
  width: 4rem;
  height: 4rem;
  color: #42b883;
  margin-bottom: 1rem;
}

.success-message h2 {
  color: #42b883;
  margin-bottom: 1rem;
}

.success-message p {
  color: var(--color-text);
}

.register-button {
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

.register-button:hover {
  background-color: #253444;
}

.register-button:disabled {
  background-color: #6c7983;
  cursor: not-allowed;
}

.login-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text);
}

.login-link a {
  color: var(--vt-c-indigo);
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .register-view {
    padding: 1rem;
  }

  .register-container {
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
