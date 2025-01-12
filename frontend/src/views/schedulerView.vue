<script setup>
import { ref, onMounted,computed } from 'vue';
import axios from '../../axios';
import headerComponent from '../components/headerComponent.vue'
import footerComponent from '../components/footerComponent.vue'
import {useAuthStore} from '@/stores/store.js';
import {decodeJWT} from '@/stores/decode.js';

const userId =ref(null);

const store = useAuthStore();

if(store.token){
  const decodeToken = decodeJWT(store.token);
  userId.value = decodeToken.user_id;
}

onMounted(()=>{
  console.log(userId.value);
})

const newSchedule = ref({
  title: '',
  date: '',
  time: '',
  location: '',
});

const editSchedule = ref({
  id: '', // Added the id field for the schedule
  title: '',
  date: '',
  time: '',
  location: '',
});

const addSchedule = async () => {
  const response = await axios.post(`/add/${userId.value}`, newSchedule.value);
  if (response.data.success) {
    alert(response.data.msg);
    fetchSchedule();
    closeModal();
  } else {
    console.log('Failed to Add Event');
  }
};

const schedules = ref([]);
const fetchSchedule = async () => {
  try {
    const response = await axios.get(`/getSchedules/${userId.value}?page=${currentPage.value}&limit=${perPage.value}`);
    schedules.value = response.data.Results;
    Totalschedules.value = response.data.Totalschedules;
    currentPage.value = response.data.currentPage;
    perPage.value = response.data.perPage;

    if (schedules.value.length === 0 && currentPage.value > 1) {
      goToPreviousPage();
    }
  } catch (error) {
    alert('Error Fetching Schedules', error);
  }
};

const currentPage = ref(0);
const perPage = ref(0);
const Totalschedules = ref(0);

const totalPages = computed(() => Math.ceil(Totalschedules.value / perPage.value));

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchSchedule();
  }
};

const goToNextPage = () => {
  const totalPages = Math.ceil(Totalschedules.value / perPage.value);
  if (currentPage.value < totalPages) {
    currentPage.value++;
    fetchSchedule();
  }
};

const goToPage = (page) => {
  if (page !== currentPage.value) {
    currentPage.value = page;
    fetchSchedule();
  }
};

const submitEditSchedule = async (id) => {
  try {
    const response = await axios.put(`/update/${editSchedule.value.id}`, editSchedule.value);
    if (response.data.success) {
      alert(response.data.msg);
      fetchSchedule();
      closeEditModal();
    } else {
      alert('Failed to update the schedule.');
    }
  } catch (error) {
    console.error('Error updating schedule:', error);
  }
};

const deleteSchedule = async (id) => {
  try {
    await axios.delete(`/delete/${id}`);
    fetchSchedule();
  } catch (error) {
    console.error('Error deleting schedule:', error);
  }
};

const showModal = ref(false);
const showEditModal = ref(false);

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetNewSchedule();
};

const openEditModal = (id) => {
  showEditModal.value = true;
  const scheduleToEdit = schedules.value.find(schedule => schedule.id === id);
  
  // Format date if necessary (e.g., converting to 'YYYY-MM-DD' format)
  const formattedDate = new Date(scheduleToEdit.date).toISOString().split('T')[0];
  
  editSchedule.value = { 
    ...scheduleToEdit, 
    date: formattedDate // Using the formatted date
  };
};


const closeEditModal = () => {
  showEditModal.value = false;
};

