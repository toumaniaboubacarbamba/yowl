<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDiscussionStore } from '../stores/discussions'

const targetUrl = ref('')
const discussionStore = useDiscussionStore()
const router = useRouter()

const handleSearchOrSubmit = async () => {
  if (!targetUrl.value.trim()) return

  try {
    const created = await discussionStore.createDiscussion(targetUrl.value)
    if (created && created.id) {
      router.push(`/discussion/${created.id}`)
    }
  } catch {
    // L'erreur est disponible dans discussionStore.error
  }
}
</script>

<template>
  <section class="py-12 px-6 bg-gradient-to-b from-surface-container-low to-background border-b border-outline-variant/20">
    <div class="max-w-4xl mx-auto text-center space-y-6">

      <!-- Titre principal -->
      <div class="space-y-2">
        <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface font-headline">
          Commentez <span class="text-primary underline decoration-primary/30">absolument tout</span> sur le Web.
        </h1>
        <p class="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto">
          Décentralisez les discussions. Entrez une URL pour ouvrir un espace de débat libre.
        </p>
      </div>

      <!-- Omnibar -->
      <form @submit.prevent="handleSearchOrSubmit" class="relative max-w-2xl mx-auto flex items-center shadow-lg rounded-2xl overflow-hidden bg-surface-container-lowest border border-outline-variant/50 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
        <div class="pl-4 text-outline flex items-center">
          <span class="material-symbols-outlined text-2xl">link</span>
        </div>

        <input
          v-model="targetUrl"
          type="text"
          placeholder="Collez n'importe quelle URL (ex: https://site.com/article)..."
          class="w-full py-4 px-3 text-base text-on-surface bg-transparent focus:outline-none placeholder:text-outline/70"
          :disabled="discussionStore.loading"
        />

        <button
          type="submit"
          :disabled="discussionStore.loading"
          class="m-1.5 px-6 py-3 bg-primary hover:bg-surface-tint text-white font-semibold rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-md disabled:opacity-50"
        >
          <span>{{ discussionStore.loading ? 'Traitement...' : 'Ouvrir' }}</span>
          <span class="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </form>

      <!-- Erreur éventuelle -->
      <p v-if="discussionStore.error" class="text-xs text-error font-semibold">
        {{ discussionStore.error }}
      </p>

      <!-- Badges -->
      <div class="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-medium text-on-surface-variant">
        <span class="px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Commentaires universels
        </span>
        <span class="px-3 py-1 rounded-full bg-surface-container border border-outline-variant/20 text-outline flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">extension</span>
          Extension Navigateur <span class="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary-fixed px-1 rounded">Bientôt</span>
        </span>
      </div>

    </div>
  </section>
</template>
