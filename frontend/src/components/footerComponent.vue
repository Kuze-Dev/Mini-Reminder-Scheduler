<script setup>
import { computed } from 'vue';

// Compute the current year dynamically
const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
  <footer class=" py-4  bottom-0 w-full  flex justify-center items-center">
    <p class="text-sm">
      &copy; {{ currentYear }} <span class="font-semibold">KRM</span>. All Rights Reserved.
    </p>
  </footer>
</template>
