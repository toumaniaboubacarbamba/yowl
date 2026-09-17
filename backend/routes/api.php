<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\InteractionController;
use App\Http\Controllers\UrlController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Auth publique
Route::post('/register', [App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\AuthController::class, 'login']);

// URLs Publiques
Route::get('/urls', [UrlController::class, 'index']);
Route::get('/urls/{id}', [UrlController::class, 'show']);

// Routes protégées (nécessitent un Bearer Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Commentaires
    Route::post('/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    // Interactions (Like/Dislike)
    Route::post('/interactions', [InteractionController::class, 'toggle']);
});
