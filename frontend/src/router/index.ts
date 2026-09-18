import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UrlDetailView from '../views/UrlDetailView.vue'
import { useAuthStore } from '../stores/auth'
import DiscussionView from '../views/DiscussionView.vue'
import AuthView from '../views/AuthView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/url/:id',
    name: 'url-detail',
    component: UrlDetailView,
    props: true
  },
  {
      path: '/discussion/:id',
      name: 'discussion',
      component: DiscussionView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
    },
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
