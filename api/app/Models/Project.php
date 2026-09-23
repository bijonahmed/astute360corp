<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;

class Project extends Authenticatable
{
    use HasFactory, Notifiable;
    public $table = "project";
    protected $fillable = [
        'name',
        'status',
    ];
}
