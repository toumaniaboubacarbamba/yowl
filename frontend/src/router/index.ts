import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import UrlDetailView from '../views/UrlDetailView.vue'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/url/:id',
    name: 'url-detail',
    component: UrlDetailView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navigation : Récupère les infos utilisateur au rafraîchissement si un token existe
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (authStore.token && !authStore.user) {
    await authStore.fetchUser()
  }

  // Rediriger vers /login si la page nécessite d'être connecté
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }
})

export default router
