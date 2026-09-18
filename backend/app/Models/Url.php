<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['url', 'domain', 'title', 'category', 'image_url'])]
class Url extends Model
{
    use HasFactory;

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
