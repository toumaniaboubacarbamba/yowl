import { defineStore } from 'pinia'
import { isAxiosError } from 'axios'
import api from '../services/api'

export interface Comment {
  id: number
  content: string
  user: { id: number; name: string }
  interactions?: Array<{ type: 'like' | 'dislike'; user_id: number }>
  replies?: Comment[]
  created_at: string
}

export interface UrlItem {
  id: number
  url: string
  domain_name: string
  comments_count?: number
  comments?: Comment[]
}

export const useYowlStore = defineStore('yowl', {
  state: () => ({
    urls: [] as UrlItem[],
    currentUrl: null as UrlItem | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchUrls() {
      this.loading = true
      try {
        const response = await api.get('/urls')
        this.urls = response.data
      } catch {
        this.error = 'Impossible de charger la liste des URLs.'
      } finally {
        this.loading = false
      }
    },

    async fetchUrlDetails(id: number) {
      this.loading = true
      try {
        const response = await api.get(`/urls/${id}`)
        this.currentUrl = response.data
      } catch {
        this.error = 'Impossible de charger les détails de cette URL.'
      } finally {
        this.loading = false
      }
    },

    async addComment(payload: { url: string; content: string; parent_id?: number | null }) {
      try {
        const response = await api.post('/comments', payload)
        if (this.currentUrl && this.currentUrl.url === payload.url) {
          await this.fetchUrlDetails(this.currentUrl.id)
        } else {
          await this.fetchUrls()
        }
        return response.data
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          throw err.response?.data?.message || 'Erreur lors de la publication du commentaire.'
        }
        throw new Error('Une erreur inattendue est survenue.')
      }
    },

    async toggleInteraction(commentId: number, type: 'like' | 'dislike') {
      try {
        await api.post('/interactions', { comment_id: commentId, type })
        if (this.currentUrl) {
          await this.fetchUrlDetails(this.currentUrl.id)
        }
      } catch (err: unknown) {
        console.error('Erreur lors de l\'interaction:', err)
      }
    }
  }
})
