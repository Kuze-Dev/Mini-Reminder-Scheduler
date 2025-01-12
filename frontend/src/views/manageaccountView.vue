<script setup>
import { ref, computed,onMounted } from 'vue';
import axios from '../../axios.js';
import headerComponent from '../components/headerComponent.vue';
import footerComponent from '../components/footerComponent.vue';
import Swal from 'sweetalert2';

const users = ref([]);

const fetchAllUser = async () => {
  try {
    const response = await axios.get(`/user?page=${currentPage.value}&limit=${perPage.value}`);
    users.value = response.data.results;
    currentPage.value =response.data.currentPage;
    perPage.value = response.data.perPage;
    totalUsers.value= response.data.totalUsers;
  } catch (error) {
    alert('Error Fetching All Users', error);
  }
};

const currentPage = ref(0);
const perPage = ref(0);
const totalUsers=ref(0);

const totalPages = computed(() => Math.ceil(totalUsers.value / perPage.value));

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchAllUser();
  }
};

const goToNextPage = () => {
  const totalPages = Math.ceil(totalUsers.value / perPage.value);
  if (currentPage.value < totalPages) {
    currentPage.value++;
    fetchAllUser();
  }
};

const goToPage = (page) => {
  if (page !== currentPage.value) {
    currentPage.value = page;
    fetchAllUser();
  }
};

const handleStatus1=async(id)=>{
       const data = {status:'Inactive'}
       const response= await axios.put(`/user/status/${id}`,data);
       if(response.data.success){
        fetchAllUser();
       }else{
        alert('Failed to Update');
       }
}

const handleStatus2=async(id)=>{
       const data = {status:'Active'}
       const response= await axios.put(`/user/status/${id}`, data);
       if(response.data.success){
        fetchAllUser();
       }else{
        alert('Failed to Update');
       }
}

const handleDelete = async (id) => {
  // alert(id);
  Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`/user/${id}`).then((response) => {
                if (response.data.success) {
                    // console.log(response.data.message);
                    Swal.fire(
                        'Deleted!',
                        response.data.msg,
                        'success'
                    );
                    fetchAllUser();
                } else {
                    // alert(response.data.failed)
                    Swal.fire(
                        'Failed!',
                        response.data.failed,
                        'error'
                    );
                }
            });
        }
    });
}

const showEditModal = ref(false);
const userId = ref(false);
const openEditModal = (id) => {
  showEditModal.value = true;
  userId.value = id;
  const user = users.value.find(user => user.user_id === id);
  // Assuming 'profileImage' is part of the user object
  if (user) {
       form.value.firstname = user.firstname;
       form.value.lastname = user.lastname;
       form.value.email = user.email;
       form.value.firstname = user.firstname;
       form.value.role = user.role;
    }};


const closeEditModal=()=>{
  showEditModal.value = false;
  resetForm();
}

const previewUrl = ref(defaultImageUrl); // For image preview
const defaultImageUrl = '../src/assets/default-image.jpg';


const form = ref({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  profileImage: '',
  password:'',
  role:'',
});
// Ref for the file input element
const fileInputRef = ref(null);

const resetForm = () => {
  form.value.firstname = '';
  form.value.lastname = '';
  form.value.email = '';
  form.value.password = '';
  previewUrl.value = defaultImageUrl;
  form.value.profileImage = '';
  form.value.password = '';
  form.value.role='';
  // Reset the file input
  if (fileInputRef.value) {
    fileInputRef.value.value = ''; // Clear the file input
  }
};


const handleProfileChange =()=>{
  form.value.profileImage = event.target.files[0];
  if (form.value.profileImage) {
     // Create a temporary URL for the file to display it in the preview
    previewUrl.value = URL.createObjectURL(form.value.profileImage);
}
}


