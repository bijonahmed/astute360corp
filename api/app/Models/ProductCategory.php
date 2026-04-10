<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;

class ProductCategory extends Authenticatable
{
    use HasFactory, Notifiable;
    public $table = "categorys";
    protected $fillable = [
        'id',
        'name',
        'slug',
        'sorting',
        'parent_id',
        'parent_child_id',
        'banner_sub_cat_image',
        'category_image_inside_page',
        'thumbnail_image',
        'banner_image',
        'sort_order',
        'tabs_status',
        'insubCategoryImage',
        'status',
    ];

    public function parentChild()
    {
        return $this->belongsTo(ProductCategory::class, 'parent_child_id');
    }

    public function parent()
    {
        return $this->belongsTo(ProductCategory::class, 'parent_id');
    }
}
