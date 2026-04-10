<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;

class ProductsGallery extends Authenticatable
{
    use HasFactory, Notifiable;
    public $table = "product_img_history";
    protected $fillable = [
        'product_id',
        'gallery_image',
       
    ];
}
