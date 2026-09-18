#  YOWL (v1.5) - Plateforme de Débat Universel(Grin)

YOWL est une application web permettant de commenter et de débattre sur n'importe quelle URL du Web de manière décentralisée.

---

##  État de l'Avancement du Projet

###  Ce qui est fait et fonctionnel

* **Architecture Backend & Frontend** : Découplage complet avec API REST Laravel (Dockerisé) et SPA Vue.js (Vite).
* **Authentification Sanctum** : Inscription, connexion et gestion des tokens d'accès.
* **Système de Discussions / URLs** :
  * Ajout et stockage des liens soumis par les utilisateurs.
  * Détection automatique du domaine.
  * Extraction du vrai titre / image via Microlink, avec repli propre sur le domaine si le scraping échoue (`UrlController`).
  * Navigation vers le détail d'une discussion en cliquant sur une carte.
* **Interface Utilisateur (Vue.js)** :
  * Navbar dynamique avec état connecté/déconnecté.
  * Affichage en grille des discussions actives.
  * Vue dédiée pour le détail d'une discussion (`/discussion/:id`).
* **Système de Commentaires** :
  * Ajout d'un commentaire sur la page de détail.
  * Réponses imbriquées à un commentaire (`parent_id`).
  * Suppression de son propre commentaire ou de sa propre réponse (bouton visible uniquement pour l'auteur).

---

##  Reste à Faire (Roadmap)

- [ ] **Modification de commentaire** : aucun endpoint `update` n'existe encore côté backend, ni de bouton "modifier" côté UI (seule la suppression est possible pour le moment).
- [ ] **Interactions & Réactions** :
  * Le backend `InteractionController` permet déjà de liker/disliker un **commentaire**, mais rien n'appelle cette route côté UI (`comment_id` requis).
  * À décider : ajouter aussi des votes upvote/downvote sur la **discussion/URL elle-même** (fonctionnalité différente, pas encore commencée du tout côté backend ni frontend).
- [ ] **Recherche & Filtres** :
  * Aucune barre de recherche fonctionnelle nulle part dans le code actuel — à construire de zéro (backend et frontend).
  * Filtrer par catégorie : la catégorie est toujours "Général" en pratique car le formulaire d'ajout de lien n'envoie jamais de `category` — il faut d'abord ajouter ce choix à l'UI avant que le filtre ait un sens.
- [ ] **Robustesse du scraping en production** : tester le comportement de Microlink hors environnement Docker local (l'échec silencieux en cas de `status: fail` est maintenant loggé, mais pas encore de stratégie de repli type scraping HTML natif si Microlink devient indisponible).
- [ ] **Déploiement** :
  * Préparer la mise en ligne (Render / Railway / Fly.io pour le backend Laravel, Vercel / Netlify pour le frontend Vue.js).

---

##  Lancement Rapide (Docker Local)

```bash
# Lancer les conteneurs
docker compose up -d

# Exécuter les migrations
docker compose exec backend php artisan migrate
```
