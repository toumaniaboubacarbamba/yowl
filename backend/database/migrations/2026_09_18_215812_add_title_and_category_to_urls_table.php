<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('urls', function (Blueprint $table) {
            // Renomme domain_name en domain pour matcher ce que le frontend attend
            $table->renameColumn('domain_name', 'domain');
            $table->string('title')->nullable()->after('domain');
            $table->string('category')->nullable()->default('Général')->after('title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('urls', function (Blueprint $table) {
            $table->dropColumn(['title', 'category']);
            $table->renameColumn('domain', 'domain_name');
        });
    }
};
