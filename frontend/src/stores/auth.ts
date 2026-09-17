import { defineStore } from 'pinia'
import { isAxiosError } from 'axios'
import api from '../services/api'

interface User {
  id: number
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('yowl_token') || '',
    loading: false,
    error: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async register(credentials: { name: string; email: string; password: string; password_confirmation: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/register', credentials)
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('yowl_token', this.token)
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          this.error = err.response?.data?.message || 'Erreur lors de l\'inscription.'
        } else {
          this.error = 'Une erreur inattendue est survenue.'
        }
        throw err
      } finally {
        this.loading = false
      }
    },

    async login(credentials: { email: string; password: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/login', credentials)
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('yowl_token', this.token)
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          this.error = err.response?.data?.message || 'Identifiants incorrects.'
        } else {
          this.error = 'Une erreur inattendue est survenue.'
        }
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      if (!this.token) return
      try {
        const response = await api.get('/me')
        this.user = response.data
      } catch {
        await this.logout()
      }
    },

    async logout() {
      try {
        if (this.token) {
          await api.post('/logout')
        }
      } catch {
        // Ignorer les erreurs réseau lors de la déconnexion
      } finally {
        this.user = null
        this.token = ''
        localStorage.removeItem('yowl_token')
      }
    }
  }
})
