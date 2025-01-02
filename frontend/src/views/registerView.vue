<script setup>
import { ref } from 'vue';
import axios from '../../axios';

const form = ref({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  profileImage: null,
});

const handleFileUpload = (event) => {
  form.value.profileImage = event.target.files[0];
};

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append('firstname', form.value.firstname);
  formData.append('lastname', form.value.lastname);
  formData.append('email', form.value.email);
  formData.append('password', form.value.password);
  if (form.value.profileImage) {
    formData.append('profileImage', form.value.profileImage);
  }

  try {
    const response = await axios.post('/user', formData);
    if (response.data.success) {
      alert(response.data.message);
    } else {
      alert('Error Adding User');
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('Error Adding User');
  }
};
</script>




<template>
  <main class="w-full fixed h-full flex justify-center items-center">
    <section
      class="lg:flex xl:flex justify-center items-center lg:w-[60%] xl:w-[60%] w-[90%] xl:h-[420px] rounded-lg relative"
    >
      <!-- Form Section -->
      <div class="lg:rounded-l-lg xl:rounded-l-lg lg:rounded-none xl:rounded-none rounded-t-lg shadow-md border bg-white w-full lg:w-1/2 xl:w-1/2 lg:py-5 xl:py-5 py-2 pb-3">
        <form class="mx-3" @submit.prevent="handleSubmit">
          <h1 class="text-3xl lg:text-4xl font-sans font-bold text-blue-500">Sign Up</h1>
          <p class="text-[13px] lg:text-base xl:text-base mt-2">Stay organized and on track effortlessly.</p>

          <!-- First Name & Last Name Input -->
          <div class="py-3 flex">
            <div class="w-full">
              <label for="firstname" class="block text-base lg:text-lg font-medium mb-1">First Name</label>
              <input
                type="text"
                id="firstname"
                class="block w-full p-3 border-b focus:outline-none focus:border-blue-500 text-sm lg:text-base"
                placeholder="Enter firstname"
                v-model="form.firstname"
              />
            </div>
            <div class="w-full mx-1">
              <label for="lastname" class="block text-base lg:text-lg font-medium mb-1">Last Name</label>
              <input
                type="text"
                id="lastname"
                class="block w-full p-3 border-b focus:outline-none focus:border-blue-500 text-sm lg:text-base"
                placeholder="Enter lastname"
                v-model="form.lastname"
              />
            </div>
          </div>

          <!-- Email Input -->
          <div class="py-2">
            <label for="email" class="block text-base lg:text-lg font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              class="block w-full p-3 border-b focus:outline-none focus:border-blue-500 text-sm lg:text-base"
              placeholder="Enter email"
              v-model="form.email"
            />
          </div>

          <!-- Password Input -->
          <div class="py-2">
            <label for="password" class="block text-base lg:text-lg font-medium mb-1">Password</label>
            <input
              type="password"
              id="password"
              class="block w-full p-3 border-b focus:outline-none focus:border-blue-500 text-sm lg:text-base"
              placeholder="Enter password"
              v-model="form.password"
            />
          </div>

          <!-- File Upload Input -->
          <div>
            <label for="profileImage" class="block text-base lg:text-lg font-medium mb-1">Profile Image</label>
            <input
              type="file"
              id="profileImage"
              class="block w-full   text-sm lg:text-base"
              @change="handleFileUpload"
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="bg-blue-500 rounded-lg shadow-md p-2 text-white text-base lg:text-lg w-full mt-4"
          >
            Create an account
          </button>

          <!-- Register Link -->
          <p class="text-center text-sm lg:text-base mt-3">
            Already have an account?
            <router-link to="/" class="text-blue-700 font-semibold hover:underline ml-1">
              Login here
            </router-link>
          </p>
        </form>
      </div>

      <!-- Image Section -->
      <div class="w-full lg:w-1/2 xl:w-1/2 h-[571px] shadow-md lg:block xl:block hidden">
        <img
          class="w-full h-[230px] lg:h-full rounded-b-lg shadow-md lg:rounded-none lg:rounded-r-lg"
          src="../assets/registerImg.jpg"
          alt="Register Image"
        />
      </div>
    </section>
  </main>
</template>

