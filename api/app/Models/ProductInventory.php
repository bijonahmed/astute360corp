<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;

class ProductInventory extends Authenticatable
{
    use HasFactory, Notifiable;
    public $table = "product_inventory";
    protected $fillable = [
        'user_id',
        'product_id',
        'attribute_variation',
        'qty_in',
        'stock_date',
    ];
}
