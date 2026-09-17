<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="navbar">
    <div class="nav-container">
      <RouterLink to="/" class="brand">Yowl 🦉</RouterLink>
      <nav>
        <RouterLink to="/">Accueil</RouterLink>
        <template v-if="authStore.isAuthenticated">
          <span class="user-greeting">Bonjour, {{ authStore.user?.name }}</span>
          <button @click="handleLogout" class="logout-btn">Déconnexion</button>
        </template>
        <template v-else>
          <RouterLink to="/login">Connexion</RouterLink>
          <RouterLink to="/register" class="register-link">Inscription</RouterLink>
        </template>
      </nav>
    </div>
  </header>

  <main class="main-content">
    <RouterView />
  </main>
</template>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #f7fafc;
  color: #2d3748;
}

.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 24px;
}

.nav-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-size: 22px;
  font-weight: bold;
  color: #3182ce;
  text-decoration: none;
}

nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

nav a {
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
}

nav a.router-link-active {
  color: #3182ce;
}

.register-link {
  background: #3182ce;
  color: white !important;
  padding: 6px 12px;
  border-radius: 6px;
}

.user-greeting {
  font-size: 14px;
  color: #718096;
}

.logout-btn {
  background: none;
  border: 1px solid #cbd5e0;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.main-content {
  padding: 20px;
}
</style>
