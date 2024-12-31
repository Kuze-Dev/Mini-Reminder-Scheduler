<template>
    <main class="w-full fixed  h-screen  flex justify-center lg:items-center xl:items-center overflow-y-auto ">
      <section
        class="lg:flex xl:flex justify-center items-center lg:w-[60%] xl:w-[60%] w-[90%]  lg:h-[380px] xl:h-[420px] h-[300px]  rounded-lg relative lg:mt-0 xl:mt-0 mt-[90px]"
      >
        <!-- Form Section -->
        <div class="lg:rounded-l-lg xl:rounded-l-lg lg:rounded-none xl:rounded-none rounded-t-lg shadow-md border bg-white w-full lg:w-1/2 xl:w-1/2 lg:py-5 xl:py-5 py-2  pb-3">
          <form class="mx-3">
            <h1 class="text-3xl lg:text-4xl font-sans font-bold text-blue-500">Sign Up</h1>
            <p class="text-[13px] lg:text-base  xl:text-base mt-2">Stay organized and on track effortlessly.</p>
            <!-- Email Input -->
            <div class="py-3">
              <label for="name" class="block text-base lg:text-lg font-medium mb-1">Name</label>
              <input
                type="text"
                id="name"
                class="block w-full p-3 border-b focus:outline-none focus:border-blue-500 text-sm lg:text-base"
                placeholder="Enter name"
              />
            </div>
            <!-- Email Input -->
            <div class="py-3">
              <label for="email" class="block text-base lg:text-lg font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
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
                class="block w-full p-3 border-b focus:outline-none focus:border-blue-500 text-sm lg:text-base"
                placeholder="Enter password"
              />
            </div>
            <!-- Login Button -->
            <button
              type="button"
              class="bg-blue-500 rounded-lg shadow-md p-2 text-white text-base lg:text-lg w-full mt-4"
            >
              Create an account
            </button>
            <!-- Register Link -->
            <p class="text-center text-sm lg:text-base mt-3">
              Already have an account?
              <RouterLink to="/" class="text-blue-700 font-semibold hover:underline ml-1">
                Login here
              </RouterLink>
            </p>
          </form>
        </div>
        <!-- Image Section -->
        <div class="w-full lg:w-1/2  xl:w-1/2  h-[525px]  shadow-md lg:block xl:block hidden   ">
          <img
            class=" w-full h-[230px] lg:h-full rounded-b-lg shadow-md lg:rounded-none lg:rounded-r-lg"
            src="../assets/registerImg.jpg"
            alt="Register Image"
          />
        </div>
      </section>
    </main>
  </template>
  