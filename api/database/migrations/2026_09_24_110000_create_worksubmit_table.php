<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('worksubmit', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->unsignedBigInteger('project_id');
            $table->date('work_date');
            $table->decimal('hours', 5, 2)->default(0);
            $table->integer('status')->default(0);
            $table->timestamps();

            $table->index('employee_id');
            $table->index('project_id');
            $table->index('work_date');
            $table->index('status');
            $table->index(['employee_id', 'work_date']);
            $table->unique(['employee_id', 'project_id', 'work_date']);
            $table->foreign('employee_id')->references('id')->on('employee')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('project')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('worksubmit');
    }
};
