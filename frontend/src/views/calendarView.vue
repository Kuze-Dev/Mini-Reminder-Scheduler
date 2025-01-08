<script setup>
import { ref, computed, onMounted } from 'vue';
import { Calendar } from 'v-calendar';
import 'v-calendar/dist/style.css';
import axios from '../../axios';
import headerComponent from '../components/headerComponent.vue'
import footerComponent from '../components/footerComponent.vue'
import {useAuthStore} from '@/stores/store.js';
import {decodeJWT} from '@/stores/decode.js';

const store = useAuthStore();
const userId = ref(null);

if(store.token){
  const decodeToken = decodeJWT(store.token);
  userId.value = decodeToken.user_id;
}





// Add styles to highlight scheduled days
const calendarAttributes = computed(() =>
  calendar.value.map((event) => ({
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


const calendar = ref([]);
const fetchEvents = async () => {
  try {
    const response = await axios.get(`/getSchedules/${userId.value}`);
    calendar.value = response.data.Results;
   
  } catch (error) {
    alert('Error Fetching Events', error);
  }
};

onMounted(fetchEvents);
</script>


<template>
     <main class="w-full">
      <headerComponent/>

      <div class="flex justify-center  h-[550px] bg-red-500 ">
     
        <div class="bg-gray-50 lg:h-4 xl:h-4  h-1  mt-20  lg:w-[50%] xl:w-[50%] w-[85%] flex justify-center  rounded-lg shadow-md">
           
       
   
            <Calendar
     :attributes="calendarAttributes"
     @dayclick="onDayClick"
     class="shadow-md bg-white min-w-full mx-auto py-5  min-h-[300px]   "
     :theme-styles="calendarThemeStyles"
   />
   
   
             </div>
           </div>

             <footerComponent/>
     </main>

</template>