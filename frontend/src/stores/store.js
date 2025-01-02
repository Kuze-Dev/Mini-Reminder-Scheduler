import { defineStore } from 'pinia';


export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null, // Initialize from localStorage
  }),
  actions: {
    setToken(newToken) {
      this.token = newToken;
      localStorage.setItem('token', newToken); // Save to localStorage
    },
    clearToken() {
      this.token = null;
      localStorage.removeItem('token'); // Remove from localStorage
    },
  },
});
