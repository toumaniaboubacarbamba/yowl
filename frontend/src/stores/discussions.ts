import { defineStore } from 'pinia'
import { isAxiosError } from 'axios'
import api from '../services/api'

export interface Comment {
  id: number
  user_id: number
  user?: { name: string }
  content: string
  created_at: string
}

export interface UrlItem {
  id: number
  title?: string
  url: string
  domain?: string
  image_url?: string
  category?: string
  comments_count?: number
  upvotes_count?: number
  created_at: string
  comments?: Comment[]
}

export const useDiscussionStore = defineStore('discussions', {
  state: () => ({
    discussions: [] as UrlItem[],
    currentDiscussion: null as UrlItem | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // 1. Récupérer toutes les URLs (GET /api/urls)
    async fetchDiscussions() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/urls')
        this.discussions = response.data.data || response.data
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          console.error('Erreur lors du chargement des URLs:', err.response?.data?.message)
        }
        this.error = 'Impossible de charger les contenus.'
      } finally {
        this.loading = false
      }
    },

    // 2. Créer ou récupérer une URL (POST /api/urls)
    async createDiscussion(url: string) {
      this.loading = true
      this.error = null
      try {
        const response = await api.post('/urls', { url })
        const newUrl = response.data.data || response.data
        this.discussions.unshift(newUrl)
        return newUrl
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          this.error = err.response?.data?.message || 'Erreur lors du traitement de l\'URL.'
        } else {
          this.error = 'Une erreur inattendue est survenue.'
        }
        throw err
      } finally {
        this.loading = false
      }
    },

    // 3. Récupérer une URL spécifique (GET /api/urls/{id})
    async fetchDiscussionById(id: string | number) {
      this.loading = true
      try {
        const response = await api.get(`/urls/${id}`)
        this.currentDiscussion = response.data.data || response.data
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          console.error('Erreur lors du chargement de l\'URL:', err.response?.data?.message)
        }
      } finally {
        this.loading = false
      }
    },

    // 4. Ajouter un commentaire (POST /api/comments)
    async addComment(urlId: number, content: string) {
  try {
    const response = await api.post('/comments', {
      url_id: urlId,
      url: urlId, // Envoie la clé 'url' pour passer la validation si nécessaire
      content: content
    })
    const createdComment = response.data.data || response.data

    if (this.currentDiscussion) {
      if (!this.currentDiscussion.comments) {
        this.currentDiscussion.comments = []
      }
      this.currentDiscussion.comments.unshift(createdComment)
    }
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      console.error('Erreur lors de l\'ajout du commentaire:', err.response?.data?.message)
    }
    throw err
  }
}
  }
})
