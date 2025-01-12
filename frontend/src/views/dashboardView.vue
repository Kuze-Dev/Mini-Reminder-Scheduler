<script setup>
import headerComponent from '../components/headerComponent.vue';
import footerComponent from '../components/footerComponent.vue';

const stats = [
  { title: 'Users', count: 245, icon: '👤', color: 'bg-blue-100 text-blue-600' },
  { title: 'Alarms Set', count: 35, icon: '⏰', color: 'bg-red-100 text-red-600' },
  { title: 'Schedules', count: 12, icon: '📅', color: 'bg-purple-100 text-purple-600' },
  { title: 'Tasks Completed', count: 98, icon: '✅', color: 'bg-green-100 text-green-600' },
  { title: 'Notifications', count: 17, icon: '🔔', color: 'bg-yellow-100 text-yellow-600' },
  { title: 'Messages', count: 50, icon: '💬', color: 'bg-gray-100 text-gray-600' },
];
</script>

<template>
  <main class="w-full min-h-screen bg-gray-50 flex flex-col">
    <headerComponent />

    <!-- Dashboard Content -->
    <section class="flex-grow container mx-auto mt-[80px] px-6 py-10">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Statistics Cards -->
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="bg-white shadow-lg rounded-lg p-6 flex items-center hover:shadow-xl transition duration-200 h-56"
        >
          <!-- Icon -->
          <div
            :class="['w-20 h-20 flex items-center justify-center rounded-full', stat.color]"
          >
            <span class="text-4xl">{{ stat.icon }}</span>
          </div>

          <!-- Content -->
          <div class="ml-6">
            <h2 class="text-3xl font-bold text-gray-700">{{ stat.count }}</h2>
            <p class="text-lg text-gray-500">{{ stat.title }}</p>
          </div>
        </div>
      </div>
    </section>

    <footerComponent />
  </main>
</template>
