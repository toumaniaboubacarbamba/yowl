<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDiscussionStore } from '../stores/discussions'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const discussionStore = useDiscussionStore()
const authStore = useAuthStore()

const newComment = ref('')
const submittingComment = ref(false)

// Réponses : quel commentaire est en train de recevoir une réponse, et son contenu
const replyingToId = ref<number | null>(null)
const replyContent = ref('')
const submittingReply = ref(false)

// Récupération de l'ID depuis l'URL de la route (ex: /discussion/1)
const discussionId = route.params.id as string

onMounted(() => {
  discussionStore.fetchDiscussionById(discussionId)
})

// Soumission d'un nouveau commentaire
const handleAddComment = async () => {
  if (!newComment.value.trim() || submittingComment.value) return

  submittingComment.value = true
  try {
    await discussionStore.addComment(Number(discussionId), newComment.value)
    newComment.value = ''
  } catch (error) {
    console.error('Erreur lors de l\'envoi du commentaire', error)
  } finally {
    submittingComment.value = false
  }
}

// Ouvrir/fermer le formulaire de réponse pour un commentaire donné
const toggleReply = (commentId: number) => {
  replyingToId.value = replyingToId.value === commentId ? null : commentId
  replyContent.value = ''
}

// Soumission d'une réponse à un commentaire
const handleAddReply = async (parentId: number) => {
  if (!replyContent.value.trim() || submittingReply.value) return

  submittingReply.value = true
  try {
    await discussionStore.addComment(Number(discussionId), replyContent.value, parentId)
    replyContent.value = ''
    replyingToId.value = null
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la réponse', error)
  } finally {
    submittingReply.value = false
  }
}

// Suppression d'un commentaire ou d'une réponse (auteur uniquement)
const handleDeleteComment = async (commentId: number) => {
  if (!confirm('Supprimer ce commentaire ?')) return
  try {
    await discussionStore.deleteComment(commentId)
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire', error)
  }
}
</script>

<template>
  <div class="max-w-[1000px] mx-auto px-6 py-8">

    <!-- Zone d'état : Chargement -->
    <div v-if="discussionStore.loading" class="text-center py-12">
      <span class="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      <p class="mt-2 text-sm text-outline">Chargement de la discussion...</p>
    </div>

    <!-- Zone d'état : Erreur ou non trouvé -->
    <div v-else-if="!discussionStore.currentDiscussion" class="text-center py-12">
      <h2 class="text-xl font-bold text-on-surface">Discussion introuvable</h2>
      <p class="text-sm text-outline mt-1">L'URL demandée n'existe pas ou a été supprimée.</p>
      <RouterLink to="/" class="mt-4 inline-block text-xs font-bold text-primary hover:underline">
        &larr; Retour à l'accueil
      </RouterLink>
    </div>

    <!-- Vue principale de la discussion -->
    <main v-else class="space-y-8">

      <!-- Lien / Header de la discussion -->
    <!-- Dans le header de DiscussionView.vue -->
<header class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm space-y-4">
  <div class="flex items-center gap-2">
    <span class="inline-flex items-center gap-1.5 text-primary bg-primary-fixed/50 px-2.5 py-1 rounded-md text-xs font-mono font-semibold">
      <span class="material-symbols-outlined text-[14px]">public</span>
      {{ discussionStore.currentDiscussion.domain || 'web' }}
    </span>
    <span class="text-xs text-outline font-bold uppercase tracking-wider">
      {{ discussionStore.currentDiscussion.category || 'Général' }}
    </span>
  </div>

  <!-- Utilisation du titre s'il existe et est différent de l'URL brute -->
  <h1 class="text-2xl font-extrabold font-headline text-on-surface">
  {{ discussionStore.currentDiscussion.title || discussionStore.currentDiscussion.domain || 'Discussion' }}
</h1>


   <a :href="discussionStore.currentDiscussion.url"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline break-all"
  >
    <span class="material-symbols-outlined text-[16px]">open_in_new</span>
    Visiter le site source
  </a>

  <!-- Affichage systématique de l'image (extrait ou fallback) -->
  <div class="mt-4 h-64 w-full rounded-xl overflow-hidden bg-surface-container">
    <img
  :src="discussionStore.currentDiscussion.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop'"
  :alt="discussionStore.currentDiscussion.title || 'Illustration'"
  class="w-full h-full object-cover"
