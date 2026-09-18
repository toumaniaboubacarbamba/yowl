<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const isLogin = ref(true)

// Formulaires
const loginForm = ref({
  email: '',
  password: ''
})

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
  authStore.error = null
}

const handleLogin = async () => {
  try {
    await authStore.login(loginForm.value)
    router.push('/')
  } catch {
    // L'erreur est gérée dans le store
  }
}

const handleRegister = async () => {
  try {
    await authStore.register(registerForm.value)
    router.push('/')
  } catch {
    // L'erreur est gérée dans le store
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 shadow-md space-y-6">

      <!-- En-tête -->
      <div class="text-center space-y-2">
        <h1 class="text-2xl font-extrabold font-headline text-on-surface">
          {{ isLogin ? 'Bienvenue sur YOWL' : 'Créer un compte' }}
        </h1>
        <p class="text-xs text-on-surface-variant">
          {{ isLogin ? 'Connectez-vous pour réagir et débattre sur le Web' : 'Rejoignez la communauté du débat universel' }}
        </p>
      </div>

      <!-- Message d'erreur dynamique -->
      <div v-if="authStore.error" class="p-3 bg-error-container/40 border border-error/20 rounded-xl text-error text-xs font-semibold text-center">
        {{ authStore.error }}
      </div>

      <!-- Formulaire de Connexion -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Email</label>
          <input
            v-model="loginForm.email"
            type="email"
            required
            placeholder="votre@email.com"
            class="w-full p-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Mot de passe</label>
          <input
            v-model="loginForm.password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full p-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-3 bg-primary hover:bg-surface-tint text-white font-semibold text-sm rounded-xl transition-all active:scale-95 shadow-sm disabled:opacity-50"
        >
          {{ authStore.loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <!-- Formulaire d'Inscription -->
      <form v-else @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Nom ou Pseudo</label>
          <input
            v-model="registerForm.name"
            type="text"
            required
            placeholder="Alex"
            class="w-full p-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Email</label>
          <input
            v-model="registerForm.email"
            type="email"
            required
            placeholder="votre@email.com"
            class="w-full p-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Mot de passe</label>
          <input
            v-model="registerForm.password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full p-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Confirmer le mot de passe</label>
          <input
            v-model="registerForm.password_confirmation"
            type="password"
            required
            placeholder="••••••••"
            class="w-full p-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full py-3 bg-primary hover:bg-surface-tint text-white font-semibold text-sm rounded-xl transition-all active:scale-95 shadow-sm disabled:opacity-50"
        >
          {{ authStore.loading ? 'Création...' : 'S\'inscrire' }}
        </button>
      </form>

      <!-- Basculement Login / Register -->
      <div class="text-center pt-2 border-t border-outline-variant/20">
        <button @click="toggleMode" class="text-xs text-primary font-semibold hover:underline">
          {{ isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter' }}
        </button>
      </div>

    </div>
  </div>
</template>