const handleEdit = async () => {
  const formData = new FormData();
  formData.append('firstname', form.value.firstname);
  formData.append('lastname', form.value.lastname);
  formData.append('email', form.value.email);
  formData.append('role', form.value.role);
  // Conditionally append the password only if it's provided
  if (form.value.password) {
    formData.append('password', form.value.password);
  }
  // Append the profile image if it's provided
  if (form.value.profileImage) {
    formData.append('profileImage', form.value.profileImage);
  }

  try {
    const response = await axios.put(`/user/${userId.value}`, formData);
    if (response.data.success) {
      alert(response.data.msg);
      fetchAllUser();
      closeEditModal();
      
    } else {
      alert('Error Updating User');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    alert('An error occurred while updating the user.');
  }
};













onMounted(fetchAllUser);
</script>



<template>
    <main class="w-full">
      <headerComponent/>
  
      <section class="p-6 bg-gray-100 flex justify-center">
        <div class="lg:w-[900px] xl:w-[900px] w-full  bg-white shadow-lg rounded-lg p-6 mt-[70px] lg:h-[580px] xl:h-[580px] h-full">
          <h1 class="text-2xl font-bold mb-6 text-gray-800 text-center">
            Manage Accounts
          </h1>
  
          <!-- Users Grid -->
          <div class=" lg:h-[440px] xl:h-[440px] h-full">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
              <div
                v-for="user in users"
                :key="user.user_id"
                class="p-4 border border-gray-300 bg-white shadow-md rounded-lg"
              >
                <div class="flex items-center mb-4">
                    <img
          :src="`../src/assets/uploads/${user.profileImage}`"  alt="User Profile Image"
  class="w-14 h-14 rounded-full "
/>
                  <div class="ml-4">
                    <div class="flex space-x-1">
                    <h2 class="text-[14px] font-semibold text-gray-800">{{ user.firstname }}</h2>
                    <h2 class="text-[14px] font-semibold text-gray-800">{{ user.lastname }}</h2>
                </div>
                    <p class="text-sm text-gray-600">{{ user.role }}</p>
                  </div>
                </div>
                <div class="text-sm text-gray-600 mb-4">
  <p>Email: {{ user.email }}</p>
  <p>Status:
  <span :class="user.status === 'Active' ? 'text-green-500': 'text-red-500'">
    {{ user.status==='Active' ? user.status : 'Inactive' }}
  </span></p>
</div>
<div class="flex justify-end gap-2">
  <!-- Edit Icon -->
  <button
    @click="openEditModal(user.user_id)"
    class="bg-blue-500 text-white py-2 px-2 rounded-full hover:bg-blue-600 flex items-center justify-center"
    title="Edit"
  >
    <i class="fas fa-edit"></i>
  </button>

  <!-- Delete Icon -->
  <button
    @click="handleDelete(user.user_id)"
    class="bg-red-500 text-white py-2 px-2 rounded-full hover:bg-red-600 flex items-center justify-center"
    title="Delete"
  >
    <i class="fas fa-trash"></i>
  </button>

  <!-- Deactivate Icon -->
  <button v-if="user.status==='Active'"
    @click="handleStatus1(user.user_id)"
    :class="user.status=='Active' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'"
    class="text-white py-2 px-2 rounded-full flex items-center justify-center"
    :title="user.status==='Active'? 'Deactivate' : 'Activate'"
  >
    <i :class="user.status==='Active' ? 'fas fa-user-slash' : 'fas fa-user-check'"></i>
  </button>
  <button v-else="user.status!=='Active'"
    @click="handleStatus2(user.user_id)"
    :class="user.status=='Active' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'"
    class="text-white py-2 px-2 rounded-full flex items-center justify-center"
    :title="user.status==='Active'? 'Deactivate' : 'Activate'"
  >
    <i :class="user.status==='Active' ? 'fas fa-user-slash' : 'fas fa-user-check'"></i>
  </button>
</div>

              </div>
            </div>
          </div>
  
          <!-- Pagination Controls -->
          <div class="flex justify-center items-center gap-4">
            <button
              @click="goToPreviousPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div v-if="totalPages > 0" class="flex gap-2">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                :class="[ 
                  'px-3 py-1 rounded',
                  currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                ]"
              >
                {{ page }}
              </button>
            </div>
            <button
              @click="goToNextPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </section>


      <!-- Start of Add New Modal -->
<section v-if="showEditModal" @click.self="closeEditModal"
    class="fixed inset-0  p-4 flex justify-center items-center w-full h-screen bg-[rgba(0,0,0,0.5)] z-20 overflow-auto">
    <div class="w-full xl:w-[50%] bg-white  rounded-lg shadow-lg p-4 relative   ">
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-300">
            <h3 class="text-lg font-semibold text-gray-800">Edit User</h3>
            <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Form Section -->
        <form @submit.prevent="handleEdit" novalidate class="mt-4 space-y-4">
            <!-- Profile Image Upload -->
            <div class="lg:flex xl:flex justify-center items-center space-x-4">
                <div class="lg:w-24 xl:w-24 w-[100px] lg:h-24 xl:h-24 h-[100px] rounded-full overflow-hidden border border-gray-300">
                    <img :src="previewUrl" alt="Profile Image" class="w-full h-full object-cover" v-if="previewUrl">
                    <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span class="text-gray-500">No Image</span>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Profile Image</label>
                    <input  ref="fileInputRef"   type="file" accept="image/*" @change="handleProfileChange" 
                        class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
                </div>
            </div>

            <!-- Name Fields -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="firstname" class="block text-sm font-medium text-gray-700">First Name</label>
                    <input id="firstname" v-model="form.firstname" type="text" placeholder="Enter first name" 
                        class="mt-1 block w-full  border-b focus:outline-none shadow-sm focus:border-indigo-500 ">
                </div>
                <div>
                    <label for="lastname" class="block text-sm font-medium text-gray-700">Last Name</label>
                    <input id="lastname" v-model="form.lastname" type="text" placeholder="Enter last name" 
                        class="mt-1 block w-full  border-b focus:outline-none shadow-sm focus:border-indigo-500 ">
                </div>
            </div>

            <!-- Email and Password Fields -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input id="email" v-model="form.email" type="email" placeholder="Enter email address" 
                        class="mt-1 block w-full  border-b focus:outline-none shadow-sm focus:border-indigo-500 ">
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input id="password" v-model="form.password" type="password" placeholder="Enter password" 
                        class="mt-1 block w-full border-b focus:outline-none shadow-sm focus:border-indigo-500 ">
                </div>
            </div>

            <!-- Role Selection -->
            <div>
                <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                <select id="role" v-model="form.role"
                    class=" block mt-1  lg:w-[50%] xl:w-[50%] w-full  border-b focus:outline-none shadow-sm focus:border-indigo-500 ">
                    <option value="">Select a role</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                </select>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 mt-6">
                <button type="button" @click="closeEditModal" 
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300">Cancel</button>
                <button type="submit" 
                    class="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700">Save Changes</button>
            </div>
        </form>
           </div>

      </section>

  
      <footerComponent />
    </main>
  </template>
  
 