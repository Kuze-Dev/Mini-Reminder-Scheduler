<script setup>
import { ref, onMounted } from 'vue';
import axios from '../../axios'; // Ensure axios is properly configured or imported
import { useAuthStore } from '@/stores/store.js';
import { decodeJWT } from '@/stores/decode.js';

const store = useAuthStore();
const userId = ref(null);

// Decode the JWT token to extract user ID
if (store.token) {
  const decodeToken = decodeJWT(store.token);
  userId.value = decodeToken.user_id;
  console.log('User ID:', userId.value);
}

// State to store user data
const users = ref([]);

// Fetch profile data
const fetchProfileData = async () => {
  try {
    const response = await axios.get(`/user/${userId.value}`);
    users.value = response.data.results;
    console.log('Users:', users.value);
  } catch (error) {
    alert('Error Fetching Users Profile: ' + error.message);
  }
};

// Fetch data when the component is mounted
onMounted(() => {
  fetchProfileData();
});
</script>

<template>
  <header class="  py-4 px-6   shadow-md bg-white flex justify-between ">
    <!-- Logo -->
    <div class="text-lg font-bold mt-1">KRM</div>

    <!-- User Info -->
    <div class="lg:block xl:block hidden space-x-4">
      <div v-for="user in users" :key="user.user_id" class="flex items-center space-x-4">
        <!-- User Name -->
        <div>
          <p class="text-sm font-semibold">{{ user.firstname}}</p>
        </div>

        <!-- User Profile Image -->
        <div>
          <img
  :src="`http://localhost:3000/uploads/${user.profileImage}`"
  alt="User Profile Image"
  class="w-10 h-10 rounded-full border-2 border-white"
/>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Button -->
    <button class="md:hidden">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </button>
  </header>
</template>
