<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderHistory extends Model
{
    use HasFactory;
   
    public $table = "order_history";
    protected $fillable = ['order_id', 'product_id','attribue_id', 'variation_value','qty','price','total_price'];
    
}

