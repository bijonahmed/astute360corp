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
        Schema::create('employee', function (Blueprint $table) {
            $table->id();

            // Personal Information
            $table->string('employee_code')->nullable();
            $table->string('name');
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->integer('age')->nullable();
            $table->string('gender')->nullable();
            $table->string('marital_status')->nullable();
            $table->string('blood_group')->nullable();
            $table->string('photo')->nullable();

            // Contact Information
            $table->string('mobile');
            $table->string('alternative_mobile')->nullable();
            $table->string('email');
            $table->text('present_address')->nullable();
            $table->text('permanent_address')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_mobile')->nullable();
            $table->string('emergency_contact_relation')->nullable();

            // Job Information
            $table->unsignedBigInteger('project_id')->nullable();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->unsignedBigInteger('designation_id')->nullable();
            $table->date('joining_date')->nullable();
            $table->string('employment_type')->nullable();
            $table->string('employee_status')->nullable();
            $table->string('reporting_to')->nullable();
            $table->string('work_location')->nullable();
            $table->string('shift')->nullable();
            $table->decimal('basic_salary', 12, 2)->nullable();
            $table->decimal('gross_salary', 12, 2)->nullable();

            // Identity & Documents
            $table->string('nid_number')->nullable();
            $table->string('passport_number')->nullable();
            $table->date('passport_expiry_date')->nullable();
            $table->string('birth_certificate_number')->nullable();
            $table->string('driving_license_number')->nullable();

            // Bank / Payment Information
            $table->string('bank_name')->nullable();
            $table->string('bank_account_name')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('branch_name')->nullable();
            $table->string('routing_number')->nullable();
            $table->string('payment_method')->nullable();

            // Education
            $table->string('highest_education')->nullable();
            $table->string('institution_name')->nullable();
            $table->string('passing_year')->nullable();

            // System Information
            $table->string('username')->nullable();
            $table->string('password')->nullable();
            $table->integer('status')->default(1);
            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee');
    }
};
