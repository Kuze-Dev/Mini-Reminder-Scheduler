<script setup>
import { ref } from 'vue';
import axios from '../../axios';
import { useAuthStore } from '@/stores/store'

const data = ref({
  email: '',
  password: '',
});

const authStore = useAuthStore();

const submit =() => {
   axios.post('/login', data.value).then((response)=>{
    if (response.data.success) {
      alert(response.data.message);
      authStore.setToken(response.data.token);
      location.reload();
    } else {
      alert('Login Failed!');
    }
  })
};
</script>

<template>
  <main class="w-full fixed h-full flex justify-center items-center">
    <section
      class="lg:flex xl:flex justify-center items-center lg:w-[60%] xl:w-[60%] w-[90%] lg:h-[420px] xl:h-[420px] rounded-lg relative"
    >
      <!-- Form Section -->
      <div class="lg:rounded-l-lg xl:rounded-l-lg lg:rounded-none xl:rounded-none rounded-t-lg rounded-b-lg shadow-md border bg-white w-full lg:w-1/2 xl:w-1/2 lg:py-5 xl:py-5 py-3">
        <form @submit.prevent="submit" class="mx-3">
          <h1 class="text-3xl lg:text-4xl font-sans font-bold text-blue-500">Sign in</h1>
          <p class="text-[13px] lg:text-base xl:text-base mt-2">
            Keep your schedules on track and well-organized.
          </p>
          <!-- Email Input -->
          <div class="py-3">
            <label for="email" class="block text-base lg:text-lg font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              v-model="data.email"
              class="block w-full p-3 border-b focus:outline-none focus:border-blue-500 text-sm lg:text-base"
              placeholder="Enter email"
            />
          </div>
          <!-- Password Input -->
          <div class="py-3">
            <label for="password" class="block text-base lg:text-lg font-medium mb-1">Password</label>
            <input
              type="password"
              id="password"
              v-model="data.password"
              class="block w-full p-3 border-b focus:outline-none focus:border-blue-500 text-sm lg:text-base"
              placeholder="Enter password"
            />
          </div>
          <!-- Login Button -->
          <button
            type="submit"
            class="bg-blue-500 rounded-lg shadow-md p-2 text-white text-base lg:text-lg w-full mt-4"
          >
            Log in
          </button>
          <!-- Register Link -->
          <p class="text-center text-sm lg:text-base mt-3">
            Don't have an account?
            <RouterLink to="/register" class="text-blue-700 font-semibold hover:underline ml-1">
              Register here
            </RouterLink>
          </p>
        </form>
      </div>
      <!-- Image Section -->
      <div class="w-full lg:w-1/2 xl:w-1/2 h-full shadow-md lg:block xl:block hidden">
        <img
          class="w-full h-[230px] lg:h-full rounded-b-lg shadow-md lg:rounded-none lg:rounded-r-lg"
          src="../assets/loginImg.jpg"
          alt="Login Image"
        />
      </div>
    </section>
  </main>
</template>
