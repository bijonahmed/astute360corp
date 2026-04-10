<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;

class PurchaseOrderInvoice extends Authenticatable
{
    use HasFactory, Notifiable;
    public $table = "purchase_order_invoice";
    protected $fillable = ['purchase_order_id', 'description', 'sku', 'attribute', 'qty', 'price'];

    
}
