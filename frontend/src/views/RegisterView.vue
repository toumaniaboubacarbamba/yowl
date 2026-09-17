<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')

const handleSubmit = async () => {
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })
    router.push('/')
  } catch {
    // Les erreurs sont gérées dans authStore.error
  }
}
</script>

<template>
  <div class="auth-container">
    <h2>Créer un compte Yowl</h2>

    <div v-if="authStore.error" class="error-banner">
      {{ authStore.error }}
    </div>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <div class="form-group">
        <label for="name">Nom d'utilisateur</label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          placeholder="John Doe"
        />
      </div>

      <div class="form-group">
        <label for="email">Adresse email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          placeholder="votre@email.com"
        />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          placeholder="••••••••"
        />
      </div>

      <div class="form-group">
        <label for="password_confirmation">Confirmer le mot de passe</label>
        <input
          id="password_confirmation"
          v-model="passwordConfirmation"
          type="password"
          required
          placeholder="••••••••"
        />
      </div>

      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Création...' : "S'inscrire" }}
      </button>
    </form>

    <p class="auth-switch">
      Déjà un compte ?
      <RouterLink to="/login">Se connecter</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

h2 {
  margin-bottom: 20px;
  text-align: center;
  color: #2c3e50;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
}

input {
  padding: 10px 12px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 15px;
}

input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
}

button {
  padding: 12px;
  background-color: #38a169;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #2f855a;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-banner {
  padding: 10px;
  margin-bottom: 16px;
  background-color: #fed7d7;
  color: #9b2c2c;
  border-radius: 6px;
  font-size: 14px;
}

.auth-switch {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #718096;
}

.auth-switch a {
  color: #3182ce;
  text-decoration: none;
  font-weight: 600;
}
</style>
