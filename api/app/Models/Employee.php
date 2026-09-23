<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    public $table = "employee";

    protected $fillable = [
        'employee_code',
        'name',
        'father_name',
        'mother_name',
        'date_of_birth',
        'age',
        'gender',
        'marital_status',
        'blood_group',
        'photo',
        'mobile',
        'alternative_mobile',
        'email',
        'present_address',
        'permanent_address',
        'emergency_contact_name',
        'emergency_contact_mobile',
        'emergency_contact_relation',
        'project_id',
        'department_id',
        'designation_id',
        'joining_date',
        'employment_type',
        'employee_status',
        'reporting_to',
        'work_location',
        'shift',
        'basic_salary',
        'gross_salary',
        'nid_number',
        'passport_number',
        'passport_expiry_date',
        'birth_certificate_number',
        'driving_license_number',
        'bank_name',
        'bank_account_name',
        'bank_account_number',
        'branch_name',
        'routing_number',
        'payment_method',
        'highest_education',
        'institution_name',
        'passing_year',
        'username',
        'password',
        'status',
        'remarks',
    ];

    protected $hidden = [
        'password',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function designation()
    {
        return $this->belongsTo(Designation::class, 'designation_id');
    }

    public function payslips()
    {
        return $this->hasMany(Payslip::class, 'employee_id');
    }
}
