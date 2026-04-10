<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory;

    public $table = "orders";
    protected $fillable = [
        'orderId',
        'customer_id',
        'order_date',
        'payment_type',
        'amount',
        'discount',
        'due',
        'advance',
        'devliery_charge',
        'order_status',
        'subtotal',
        'discount_amount',
        'paymentMethod',
        'grand_total',
        'coupon_code',
        'order_type',
        'orderUpdateDate',
        'bkash_number',
        'transaction_id',
        'shipping_phone',
        'address',
        'coupons',
        'pathao_consignment_id',
        'pathao_merchant_order_id',
        'pathao_order_status',
        'pathao_delivery_fee',
        'orderUpdateby'
    ];
}
