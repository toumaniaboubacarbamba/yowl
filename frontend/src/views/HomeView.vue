<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useYowlStore } from '../stores/yowl'
import { useAuthStore } from '../stores/auth'

const yowlStore = useYowlStore()
const authStore = useAuthStore()

const newUrl = ref('')
const newComment = ref('')
const submitError = ref<string | null>(null)
const isSubmitting = ref(false)

onMounted(() => {
  yowlStore.fetchUrls()
})

const handlePostComment = async () => {
  if (!newUrl.value || !newComment.value) return
  submitError.value = null
  isSubmitting.value = true

  try {
    await yowlStore.addComment({
      url: newUrl.value,
      content: newComment.value
    })
    newUrl.value = ''
    newComment.value = ''
  } catch (err: unknown) {
    if (typeof err === 'string') {
      submitError.value = err
    } else {
      submitError.value = 'Erreur lors de la publication.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="home-container">
    <!-- Formulaire de création de commentaire -->
    <section class="comment-box" v-if="authStore.isAuthenticated">
      <h3>Partager un avis sur un site web</h3>
      <div v-if="submitError" class="error-banner">{{ submitError }}</div>
      <form @submit.prevent="handlePostComment">
        <div class="form-group">
          <label for="url">Lien web (URL)</label>
          <input
            id="url"
            v-model="newUrl"
            type="url"
            required
            placeholder="https://exemple.com/article"
          />
        </div>
        <div class="form-group">
          <label for="comment">Votre commentaire</label>
          <textarea
            id="comment"
            v-model="newComment"
            rows="3"
            required
            placeholder="Que pensez-vous de ce contenu ?"
          ></textarea>
        </div>
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Publication...' : 'Publier' }}
        </button>
      </form>
    </section>

    <div class="info-banner" v-else>
      <p>Connectez-vous pour laisser des commentaires sur les liens web.</p>
    </div>

    <!-- Liste des URLs commentées -->
    <section class="urls-section">
      <h2>Dernières discussions sur le Web</h2>

      <div v-if="yowlStore.loading" class="loading">Chargement...</div>
      <div v-else-if="yowlStore.urls.length === 0" class="empty">
        Aucun lien n'a encore été commenté. Sois le premier !
      </div>

      <div v-else class="url-list">
        <div v-for="item in yowlStore.urls" :key="item.id" class="url-card">
          <div class="url-header">
            <span class="domain">{{ item.domain_name }}</span>
            <span class="comments-badge">{{ item.comments_count || 0 }} avis</span>
          </div>
          <a :href="item.url" target="_blank" rel="noopener noreferrer" class="url-link">
            {{ item.url }}
          </a>
          <div class="url-footer">
            <RouterLink :to="{ name: 'url-detail', params: { id: item.id } }" class="detail-btn">
              Voir la discussion →
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.comment-box, .info-banner {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.comment-box h3 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input, textarea {
  padding: 10px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 14px;
}

button {
  background: #3182ce;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
}

.urls-section h2 {
  font-size: 20px;
  color: #2d3748;
  margin-bottom: 16px;
}

.url-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.url-card {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #3182ce;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.url-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.domain {
  font-weight: bold;
  color: #2b6cb0;
}

.comments-badge {
  background: #edf2f7;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #4a5568;
}

.url-link {
  color: #4a5568;
  word-break: break-all;
  font-size: 14px;
  text-decoration: none;
}

.url-link:hover {
  text-decoration: underline;
}

.url-footer {
  margin-top: 12px;
}

.detail-btn {
  color: #3182ce;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.error-banner {
  background: #fed7d7;
  color: #9b2c2c;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 12px;
}
</style>
