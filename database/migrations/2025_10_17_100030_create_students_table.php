<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('student_no', 50)->unique();
            $table->string('name');
            $table->unsignedBigInteger('course_id');
            $table->unsignedTinyInteger('year_level')->default(1);
            $table->string('status')->default('active');
            $table->timestamps();

            $table->foreign('course_id')->references('id')->on('courses')->cascadeOnUpdate()->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
