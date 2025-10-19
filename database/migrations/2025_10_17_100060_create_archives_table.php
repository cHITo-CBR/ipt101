<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('archives', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('archivable_id');
            $table->string('archivable_type');
            $table->string('category');
            $table->json('data_snapshot')->nullable();
            $table->unsignedBigInteger('archived_by')->nullable();
            $table->timestamp('archived_at')->nullable();
            $table->string('remarks')->nullable();
            $table->timestamps();

            $table->index(['category']);
            $table->index(['archivable_type', 'archivable_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('archives');
    }
};
