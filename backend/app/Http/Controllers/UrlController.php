<?php

namespace App\Http\Controllers;
use App\Models\Url;
use Illuminate\Http\Request;

class UrlController extends Controller
{
    // Lister toutes les URLs avec le nombre de commentaires
    public function index()
    {
        return response()->json(
            Url::withCount('comments')->orderBy('created_at', 'desc')->get()
        );
    }

    // Récupérer une URL spécifique avec ses commentaires et réactions
    public function show($id)
    {
        $url = Url::with(['comments.user', 'comments.interactions', 'comments.replies.user'])->find($id);

        if (!$url) {
            return response()->json(['message' => 'URL non trouvée'], 404);
        }

        return response()->json($url);
    }
}
