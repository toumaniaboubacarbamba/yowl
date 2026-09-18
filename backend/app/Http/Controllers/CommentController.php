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
            'url_id'    => 'nullable|exists:urls,id',
            'url'       => 'nullable', // On retire la contrainte strict |url ici
            'content'   => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        $urlId = $request->url_id;

        // Si l'ID n'est pas renseigné dans url_id mais transmis dans 'url'
        if (!$urlId && $request->url) {
            if (is_numeric($request->url)) {
                $urlId = (int) $request->url;
            } else if (filter_var($request->url, FILTER_VALIDATE_URL)) {
                $domain = parse_url($request->url, PHP_URL_HOST) ?? 'web';
                $urlRecord = Url::firstOrCreate(
                    ['url' => $request->url],
                    ['domain' => $domain]
                );
                $urlId = $urlRecord->id;
            }
        }

        if (!$urlId) {
            return response()->json(['message' => 'Une URL valide ou un ID d\'URL est requis.'], 422);
        }

        // Création du commentaire
        $comment = Comment::create([
            'user_id'   => $request->user()->id,
            'url_id'    => $urlId,
            'parent_id' => $request->parent_id,
            'content'   => $request->content,
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

        // Modifier un commentaire (Auteur uniquement)
    public function update(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Commentaire introuvable'], 404);
        }

        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Action non autorisée'], 403);
        }

        $comment->update([
            'content' => $request->content,
        ]);

        return response()->json($comment->load('user'));
    }
}
