<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import headerComponent from '../components/headerComponent.vue';
import footerComponent from '../components/footerComponent.vue';
import axios from '../../axios';

const time = ref('');
const date = ref('');
const updateTime = () => {
  const now = new Date();
  time.value = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  date.value = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" });
};
setInterval(updateTime, 1000);
updateTime();

// Alarms
const alarms = ref([]);
const newAlarm = ref({
  alarm_title: '',
  alarm_time: '',
  alarm_date: '',
  sound: '',
});
const isModalOpen = ref(false);
const alarmToEdit = ref(null);

// Alarm Pagination
const currentPage = ref(1);
const itemsPerPage = 6;
const totalPages = computed(() => Math.ceil(alarms.value.length / itemsPerPage));
const currentAlarms = computed(() =>
  alarms.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage)
);

// Alarm Sounds
const alarmSounds = ref([]);
const fetchAlarmSounds = () => {
  const soundFiles = import.meta.glob('@/assets/sounds/*.{mp3,wav}');
  alarmSounds.value = Object.keys(soundFiles).map((filePath, index) => ({
    id: index + 1,
    title: filePath.split('/').pop().replace(/\.(mp3|wav)$/, ''),
    path: filePath,
  }));
};

// Reference to the current playing audio and alarm ID
const currentAudio = ref(null);
const playingAlarmId = ref(null);

// Function to toggle play/pause for the alarm sound based on alarm ID
const playPauseAlarmSound = async (alarmId, soundPath) => {
  try {
    if (playingAlarmId.value === alarmId && currentAudio.value) {
      if (!currentAudio.value.paused) {
        currentAudio.value.pause();
        playingAlarmId.value = null;
      } else {
        currentAudio.value.play();
      }
      return;
    }

    if (soundPath) {
      if (currentAudio.value) {
        currentAudio.value.pause();
        currentAudio.value.currentTime = 0;
      }

      const soundModule = await import(/* @vite-ignore */ soundPath);
      const audio = new Audio(soundModule.default);
      currentAudio.value = audio;
      playingAlarmId.value = alarmId;

      audio.play();
    }
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};

// Function to check alarms and play sound
const checkAlarms = () => {
  const now = new Date();
  alarms.value.forEach(alarm => {
    const alarmDateTime = new Date(`${alarm.alarm_date}T${alarm.alarm_time}`);
    if (now >= alarmDateTime && now - alarmDateTime < 1000) { // Trigger within 1 second
      const sound = alarmSounds.value.find(sound => sound.title === alarm.sound)?.path;
      if (sound && playingAlarmId.value !== alarm.id) {
        playPauseAlarmSound(alarm.id, sound);
      }
    }
  });
};
let alarmInterval = null;

// Fetch Alarms
const fetchAlarms = () => {
  axios.get('/alarm').then((response) => {
    alarms.value = response.data.results;
  }).catch((error) => {
    console.error("Error fetching alarms:", error);
  });
};

// Add Alarm
const addAlarm = () => {
  axios.post('/alarm', newAlarm.value).then((response) => {
    if (response.data.success) {
      alert(response.data.msg);
      fetchAlarms();
      closeModal();
    } else {
      alert('Failed to Add Alarm');
    }
  });
};

// Delete Alarm
const deleteAlarm = (id) => {
  axios.delete(`/alarm/${id}`).then(() => {
    fetchAlarms();
  }).catch((error) => {
    console.error("Error deleting alarm:", error);
  });
};

// Modal Functions
const openModal = () => {
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};

// Initial Fetch and Alarm Scheduler
onMounted(() => {
  fetchAlarms();
  fetchAlarmSounds();
  alarmInterval = setInterval(checkAlarms, 1000); // Check alarms every second
});

onUnmounted(() => {
  clearInterval(alarmInterval);
});
</script>

<template>
  <main class="w-full">
    <headerComponent />

    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <!-- Real-Time Clock -->
      <div class="bg-white rounded-lg shadow-lg p-10 mb-8 mt-[80px] flex flex-col items-center">
        <h1 class="text-6xl font-bold text-gray-800 tracking-wide">{{ time }}</h1>
        <p class="text-lg text-gray-500">{{ date }}</p>
      </div>

      <!-- Alarm Manager -->
      <div class="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-800">Alarm Manager</h2>
          <button
            @click="openModal"
            class="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 flex items-center gap-2"
          >
            <i class="fa fa-plus-circle"></i> <span>Add Alarm</span>
          </button>
        </div>

        <!-- Alarm Cards -->
        <div v-if="currentAlarms.length > 0" class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          <div
            v-for="alarm in currentAlarms"
            :key="alarm.id"
            class="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow"
          >
            <h3 class="text-lg font-semibold text-gray-700">{{ alarm.alarm_title }}</h3>
            <p class="text-gray-600">
              Time: {{
                new Date(`${alarm.alarm_date}T${alarm.alarm_time}`)
                  .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',  hour12: true })
              }}
            </p>
            <p class="text-gray-600">
              Date: {{ new Date(alarm.alarm_date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) }}
            </p>
            <p class="text-gray-600">Sound: {{ alarm.sound }}</p>
            <button
              @click="playPauseAlarmSound(alarm.id, alarmSounds.find(sound => sound.title === alarm.sound)?.path)"
              class="mt-2 px-4 py-2 rounded text-white"
              :class="{
                'bg-green-500 hover:bg-green-600': playingAlarmId !== alarm.id,
                'bg-red-500 hover:bg-red-600': playingAlarmId === alarm.id
              }"
            >
              <i :class="playingAlarmId === alarm.id ? 'fa fa-pause mr-2' : 'fa fa-play mr-2'"></i>
              <span>{{ playingAlarmId === alarm.id ? 'Pause' : 'Play' }}</span>
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="alarms.length > 0"
          class="flex justify-center items-center mt-6 space-x-4"
        >
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            <i class="fa fa-chevron-left"></i>
          </button>
          <span class="text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            <i class="fa fa-chevron-right"></i>
          </button>
        </div>

        <p v-else class="text-gray-500 text-center">No alarms set. Add one now!</p>
      </div>

      <!-- Add/Edit Alarm Modal -->
      <div
        v-if="isModalOpen" @click.self="closeModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div class="bg-white w-11/12 sm:w-2/3 lg:w-1/3 rounded-lg shadow-lg p-6 relative">
          <button
            @click="closeModal"
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <i class="fa fa-times-circle"></i>
          </button>
          <h2 class="text-2xl font-bold text-gray-700 mb-4">{{ alarmToEdit ? 'Edit Alarm' : 'Add New Alarm' }}</h2>
          <form @submit.prevent="addAlarm()">
            <div class="space-y-4">
              <input
                v-model="newAlarm.alarm_title"
                type="text"
                placeholder="Alarm Title"
                class="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <input
                v-model="newAlarm.alarm_time"
                type="time"
                class="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <input
                v-model="newAlarm.alarm_date"
                type="date"
                class="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <select
                v-model="newAlarm.sound"
                class="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option disabled value="">Select Alarm Sound</option>
                <option v-for="sound in alarmSounds" :key="sound.id" :value="sound.title">
                  {{ sound.title }}
                </option>
              </select>
            </div>
            <button
              type="submit"
              class="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <i class="fa fa-save"></i> Save Alarm
            </button>
          </form>
        </div>
      </div>
    </div>
    <footerComponent />
  </main>
</template>
