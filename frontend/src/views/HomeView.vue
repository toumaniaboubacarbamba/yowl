<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HeroOmnibar from '../components/HeroOmnibar.vue'
import DiscourseCard from '../components/DiscourseCard.vue'
import { useDiscussionStore } from '../stores/discussions'

const discussionStore = useDiscussionStore()
const router = useRouter()

onMounted(() => {
  discussionStore.fetchDiscussions()
})

const openDiscussion = (id: number) => {
  router.push(`/discussion/${id}`)
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <HeroOmnibar />

    <section class="max-w-[1320px] mx-auto px-6 py-10">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-bold font-headline text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">forum</span>
            Discussions actives sur le Web
          </h2>
          <p class="text-sm text-on-surface-variant">
            Les pages web les plus commentées par la communauté en ce moment.
          </p>
        </div>
      </div>

      <!-- Squelette de chargement -->
      <div v-if="discussionStore.loading" class="text-center py-12 text-outline">
        Chargement des discussions en cours...
      </div>

      <!-- Liste vide -->
      <div v-else-if="discussionStore.discussions.length === 0" class="text-center py-12 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/50">
        <p class="text-on-surface-variant text-sm">Aucune discussion pour le moment. Soyez le premier à coller une URL ci-dessus !</p>
      </div>

      <!-- Grille dynamique -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DiscourseCard
          v-for="item in discussionStore.discussions"
          :key="item.id"
          v-bind="item"
          @open="openDiscussion(item.id)"
        />
      </div>
    </section>
  </div>
</template>
