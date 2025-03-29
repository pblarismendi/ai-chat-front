<script setup lang="ts">
import ChatAI from '@/components/ChatAI.vue';
import Topbar from '@/components/Topbar.vue';
import Sidebar from '@/components/Sidebar.vue';
import { ref, onMounted } from 'vue';
import { authService } from '@/services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const showSidebar = ref(false);

function toggleSidebar() {
  showSidebar.value = !showSidebar.value;
}

// Verificar autenticación
onMounted(() => {
  if (!authService.isAuthenticated()) {
    router.push('/login');
  }
});
</script>

<template>
  <div class="layout-container">
    <Sidebar :class="{ 'open': showSidebar }" />
    <div class="main-content">
      <Topbar @toggle-sidebar="toggleSidebar" />
      <ChatAI />
    </div>
  </div>
</template>

<style>
.layout-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: var(--color-background-soft);
  position: relative;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

@media (min-width: 1024px) {
  .main-content {
    margin-left: 280px; /* Ancho del sidebar */
  }
}

@media (max-width: 1023px) {
  .main-content {
    margin-left: 0;
  }

  .layout-container {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
