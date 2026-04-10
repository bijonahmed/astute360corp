<?php

namespace App\Http\Controllers\Api\ConfirmOrders;

use App\Http\Controllers\Controller;
use App\Models\OrderHistory;
use App\Models\Orders;
use App\Models\OrderStatus;
use App\Models\RuleModel;
use App\Models\User;
use DB;
use File;
use Helper;
use Illuminate\Http\Request;
use App\Models\ProductCategory;
use App\Models\ProductsAttribues;
use App\Models\ProductsGallery;
use App\Models\Setting;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Validator;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;


class ConfirmOrdersController extends Controller
{

    public function confirmOrder(Request $request)
    {

        //    dd($request->all());

        $cart = $request->cart;
        if (empty($cart)) {
            return response()->json([
                'success' => false,
                'message' => 'Cart is empty.',
            ], 400);
        }
        $couponoffer = $request->couponoffer ?? '';

        // dd($couponoffer);
        // Validation rules
        $rdata = $request->input('data');
        $checkFirstEmail = $rdata['email'] ?? '';

        $checkUserData = User::whereRaw('LOWER(email) = ?', [strtolower($checkFirstEmail)])->first();
        //dd($chkUserMail);

        if ($checkUserData) {
            // EXISTING USER → Only shipping info required
            $rules = [
                'data.shipping_phone'  => ['required', 'regex:/^[0-9+\-\s]+$/', 'max:20'],
                'data.address'         => 'required',
                'data.paymentMethod'   => 'required',
                'cart'                 => 'required|array|min:1',
            ];

            $messages = [
                'data.shipping_phone.required' => 'Shipping phone number is required.',
                'data.shipping_phone.regex'    => 'Shipping phone number format is invalid.',
                'data.address.required'        => 'Shipping address is required.',
                'data.paymentMethod.required'  => 'Payment method is required.',
                'cart.required'                => 'Cart cannot be empty.',
            ];
        } else {
            // NEW USER → All fields required
            $rules = [
                'data.name'            => 'required|string|max:255',
                'data.email'           => 'required|email|max:255',
                'data.phone'           => ['required', 'regex:/^[0-9+\-\s]+$/', 'max:12'],
                'data.shipping_phone'  => ['required', 'regex:/^[0-9+\-\s]+$/', 'max:20'],
                'data.address'         => 'required',
                'data.paymentMethod'   => 'required',
                'cart'                 => 'required|array|min:1',
            ];

            $messages = [
                'data.name.required'           => 'Name is required---.',
                'data.email.required'          => 'Email is required.--',
                'data.email.email'             => 'Email must be a valid email address.--',
                'data.phone.required'          => 'Phone number is required.--',
                'data.phone.regex'             => 'Phone number format is invalid.---',
                'data.shipping_phone.required' => 'Shipping phone number is required.',
                'data.shipping_phone.regex'    => 'Shipping phone number format is invalid.',
                'data.address.required'        => 'Shipping address is required.',
                'data.paymentMethod.required'  => 'Payment method is required.',
                'cart.required'                => 'Cart cannot be empty.',
            ];
        }

        // FINAL VALIDATION
        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'message' => 'Validation failed',
            ], 422);
        }




        $requestdata = $request->input('data');
        // dd($requestdata);

        if ($checkUserData) {
            $data['name']    = $checkUserData->name ?? '';
            $data['email']   = $checkUserData->email ?? '';
            $data['phone']   = $checkUserData->phone ?? '';
            // $data['check'] = 'fetech from database';
        } else {
            $data['name']    = $requestdata['name'];
            $data['email']   = $requestdata['email'] ?? '';
            $data['phone']   = $requestdata['phone'];
            // $data['check'] = 'request data';
        }

        // dd($data);

        $data['address'] = $requestdata['address'];
        $data['shipping_phone'] = $requestdata['shipping_phone'];

        $devliery_charge = $requestdata['devliery_charge'];
        $bkash_number    = $requestdata['bkash_number'];
        $transaction_id  = $requestdata['transaction_id'];

        $checkPhone = $requestdata['phone'];
        $checkEmail = $requestdata['email'];
        $password   =  '123456';
        // Step 1: Check by email first
        $chkuser = User::where('email', $checkEmail)->first();
        // Step 2: If not found by email, check by phone number
        if (! $chkuser) {
            $chkuser = User::where('phone_number', $checkPhone)->first();
        }

        if (! $chkuser) {
            // New user registration
            $user = new User;
            $user->name         = $requestdata['name'] ?? '';
            $user->email        = $checkEmail;
            $user->address      = $requestdata['address'] ?? '';
            $user->role_type    = 4;
            $user->status       = 1;
            $user->phone_number = $checkPhone;
            //$user->show_password = '123456';
            $user->password = Hash::make($password);
            $user->save(); // First save to get $user->id

            $inviteCode = $this->generateUniqueRandomNumber();
            $ids = 'V-' . sprintf('%09d', $user->id);

            //$user->inviteCode = $inviteCode;
            //$user->vogexi_id = $ids;
            $user->save(); // Save again with generated values

            $customer_id = $user->id;
        } else {
            $customer_id = $chkuser->id;
        }
        // dd($data);
        $couponRaw = $request->coupon;
        $coupon = is_string($couponRaw) ? json_decode($couponRaw, true) : $couponRaw;
        $setting = Setting::find(1);
        $dvCharge = $devliery_charge;

        $subtotal = 0;
        foreach ($cart as $item) {
            $subtotal += $item['price'] * $item['qty'];
        }

        $discount = 0;
        $discountAmount = 0;
        $grandTotal = $subtotal + $dvCharge;

        if ($coupon && isset($coupon['discountPercent'])) {
            $discount           = (float) $coupon['discountPercent'];
            $discountAmount     = (float) $coupon['discountAmount'];
            $grandTotal         = $subtotal - $discountAmount + $dvCharge;
        }

        $nextId = (Orders::max('id') ?? 0) + 1;
        $orderId = str_pad($nextId, 8, '0', STR_PAD_LEFT);

        $order = new \App\Models\Orders;
        $order->customer_id         = $customer_id;
        $order->orderId             = $orderId;
        $order->subtotal            = $subtotal;
        $order->discount            = $discount;
        $order->shipping_phone      = $requestdata['shipping_phone'];
        $order->address             = $requestdata['address'] ?? '';
        $order->paymentMethod       = $requestdata['paymentMethod'] ?? '';
        $order->discount_amount     = $discountAmount;
        $order->grand_total         = $grandTotal;
        $order->bkash_number        = $bkash_number;
        $order->transaction_id      = $transaction_id;
        $order->devliery_charge     = $dvCharge;
        $order->coupon_code         = $coupon['couponCode'] ?? null;
        $order->order_status        = 1;
        $order->order_date          = date('Y-m-d');
        $order->order_type          = 1; //1=online 2=instant_order

        $coupons = [];

        foreach ($cart as $item) {
            $number = str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT);
            while (in_array($number, $coupons)) {
                $number = str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT);
            }

            $coupons[] = $number;
        }
        if ($couponoffer == 'couponoffer') {

            $order->coupons = implode(',', $coupons);
        } else {
            $order->coupons = '';
        }
        //$order->coupons = implode(',', $coupons);

        $coupon_code = implode(',', $coupons) ?? null;

        $order->save();

        $lastInsertId = $order->id;
        $longOrderId = $order->orderId;

        $cart = $request->cart;
        //dd($cart);
        $orderId = $lastInsertId; // Replace with actual order ID (if you have it)

        foreach ($cart as $item) {

            // Safely get selected attribute id
            $selectedAttrId = null;
            if (isset($item['selectedAttr'])) {
                if (is_array($item['selectedAttr']) && count($item['selectedAttr']) > 0) {
                    $selectedAttrId = $item['selectedAttr'][0];
                } elseif (!is_array($item['selectedAttr'])) {
                    $selectedAttrId = $item['selectedAttr'];
                }
            }

            // Get attribute name
            $checkAttr = $selectedAttrId ? ProductsAttribues::find($selectedAttrId) : null;
            $selectedAttrName = '';
            if ($checkAttr) {
                $selectedAttrName = is_array($checkAttr->attributeName)
                    ? implode(', ', $checkAttr->attributeName)
                    : $checkAttr->attributeName;
            }

            // Create order history
            OrderHistory::create([
                'order_id'        => $orderId,
                'product_id'      => $item['id'],
                'attribue_id'     => $selectedAttrId,
                'variation_value' => $selectedAttrName,
                'qty'             => $item['qty'],
                'price'           => $item['price'],
                'total_price'     => $item['price'] * $item['qty'],
            ]);
        }


        $customerPhone = $requestdata['shipping_phone'];
        if ($couponoffer == 'couponoffer') {
            /*
            $msg = "Thanks for your order! ID: $longOrderId, Coupon: $coupon_code. We'll contact you soon.";

            $smsApiUrl = 'http://139.99.39.237/api/smsapi';
            $params = [
                'api_key' => '0YvO1UoW99Z4TprlGUr4',
                'type' => 'text',
                'number' => $customerPhone . ',01915728982',
                'senderid' => '8809604902507',
                'message' => $msg,
            ];
            */
        } else {
            $this->sms_send($longOrderId, $customerPhone);

            // $msg = "Thanks for your order! ID: $longOrderId. We'll contact you soon.";
            // $smsApiUrl = 'http://139.99.39.237/api/smsapi';
            // $params = [
            //     'api_key' => '0YvO1UoW99Z4TprlGUr4',
            //     'type' => 'text',
            //     'number' => $customerPhone . ',01915728982',
            //     'senderid' => '8809604902507',
            //     'message' => $msg,
            // ];
        }

        //Http::get($smsApiUrl, $params);

        return response()->json([

            'success'           => true,
            'checkEmail'        => $checkEmail,
            'password'          => $password,
            'order_id'          => $longOrderId,
            'message'           => 'Order placed successfully.',
            'subtotal'          => $subtotal,
            'discount'          => $discount,
            'discount_amount'   => $discountAmount,
            'grand_total'       => $grandTotal,
        ]);
    }


    public function sms_send($longOrderId, $customerPhone)
    {

        $message = "Thanks for your order! ID: {$longOrderId}. We'll contact you soon.";

        try {
            $response = Http::asForm()->post('http://bulksmsbd.net/api/smsapi', [
                'api_key'  => env('BULKSMS_API_KEY'),
                'senderid' => env('BULKSMS_SENDER_ID'),
                'number'   => preg_replace('/\D/', '', "88$customerPhone"),
                'message'  => $message, // ✅ REQUIRED
            ]);
            Log::info('SMS send response', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            return $response->body();
        } catch (\Exception $e) {
            Log::error('SMS Error', ['error' => $e->getMessage()]);
            return false;
        }

    }

    public function generateUniqueRandomNumber()
    {
        $numbers = [];

        while (count($numbers) < 4) {
            $randomNumber = rand(1000, 9999);
            if (! in_array($randomNumber, $numbers)) {
                $numbers[] = $randomNumber;
            }
        }

        return $numbers[0]; // Since we're generating only one number, return the first (and only) element of the array
    }
}
