import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/store'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/loginView.vue'),
      meta: {requiresAuth: false}
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/registerView.vue'),
       meta: {requiresAuth: false}
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/dashboardView.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../views/calendarView.vue'),
      meta: {requiresAuth: true}
    },
    
    {
      path: '/schedule',
      name: 'schedule',
      component: () => import('../views/schedulerView.vue'),
      meta: {requiresAuth: true}
    }
  ],
})

router.beforeEach((to,from,next)=>{
  const authStore = useAuthStore(); 
  const token = authStore.token; 
  
    if(to.meta.requiresAuth){
    if(token){
      next();
    }else{
      next({name:'login'})
    }
  }else{
    if (token) {
      next({ name: 'dashboard'});
    } else {
      next();
    }
  }
})



export default router
