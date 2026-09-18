import { defineStore } from 'pinia'
import { isAxiosError } from 'axios'
import api from '../services/api'

export interface Interaction {
  id: number
  user_id: number
  comment_id: number
  type: 'like' | 'dislike'
}

export interface Comment {
  id: number
  user_id: number
  user?: { name: string }
  content: string
  created_at: string
  parent_id?: number | null
  replies?: Comment[]
  interactions?: Interaction[]
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
        const discussion: UrlItem = response.data.data || response.data

        // Le backend renvoie tous les commentaires (racines + réponses) dans un tableau plat,
        // avec les réponses déjà nichées dans `replies` de leur parent (voir UrlController::show).
        // On ne garde que les commentaires racines pour éviter d'afficher les réponses deux fois.
        if (discussion.comments) {
          discussion.comments = discussion.comments.filter(c => !c.parent_id)
        }

        this.currentDiscussion = discussion
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          console.error('Erreur lors du chargement de l\'URL:', err.response?.data?.message)
        }
      } finally {
        this.loading = false
      }
    },

    // 4. Ajouter un commentaire ou une réponse (POST /api/comments)
    async addComment(urlId: number, content: string, parentId: number | null = null) {
      try {
        const response = await api.post('/comments', {
          url_id: urlId,
          url: urlId, // Envoie la clé 'url' pour passer la validation si nécessaire
          content: content,
          parent_id: parentId
        })
        const createdComment: Comment = response.data.data || response.data

        if (this.currentDiscussion) {
          if (!this.currentDiscussion.comments) {
            this.currentDiscussion.comments = []
          }

          if (parentId) {
            // C'est une réponse : on l'attache au commentaire parent
            const parent = this.currentDiscussion.comments.find(c => c.id === parentId)
            if (parent) {
              if (!parent.replies) parent.replies = []
              parent.replies.push(createdComment)
            }
          } else {
            // Commentaire de premier niveau
            this.currentDiscussion.comments.unshift(createdComment)
          }
        }

        return createdComment
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          console.error('Erreur lors de l\'ajout du commentaire:', err.response?.data?.message)
        }
        throw err
      }
    },

    // 5. Supprimer un commentaire ou une réponse (DELETE /api/comments/{id})
    async deleteComment(commentId: number) {
      try {
        await api.delete(`/comments/${commentId}`)

        if (this.currentDiscussion?.comments) {
          // Retire le commentaire s'il est de premier niveau
          this.currentDiscussion.comments = this.currentDiscussion.comments.filter(c => c.id !== commentId)

          // Sinon, retire la réponse dans le tableau replies de son parent
          for (const comment of this.currentDiscussion.comments) {
            if (comment.replies) {
              comment.replies = comment.replies.filter(r => r.id !== commentId)
            }
          }
        }
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          console.error('Erreur lors de la suppression du commentaire:', err.response?.data?.message)
        }
        throw err
      }
    },

    // 6. Liker ou disliker un commentaire / une réponse (POST /api/interactions)
    async toggleInteraction(commentId: number, type: 'like' | 'dislike', currentUserId: number) {
      try {
        const response = await api.post('/interactions', {
          comment_id: commentId,
          type: type
        })
        const savedInteraction: Interaction = response.data.data || response.data

        // Cherche le commentaire visé, qu'il soit racine ou réponse
        const target = this.currentDiscussion?.comments
          ?.flatMap(c => [c, ...(c.replies || [])])
          .find(c => c.id === commentId)

        if (target) {
          if (!target.interactions) target.interactions = []
          const existing = target.interactions.find(i => i.user_id === currentUserId)
          if (existing) {
            existing.type = savedInteraction.type
          } else {
            target.interactions.push(savedInteraction)
          }
        }
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          console.error('Erreur lors de l\'envoi de la réaction:', err.response?.data?.message)
        }
        throw err
      }
    }
  }
})
