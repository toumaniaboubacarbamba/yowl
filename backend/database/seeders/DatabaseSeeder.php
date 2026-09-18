<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Interaction;
use App\Models\Url;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Création d'utilisateurs de test
        $user1 = User::create([
            'name' => 'Alice Dev',
            'email' => 'alice@example.com',
            'password' => Hash::make('password123'),
        ]);

        $user2 = User::create([
            'name' => 'Bob Tester',
            'email' => 'bob@example.com',
            'password' => Hash::make('password123'),
        ]);

        // 2. Création d'URLs de test
        $url1 = Url::create([
            'url' => 'https://laravel.com/docs',
            'domain_name' => 'laravel.com',
        ]);

        $url2 = Url::create([
            'url' => 'https://vuejs.org/guide/introduction.html',
            'domain_name' => 'vuejs.org',
        ]);

        // 3. Création de commentaires principaux
        $comment1 = Comment::create([
            'user_id' => $user1->id,
            'url_id' => $url1->id,
            'content' => 'La documentation de Laravel est excellente et très claire !',
        ]);

        $comment2 = Comment::create([
            'user_id' => $user2->id,
            'url_id' => $url2->id,
            'content' => 'Vue 3 avec le Composition API est ultra performant.',
        ]);

        // 4. Création d'une réponse à un commentaire (thread)
        Comment::create([
            'user_id' => $user2->id,
            'url_id' => $url1->id,
            'parent_id' => $comment1->id,
            'content' => 'Je suis totalement d\'accord avec toi Alice !',
        ]);

        // 5. Ajout de réactions (Likes / Dislikes)
        Interaction::create([
            'user_id' => $user2->id,
            'comment_id' => $comment1->id,
            'type' => 'like',
        ]);

        Interaction::create([
            'user_id' => $user1->id,
            'comment_id' => $comment2->id,
            'type' => 'like',
        ]);
    }
}
