<template>
    <div v-if="isVisible" class="loader-overlay">
      <div class="spinner"></div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Create a reactive variable to control loader visibility
  const isVisible = ref(false);
  
  // Functions to show and hide the loader
  const startLoader = () => {
    isVisible.value = true;
  };
  
  const stopLoader = () => {
    isVisible.value = false;
  };
  
  // Provide the loader functions for use outside the component
  defineExpose({
    startLoader,
    stopLoader,
  });
  </script>
  
  <style scoped>
  .loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-top: 5px solid #4caf50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>
  