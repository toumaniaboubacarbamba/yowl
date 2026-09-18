<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="bg-surface-container-lowest border-t border-outline-variant/20 mt-auto py-5 px-6">
    <div class="max-w-[1320px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">

      <!-- Logo + Version -->
      <div class="flex items-center gap-2">
        <span class="font-headline font-extrabold text-base text-primary tracking-tight">YOWL</span>
        <span class="text-[10px] text-outline font-mono bg-surface-container px-1.5 py-0.5 rounded">v1.4</span>
        <span class="text-outline hidden md:inline">| Débat libre & vérification collaborative</span>
      </div>

      <!-- Liens essentiels -->
      <div class="flex items-center gap-5 font-semibold text-on-surface-variant">
        <RouterLink to="/" class="hover:text-primary transition-colors">Accueil</RouterLink>
        <a href="#" class="hover:text-primary transition-colors">Règles</a>
        <a href="#" class="hover:text-primary transition-colors">API</a>
        <a href="#" class="hover:text-primary transition-colors">Confidentialité</a>
      </div>

      <!-- Copyright -->
      <div class="text-[11px] text-outline font-mono">
        © 2026 YOWL
      </div>

    </div>
  </footer>
</template>
