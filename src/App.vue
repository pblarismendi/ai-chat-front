<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
:root {
  --max-width-content: 1400px;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Estilos generales responsivos */
@media (max-width: 768px) {
  #app {
    padding: 0;
  }

  /* Permitir scroll cuando sea necesario en dispositivos móviles */
  html, body {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-y: none; /* Prevenir el efecto de rebote del scroll */
  }

  #app {
    min-height: 100vh;
    overflow-y: auto;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: var(--max-width-content);
    margin: 0 auto;
  }
}
</style>
