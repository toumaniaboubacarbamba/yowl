<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import AppFooter from './components/AppFooter.vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  if (authStore.token) {
    authStore.fetchUser()
  }
})
</script>

<template>
  <div class="bg-background text-on-surface antialiased min-h-screen flex flex-col font-sans">

    <!-- Navbar Header -->
    <header class="bg-surface-container-lowest border-b border-outline-variant/30 shadow-sm sticky top-0 z-50 backdrop-blur-md">
      <div class="max-w-[1320px] mx-auto px-6 h-16 flex items-center justify-between gap-4">

        <!-- Left: Logo & Search -->
        <div class="flex items-center gap-6">
          <RouterLink to="/" class="flex items-center gap-2">
            <span class="font-headline font-extrabold text-2xl text-primary tracking-tight">YOWL</span>
            <span class="text-[10px] font-bold text-primary bg-primary-fixed px-1.5 py-0.5 rounded font-mono">v1.4</span>
          </RouterLink>

          <!-- Search Bar -->
          <div class="relative hidden md:block w-72">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input
              type="text"
              placeholder="Chercher une discussion ou URL..."
              class="w-full pl-9 pr-12 py-1.5 bg-surface-container-low border border-outline-variant/30 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline"
            />
            <kbd class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-outline bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/30">⌘K</kbd>
          </div>
        </div>

        <!-- Center: Categories Nav -->
        <nav class="hidden lg:flex items-center gap-6 text-xs font-semibold text-on-surface-variant">
          <RouterLink to="/" class="text-on-surface font-bold border-b-2 border-primary py-5">Tendances</RouterLink>
          <a href="#" class="hover:text-primary transition-colors py-5">Débats chauds</a>
          <a href="#" class="hover:text-primary transition-colors py-5">Vérification</a>
          <a href="#" class="hover:text-primary transition-colors py-5">Sciences</a>
          <a href="#" class="hover:text-primary transition-colors py-5">Tech</a>
        </nav>

        <!-- Right: Actions & Auth -->
        <div class="flex items-center gap-3">
          <!-- Button Ajouter un lien -->
          <RouterLink
            to="/"
            class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-all active:scale-95"
          >
            <span class="material-symbols-outlined text-[16px]">add_link</span>
            <span>Ajouter un lien</span>
          </RouterLink>

          <template v-if="authStore.isAuthenticated">
            <span class="text-xs font-bold text-on-surface hidden sm:inline">
              {{ authStore.user?.name || 'Utilisateur' }}
            </span>
            <button
              @click="authStore.logout()"
              class="px-3 py-1.5 text-xs font-semibold text-error bg-error-container/30 rounded-lg hover:bg-error-container transition-colors"
            >
              Déconnexion
            </button>
          </template>

          <template v-else>
            <RouterLink
              to="/auth"
              class="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-surface-tint rounded-xl transition-all shadow-sm"
            >
              Se connecter
            </RouterLink>
          </template>
        </div>

      </div>
    </header>

    <!-- Main View -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- AppFooter -->
    <AppFooter />
  </div>
</template>
