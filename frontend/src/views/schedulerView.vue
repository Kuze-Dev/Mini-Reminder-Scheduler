<script setup>
import { ref, computed, onMounted } from 'vue';
import { Calendar } from 'v-calendar';
import 'v-calendar/dist/style.css';
import axios from '../../axios';

const newEvent = ref({
  title: '',
  date: '',
  time: '',
  location: '',
});


const addEvent = async () => {
    const response = await axios.post(`/add`, newEvent.value);
    if(response.data.success){
      alert(response.data.msg);
    fetchEvents();
    closeModal();
    }else{
    console.log('Failed to Add Event');
    }
  };

  const events = ref([]);
const fetchEvents = async () => {
  try {
    const response = await axios.get(`/getEvents?page=${currentPage.value}&limit=${perPage.value}`);
    events.value = response.data.Results;
    Totalevents.value = response.data.Totalevents;
    currentPage.value = response.data.currentPage;
    perPage.value = response.data.perPage;

    // Check if the current page is empty after fetching
    if (events.value.length === 0 && currentPage.value > 1) {
      goToPreviousPage(); // Go to the previous page if the current page is empty
    }
  } catch (error) {
    alert('Error Fetching Events', error);
  }
};

//Pages
const currentPage = ref(0);
const perPage = ref(0); // Number of items per page
const Totalevents = ref(0);

const goToPreviousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        fetchEvents();
    }
};

const goToNextPage = () => {
    const totalPages = Math.ceil(Totalevents.value / perPage.value);
    if (currentPage.value < totalPages) {
        currentPage.value++;
        fetchEvents();
    }
};




const deleteEvent = async (id) => {
  try {
    await axios.delete(`/delete/${id}`);
    fetchEvents(); // Refresh the events list after deletion
  } catch (error) {
    console.error('Error deleting event:', error);
  }
};

const showModal = ref(false);
const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetNewEvent();
};

const resetNewEvent = () => {
  newEvent.value.title = '';
  newEvent.value.date = '';
  newEvent.value.time = '';
  newEvent.value.location = '';
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

// Add styles to highlight scheduled days
const calendarAttributes = computed(() =>
  events.value.map((event) => ({
    dates: new Date(event.date),
    popover: { label: event.title },
    highlight: true,
    highlightClass: 'bg-blue-500 text-white', // Highlight style for scheduled days
  }))
);

const calendarThemeStyles = {
  wrapper: { backgroundColor: 'transparent' },
  header: { color: 'white' },
  weekdays: { color: 'rgba(255, 255, 255, 0.7)' },
  dayContent: { color: 'white' },
};

const onDayClick = (date) => {
  console.log('Day clicked:', date);
};


onMounted(fetchEvents);
</script>

<template>
  <div class=" w-full  bg-gradient-to-br from-indigo-100 lg:h-screen xl:h-screen    to-purple-100  ">
      <div class="lg:flex xl:flex justify-center">
        <!-- Calendar Section -->
        
        <div class="lg:w-[50%] xl:w-[50%] lg:p-6 xl:p-6 p-4 lg:h-[520px] xl:h-[520x]  lg:mt-12 xl:mt-12">
          <div class="bg-gray-50  px-4  py-[22px] rounded-lg shadow-md">
            <div class=" flex justify-start">
              <button
  @click="openModal"
  class="w-[50%] text-center bg-indigo-500 hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 mb-6"
> ADD EVENT <i class="fas fa-plus ml-2"></i>
</button>

        </div>
        <div class="mb-2">
  <h1 class="lg:text-3xl xl:text-4xl text-2xl mx-2 text-indigo-700 font-semibold">
     Set Schedule <i class="fas fa-calendar-alt"></i>
  </h1>
</div>

         <Calendar
  :attributes="calendarAttributes"
  @dayclick="onDayClick"
  class="shadow-md bg-white min-w-full py-5  min-h-full  rounded-none rounded-b-lg "
  :theme-styles="calendarThemeStyles"
/>


          </div>
        </div>

        <!-- Events Section -->
        <div class="lg:p-6 xl:p-6 p-4 lg:h-[520px] xl:h-[520px] h-[500px]  lg:mt-12 xl:mt-12">
        

          <div class="bg-gray-50 rounded-lg p-4 shadow-md  h-[480px] lg:w-[530px]  xl:w-[530px]">
            <h2 class="text-2xl font-semibold mb-4 text-indigo-700 flex justify-center items-center">
   Upcoming Events <i class="fas fa-clock ml-2"></i>
</h2>

                
            <TransitionGroup
              name="event-list"
              tag="ul"
              class="space-y-3   h-[365px]"
            >              <li v-if="events.length>0"
                v-for="event in events"
                :key="event.id"
                class="bg-white p-4 lg:w-[80%]  xl:w-[498px] w-full rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
              >
              <div class="flex">
                <h3 class="font-medium text-lg text-indigo-600 flex-1"><i class="fas fa-pen-nib mr-2"></i>{{ event.title }}</h3>
                <button   class="mr-4" title="Edit">
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
                <button @click="deleteEvent(event.id)" class="mr-4" title="Delete">
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
  {{ formatDate(event.date) }} at 
  <i class="fas fa-clock mx-1 text-gray-500"></i> 
  {{ formatTime(event.time) }}
</p>
                <p class="text-sm text-gray-600 mt-1">  <i class="fas fa-map-marker-alt mr-2 text-gray-500"></i> {{ event.location }}</p>
               
              </li>
              <li v-else class="text-center text-gray-500 text-2xl font-semibold mt-[150px]">
    No upcoming events.
  </li>
 

            </TransitionGroup>
 <!-- Pagination Controls -->
 <div class="flex justify-between items-center px-1">
  <button
    @click="goToPreviousPage"
    class=" px-2 py-2 border rounded-lg bg-indigo-500 text-white"
   
  >
   Previous
  </button>

  <span class="text-sm text-gray-600">
    Page {{ currentPage }} of {{ Math.ceil(Totalevents / perPage) }}
  </span>

  <button
    @click="goToNextPage"
    class=" px-2 py-2 border rounded-lg bg-indigo-500 text-white"
  >
    Next
  </button>
</div>
            </div>
      
        </div>
        
      </div>
    </div>

    <!-- Add Event Modal -->
    <Transition name="modal">
    <div
      v-if="showModal"
      @click.self="closeModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-8 rounded-2xl w-full max-w-md">
        <h2 class="text-3xl font-bold mb-6 text-indigo-700">Add New Event</h2>
        <form @submit.prevent="addEvent" class="space-y-4">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input
              v-model="newEvent.title"
              type="text"
              id="title"
              required
              class="w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
            <input
              v-model="newEvent.date"
              type="date"
              id="date"
              required
              class="w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label for="time" class="block text-sm font-medium text-gray-700">Time</label>
            <input
              v-model="newEvent.time"
              type="time"
              id="time"
              required
              class="w-full px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
            <input
              v-model="newEvent.location"
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
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
    </Transition>
</template>

<style scoped>
.event-list-enter-active,
.event-list-leave-active {
  transition: all 0.4s ease;
}
.event-list-enter-from,
.event-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.vc-calendar {
  width: 100% !important;
  max-width: 100% !important;
}
</style>

 

