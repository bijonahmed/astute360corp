<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'emp_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->unsignedBigInteger('emp_id')->nullable()->after('id')->index();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('users', 'emp_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('emp_id');
            });
        }
    }
};
