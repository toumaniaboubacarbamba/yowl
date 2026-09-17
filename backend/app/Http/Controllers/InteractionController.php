<?php

namespace App\Http\Controllers;

use App\Models\Interaction;
use Illuminate\Http\Request;

class InteractionController extends Controller
{
    // Ajouter ou mettre à jour un Like/Dislike
    public function toggle(Request $request)
    {
        $request->validate([
            'comment_id' => 'required|exists:comments,id',
            'type' => 'required|in:like,dislike',
        ]);

        $userId = $request->user()->id;

        // Met à jour si la réaction existe déjà, sinon la crée
        $interaction = Interaction::updateOrCreate(
            [
                'user_id' => $userId,
                'comment_id' => $request->comment_id,
            ],
            [
                'type' => $request->type,
            ]
        );

        return response()->json($interaction);
    }
}
