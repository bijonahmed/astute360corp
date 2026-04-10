<?php
namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;
class RoleHasPermissions extends Authenticatable
{
    use HasFactory, Notifiable;
    public $table = "role_has_permissions";
    protected $fillable = [
        'permission_id',
        'role_id',
    ];

     
}
