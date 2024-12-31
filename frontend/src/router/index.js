import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
  
      component: () => import('../views/loginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
  
      component: () => import('../views/registerView.vue'),
    },
    {
      path: '/schedule',
      name: 'schedule',
  
      component: () => import('../views/schedulerView.vue'),
    }
  ],
})

export default router
