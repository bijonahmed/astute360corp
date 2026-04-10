<?php
namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;
class Roles extends Authenticatable
{
    use HasFactory, Notifiable;
    public $table = "roles";
    protected $fillable = [
        'name',
        'guard_name',
        'role_type',
        'status'
    ];

     
}
