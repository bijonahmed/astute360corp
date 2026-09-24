<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkSubmit extends Model
{
    use HasFactory;

    public $table = "worksubmit";

    protected $fillable = [
        'employee_id',
        'project_id',
        'work_date',
        'hours',
        'status',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}
