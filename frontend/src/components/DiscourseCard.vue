<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    url: string
    domain?: string
    category?: string
    commentsCount?: number
    comments_count?: number
    upvotesCount?: number
    upvotes_count?: number
    createdAt?: string
    created_at?: string
    imageUrl?: string
    image_url?: string
  }>(),
  {
    title: '',
    domain: 'web',
    category: 'Général',
    commentsCount: 0,
    comments_count: 0,
    upvotesCount: 0,
    upvotes_count: 0,
    createdAt: 'Récemment',
    created_at: 'Récemment'
  }
)

defineEmits(['vote', 'open'])
</script>

<!-- src/components/DiscourseCard.vue -->
<template>
<div
  class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group space-y-3 cursor-pointer"
  @click="$emit('open')"
>
    <div class="flex items-center justify-between">
      <span class="inline-flex items-center gap-1.5 text-primary bg-primary-fixed/50 px-2.5 py-1 rounded-md text-xs font-mono font-semibold">
        <span class="material-symbols-outlined text-[14px]">public</span>
        {{ domain || 'web' }}
      </span>
      <span class="text-xs text-outline font-bold uppercase tracking-wider">
        {{ category || 'Général' }}
      </span>
    </div>

    <!-- Affichage du titre avec filtre strict sur les faux titres -->
    <h3 class="text-base font-bold font-headline text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
      {{ (title && !['Sans titre', 'Discussion', 'web'].includes(title)) ? title : (domain || url) }}
    </h3>

    <p class="text-xs text-outline font-mono truncate">
      {{ url }}
    </p>

    <!-- Affichage de l'image si présente -->
    <div v-if="image_url || imageUrl" class="h-36 w-full rounded-xl overflow-hidden bg-surface-container mt-2">
      <img
        :src="image_url || imageUrl"
        :alt="title || 'Illustration'"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>

  </div>
</template>
