<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('faculty', function (Blueprint $table) {
            $table->id();
            $table->string('employee_no', 50)->unique();
            $table->string('name');
            $table->unsignedBigInteger('department_id');
            $table->string('status')->default('active');
            $table->timestamps();

            $table->foreign('department_id')->references('id')->on('departments')->cascadeOnUpdate()->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faculty');
    }
};
