import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Uncomment the following line if you need Vue DevTools during development
    // vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // Alias for the src directory
    },
  },
  server: {
    host: true, // Allows access from network devices
    port: 5173, // Specify the development server port
    https: false, // Change to true if you want HTTPS (see below)
  },
  // Uncomment and configure the following section if you want to enable HTTPS
  /*
  server: {
    https: {
      key: './path/to/your-key.pem', // Path to your SSL key file
      cert: './path/to/your-cert.pem', // Path to your SSL certificate file
    },
    host: true, // Allows access from network devices
    port: 5173, // Specify the development server port
  },
  */
});
