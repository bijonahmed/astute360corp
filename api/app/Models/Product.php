<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;

class Product extends Authenticatable
{
    use HasFactory, Notifiable;
    public $table = "product";
    protected $fillable = [
        'name',
        'slug',
        'description_full',
        'supplier_id',
        'meta_title',
        'meta_description',
        'meta_keyword',
        'categoryId',
        'subcategoryId',
        'price',
        'discount_price',
        'inSubcategoryId',
        'unit',
        'stock_qty',
        'stock_mini_qty',
        'shipping_days',
        'thumnail_img',
        'first_update',
        'status',
        'entry_by'
    ];
}
