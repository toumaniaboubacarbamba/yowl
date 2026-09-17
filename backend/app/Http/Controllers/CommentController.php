<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Url;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // Publier un commentaire sur une URL
    public function store(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        // Vérifier si l'URL existe déjà ou la créer
        $domain = parse_url($request->url, PHP_URL_HOST);
        $urlRecord = Url::firstOrCreate(
            ['url' => $request->url],
            ['domain_name' => $domain]
        );

        // Créer le commentaire
        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'url_id' => $urlRecord->id,
            'parent_id' => $request->parent_id,
            'content' => $request->content,
        ]);

        return response()->json($comment->load('user'), 201);
    }

    // Supprimer un commentaire (Auteur uniquement)
    public function destroy(Request $request, $id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Commentaire introuvable'], 404);
        }

        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Action non autorisée'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Commentaire supprimé']);
    }
}
