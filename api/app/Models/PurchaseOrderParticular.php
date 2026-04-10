<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;

class PurchaseOrderParticular extends Authenticatable
{
    use HasFactory, Notifiable;
    public $table = "purchase_order_particular";
    protected $fillable = ['supplier_id', 'invNumber', 'billingAddress', 'shippingAddress', 'orderDate', 'remarks', 'grandTotal','transfer_status'];
}