/>
  </div>
</header>
      <!-- Section Commentaires -->
      <section class="space-y-6">
        <h2 class="text-lg font-bold text-on-surface flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">chat</span>
          Commentaires ({{ discussionStore.currentDiscussion.comments?.length || 0 }})
        </h2>

        <!-- Formulaire d'ajout de commentaire -->
        <div v-if="authStore.isAuthenticated" class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-sm space-y-3">
          <textarea
            v-model="newComment"
            rows="3"
            placeholder="Partagez votre avis ou apportez des précisions..."
            class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-outline resize-none"
          ></textarea>
          <div class="flex justify-end">
            <button
              @click="handleAddComment"
              :disabled="!newComment.trim() || submittingComment"
              class="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-surface-tint disabled:opacity-50 rounded-xl transition-all shadow-sm"
            >
              {{ submittingComment ? 'Envoi...' : 'Publier le commentaire' }}
            </button>
          </div>
        </div>

        <div v-else class="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 text-center">
          <p class="text-xs text-on-surface-variant">
            Vous devez être connecté pour participer à la discussion.
            <RouterLink to="/auth" class="text-primary font-bold hover:underline">Se connecter</RouterLink>
          </p>
        </div>

        <!-- Liste des commentaires -->
        <div class="space-y-4">
          <article
            v-for="comment in discussionStore.currentDiscussion.comments"
            :key="comment.id"
            class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-4 shadow-sm space-y-2"
          >
            <div class="flex items-center justify-between text-xs text-outline">
              <span class="font-bold text-on-surface">{{ comment.user?.name || 'Utilisateur anonyme' }}</span>
              <span class="text-[11px]">{{ comment.created_at }}</span>
            </div>
            <p class="text-xs text-on-surface-variant leading-relaxed">
              {{ comment.content }}
            </p>

            <!-- Actions : répondre / supprimer -->
            <div class="flex items-center gap-3 pt-1">
              <button
                v-if="authStore.isAuthenticated"
                @click="toggleReply(comment.id)"
                class="text-[11px] font-bold text-primary hover:underline"
              >
                {{ replyingToId === comment.id ? 'Annuler' : 'Répondre' }}
              </button>
              <button
                v-if="authStore.user?.id === comment.user_id"
                @click="handleDeleteComment(comment.id)"
                class="text-[11px] font-bold text-red-500 hover:underline"
              >
                Supprimer
              </button>
            </div>

            <!-- Formulaire de réponse -->
            <div v-if="replyingToId === comment.id" class="pt-2 space-y-2">
              <textarea
                v-model="replyContent"
                rows="2"
                placeholder="Votre réponse..."
                class="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-outline resize-none"
              ></textarea>
              <div class="flex justify-end">
                <button
                  @click="handleAddReply(comment.id)"
                  :disabled="!replyContent.trim() || submittingReply"
                  class="px-3 py-1.5 text-xs font-bold text-white bg-primary hover:bg-surface-tint disabled:opacity-50 rounded-xl transition-all shadow-sm"
                >
                  {{ submittingReply ? 'Envoi...' : 'Répondre' }}
                </button>
              </div>
            </div>

            <!-- Réponses imbriquées -->
            <div v-if="comment.replies?.length" class="ml-4 pl-4 border-l-2 border-outline-variant/30 space-y-3 pt-2">
              <article
                v-for="reply in comment.replies"
                :key="reply.id"
                class="space-y-1.5"
              >
                <div class="flex items-center justify-between text-xs text-outline">
                  <span class="font-bold text-on-surface">{{ reply.user?.name || 'Utilisateur anonyme' }}</span>
                  <span class="text-[11px]">{{ reply.created_at }}</span>
                </div>
                <p class="text-xs text-on-surface-variant leading-relaxed">
                  {{ reply.content }}
                </p>
                <button
                  v-if="authStore.user?.id === reply.user_id"
                  @click="handleDeleteComment(reply.id)"
                  class="text-[11px] font-bold text-red-500 hover:underline"
                >
                  Supprimer
                </button>
              </article>
            </div>
          </article>

          <p v-if="!discussionStore.currentDiscussion.comments || discussionStore.currentDiscussion.comments.length === 0" class="text-center text-xs text-outline py-6">
            Aucun commentaire pour le moment. Soyez le premier à réagir !
          </p>
        </div>

      </section>

    </main>

  </div>
</template>
