<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useYowlStore } from '../stores/yowl'
import { useAuthStore } from '../stores/auth'

const props = defineProps<{ id: string }>()
const yowlStore = useYowlStore()
const authStore = useAuthStore()

const replyContent = ref('')
const replyingToId = ref<number | null>(null)

onMounted(() => {
  yowlStore.fetchUrlDetails(Number(props.id))
})

const handleReply = async (parentId: number) => {
  if (!replyContent.value || !yowlStore.currentUrl) return
  await yowlStore.addComment({
    url: yowlStore.currentUrl.url,
    content: replyContent.value,
    parent_id: parentId
  })
  replyContent.value = ''
  replyingToId.value = null
}

const handleInteraction = (commentId: number, type: 'like' | 'dislike') => {
  if (!authStore.isAuthenticated) return
  yowlStore.toggleInteraction(commentId, type)
}
</script>

<template>
  <div class="detail-container" v-if="yowlStore.currentUrl">
    <div class="header-card">
      <RouterLink to="/" class="back-link">← Retour aux discussions</RouterLink>
      <h1>{{ yowlStore.currentUrl.domain_name }}</h1>
      <a :href="yowlStore.currentUrl.url" target="_blank" class="full-url">
        {{ yowlStore.currentUrl.url }}
      </a>
    </div>

    <section class="comments-section">
      <h3>Commentaires</h3>

      <div v-if="!yowlStore.currentUrl.comments?.length" class="empty">
        Aucun commentaire pour le moment.
      </div>

      <div v-else class="comments-tree">
        <div
          v-for="comment in yowlStore.currentUrl.comments"
          :key="comment.id"
          class="comment-card"
        >
          <div class="comment-author">{{ comment.user?.name || 'Anonyme' }}</div>
          <div class="comment-body">{{ comment.content }}</div>

          <div class="comment-actions">
            <button @click="handleInteraction(comment.id, 'like')">
              👍 {{ comment.interactions?.filter(i => i.type === 'like').length || 0 }}
            </button>
            <button @click="handleInteraction(comment.id, 'dislike')">
              👎 {{ comment.interactions?.filter(i => i.type === 'dislike').length || 0 }}
            </button>
            <button
              v-if="authStore.isAuthenticated"
              @click="replyingToId = replyingToId === comment.id ? null : comment.id"
            >
              Répondre
            </button>
          </div>

          <!-- Formulaire de réponse -->
          <div v-if="replyingToId === comment.id" class="reply-form">
            <textarea v-model="replyContent" placeholder="Votre réponse..."></textarea>
            <button @click="handleReply(comment.id)">Envoyer la réponse</button>
          </div>

          <!-- Réponses imbriquées -->
          <div v-if="comment.replies && comment.replies.length > 0" class="replies">
            <div v-for="reply in comment.replies" :key="reply.id" class="comment-card reply">
              <div class="comment-author">{{ reply.user?.name || 'Anonyme' }}</div>
              <div class="comment-body">{{ reply.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div v-else class="loading">
    Chargement de la discussion...
  </div>
</template>

<style scoped>
.detail-container {
  max-width: 800px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.back-link {
  color: #3182ce;
  text-decoration: none;
  font-size: 14px;
}

.full-url {
  color: #4a5568;
  word-break: break-all;
}

.comment-card {
  background: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.comment-card.reply {
  margin-left: 24px;
  margin-top: 12px;
  background: #f7fafc;
  border-left: 3px solid #cbd5e0;
}

.comment-author {
  font-weight: bold;
  color: #2d3748;
  font-size: 13px;
  margin-bottom: 4px;
}

.comment-body {
  color: #4a5568;
  font-size: 15px;
  margin-bottom: 10px;
}

.comment-actions {
  display: flex;
  gap: 12px;
}

.comment-actions button {
  background: #edf2f7;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.reply-form {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reply-form textarea {
  padding: 8px;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
}
</style>