const resetNewSchedule = () => {
  newSchedule.value.title = '';
  newSchedule.value.date = '';
  newSchedule.value.time = '';
  newSchedule.value.location = '';
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

onMounted(fetchSchedule);
</script>

<template>
  <main class=" w-full  ">
    <headerComponent/>
      <div class="lg:flex xl:flex justify-center bg-gray-100 items-center">
        <div class="lg:p-6 xl:p-6 p-4  lg:h-[440px] lg:w-[900px] xl:w-[900px] w-full    mt-[65px] xl:h-[500px] h-full">
          <div class="bg-white rounded-lg p-4 shadow-md lg:h-[500px] xl:h-[460px] h-[940px]  lg:w-[900px] xl:w-[900px] w-full">

        
            <h2 class="text-2xl font-semibold mb-4 text-center ">
              Schedule <i class="fas fa-clock ml-2 mt-1"></i>
            </h2>
            <button
              @click="openModal"
              class=" shadow-md lg:w-[25%] xl:w-[25%] w-[60%]   text-center bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 text-white font-bold py-3  rounded-lg transition-transform transform hover:scale-105 mb-6"
            >
              ADD SCHEDULE <i class="fas fa-plus ml-2"></i>
            </button>
        <div class="lg:h-[246px] xl:h-[246px] h-[750px]">
            <div class="grid grid-cols-1 lg:xl:grid-cols-3 xl:grid-cols-3 gap-3 py-2 lg:h-[225px]  xl:h-[225px]  h-[500px]">
              <div
                v-if="schedules.length > 0"
                v-for="schedule in schedules"
                :key="schedule.id"
                class="bg-white p-4 h-[110px] py-3 w-full  rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
              >
                <div class="flex ">
                  <h3 class="font-medium text-lg text-indigo-600 flex-1">
                    <i class="fas fa-pen-nib mr-2"></i>{{ schedule.title }}
                  </h3>
                  <button  @click="openEditModal(schedule.id)" class="mr-4" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 fill-blue-500 hover:fill-blue-700"
                  viewBox="0 0 348.882 348.882">
                  <path
                    d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                    data-original="#000000" />
                  <path
                    d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                    data-original="#000000" />
                </svg>
                  </button>
                  <button @click="deleteSchedule(schedule.id)" class="mr-4" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
                  <path
                    d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                    data-original="#000000" />
                  <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                    data-original="#000000" />
                </svg>
                  </button>
                </div>
                <p class="text-sm text-gray-600 mt-1 flex items-center">
                  <i class="fas fa-calendar-alt mr-2 text-gray-500"></i>
                  {{ formatDate(schedule.date) }} at
                  <i class="fas fa-clock mx-1 text-gray-500"></i>
                  {{ formatTime(schedule.time) }}
                </p>
                <p class="text-sm text-gray-600 mt-1">
                  <i class="fas fa-map-marker-alt mr-2 text-gray-500"></i> {{ schedule.location }}
                </p>
                
              </div>
              <div v-else class="col-span-full text-center text-gray-500 text-2xl font-semibold mt-[150px]">
                No schedules.
              </div>

            </div>
          </div>
          <div class="flex justify-center items-center gap-4 lg:mt-6 xl:mt-6">
  <button
    @click="goToPreviousPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
    Previous
  </button>
  
  <!-- Page Numbers -->
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
        </div>
        
      </div>
    <div
      v-if="showModal"
      @click.self="closeModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center h-screen z-50"
    >
      <div class="bg-white p-8 rounded-2xl lg:w-[30%]  xl:w-[30%] w-[95%] ">
        <h2 class="text-3xl font-bold mb-6 text-indigo-700">Add New Schedule</h2>
        <form @submit.prevent="addSchedule" class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input
              v-model="newSchedule.title"
              type="text"
              id="title"
              required
              class="w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
            <input
              v-model="newSchedule.date"
              type="date"
              id="date"
              required
              class="w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label for="time" class="block text-sm font-medium text-gray-700">Time</label>
            <input
              v-model="newSchedule.time"
              type="time"
              id="time"
              required
              class="w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
            <input
              v-model="newSchedule.location"
              type="text"
              id="location"
              required
              class="w-full px-3 py-2 border border-black rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Add Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
    

    <div
      v-if="showEditModal"
      @click.self="closeEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center h-screen z-50"
    >
      <div class="bg-white p-8 rounded-2xl lg:w-[30%]  xl:w-[30%] ">
        <h2 class="text-3xl font-bold mb-6 text-indigo-700">Edit Schedule</h2>
        <form @submit.prevent="submitEditSchedule" class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input
              v-model="editSchedule.title"
              type="text"
              id="title"
              required
              class="w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
            <input
              v-model="editSchedule.date"
              type="date"
              id="date"
              required
              class="w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label for="time" class="block text-sm font-medium text-gray-700">Time</label>
            <input
              v-model="editSchedule.time"
              type="time"
              id="time"
              required
              class="w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
            <input
              v-model="editSchedule.location"
              type="text"
              id="location"
              required
              class="w-full px-3 py-2 border border-black rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeEditModal"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Edit Schedule
            </button>
          </div>
        </form>
      </div>
    </div>

    <footerComponent/>
  </main>
  
</template>
