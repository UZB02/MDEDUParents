import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { layout: AppLayout, requiresAuth: true },
  },
  {
    path: '/test/:token',
    name: 'TestView',
    component: () => import('../views/Test/TestView.vue'),
    meta: { layout: AuthLayout }, // **requiresAuth yo‘q**, istisno
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/LoginView.vue'),
    meta: { layout: AuthLayout },
  },
  // boshqa sahifalar
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 🔐 Global auth guard
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('parentToken')

  // Agar sahifa /test/:token bo‘lsa, tekshirishni o‘tkazib yubor
  if (to.name === 'TestView') {
    return next()
  }

  // Boshqa sahifalar uchun token kerak
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'Login' })
  }

  next()
})

export default router
