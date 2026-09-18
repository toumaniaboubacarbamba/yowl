<?php

namespace App\Http\Controllers;

use App\Models\Url;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class UrlController extends Controller
{
    public function index()
    {
        return response()->json(
            Url::withCount('comments')->orderBy('created_at', 'desc')->get()
        );
    }

    public function show($id)
    {
        $url = Url::with(['comments.user', 'comments.interactions', 'comments.replies.user'])->find($id);

        if (!$url) {
            return response()->json(['message' => 'URL non trouvée'], 404);
        }

        return response()->json($url);
    }


public function store(Request $request)
{
    $request->validate([
        'url' => 'required|url',
    ]);

    $rawUrl = $request->url;
    $host = parse_url($rawUrl, PHP_URL_HOST);
    $domain = $host ? preg_replace('/^www\./', '', $host) : 'web';

    $title = null;
    $imageUrl = null;

    try {
        // Encodage propre de l'URL pour éviter les erreurs HTTP 400
        $apiUrl = 'https://api.microlink.io/?url=' . urlencode($rawUrl);

        $response = Http::withoutVerifying()
            ->withHeaders(['User-Agent' => 'Mozilla/5.0'])
            ->timeout(10)
            ->get($apiUrl);

        if ($response->successful()) {
            $data = $response->json();
            if (isset($data['status']) && $data['status'] === 'success') {
                $title = $data['data']['title'] ?? null;
                $imageUrl = $data['data']['image']['url'] ?? null;
            } else {
                \Illuminate\Support\Facades\Log::warning('Microlink status non "success" pour ' . $rawUrl . ' : ' . json_encode($data));
            }
        } else {
            \Illuminate\Support\Facades\Log::error('Microlink HTTP Error: ' . $response->status() . ' - Body: ' . $response->body());
        }
    } catch (\Exception $e) {
        \Illuminate\Support\Facades\Log::error('Microlink Exception: ' . $e->getMessage());
    }

    $finalTitle = (!empty($title) && $title !== $rawUrl) ? $title : $domain;
    $finalImage = !empty($imageUrl) ? $imageUrl : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop';

    $urlRecord = Url::firstOrCreate(
        ['url' => $rawUrl],
        [
            'title'     => $finalTitle,
            'domain'    => $domain,
            'category'  => $request->category ?? 'Général',
            'image_url' => $finalImage
        ]
    );

    return response()->json($urlRecord, 201);
}
}
