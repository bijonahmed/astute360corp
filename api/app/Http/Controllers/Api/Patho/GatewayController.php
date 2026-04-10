<?php

namespace App\Http\Controllers\Api\Patho;

use App\Http\Controllers\Controller;
use App\Models\Orders;
use App\Models\OrderStatus;
use App\Models\PathaoToken;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductsAttribues;
use App\Models\ProductsGallery;
use Illuminate\Support\Facades\Log;
use App\Models\PurchaseOrderInvoice;
use App\Models\PurchaseOrderParticular;
use App\Models\Supplier;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpParser\Node\Stmt\Catch_;
use PhpParser\Node\Stmt\TryCatch;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Validator;
use App\Services\PathaoService;
use Illuminate\Support\Facades\Http;
use Codeboxr\PathaoCourier\Facade\PathaoCourier;

class GatewayController extends Controller
{





    public function checkInitialized(PathaoService $pathao)
    {
        $data['store'] = PathaoCourier::store()->list();
        $data['city'] = PathaoCourier::area()->city();

        return response()->json([
            'success'      => true,
            'responseData' => $data,
        ], 200);
    }



    public function checkZone(Request $request, PathaoService $pathao)
    {

        $cityId = $request->cityId ?? "";

        $response = PathaoCourier::area()->zone($cityId);

        // Make sure you use the correct property from the response
        $data['zone'] = $response->response ?? $response; // fallback if response missing
        return response()->json([
            'success'      => true,
            'responseData' => $data,
        ], 200);
    }


    public function checkZoneWiseArea(Request $request, PathaoService $pathao)
    {

        $zone_id = $request->zone_id ?? "";
        $response = PathaoCourier::area()->area($zone_id);
        // Make sure you use the correct property from the response
        $data['area'] = $response->response ?? $response; // fallback if response missing

        return response()->json([
            'success'      => true,
            'responseData' => $data,
        ], 200);
    }

    public function checkPathaoResponseOrder(Request $request, PathaoService $pathao)
    {

        //dd($request->all());
        $orderId         = $request->id ?? "";
        $chkOrder        = Orders::find($orderId);
        $consignmentId = $chkOrder && !empty($chkOrder->pathao_consignment_id)
            ? $chkOrder->pathao_consignment_id
            : 0;
        //$consignmentId   = $chkOrder ? $chkOrder->pathao_consignment_id : "";

        $orderResonse    = PathaoCourier::order()->orderDetails($consignmentId);

        $pathao_order_status    = $orderResonse->order_status ?? "";

        Orders::where('id', $request->id)->update([
            'pathao_order_status'      => $pathao_order_status ?? "",
        ]);


        $pathaoData = [
            'consignment_id'    => $chkOrder->pathao_consignment_id,
            'merchant_order_id' => $chkOrder->pathao_merchant_order_id,
            'order_status'      => $chkOrder->pathao_order_status,
            'delivery_fee'      => $chkOrder->pathao_delivery_fee,
        ];




        return response()->json([
            'success'      => true,
            'orderResonse' => $pathaoData,
        ], 200);
    }



    public function sendMerchant(Request $request, PathaoService $pathao)
    {

       // dd($request->all());

        $request->validate([
            'id'       => 'required|integer',
            'status'   => 'required|integer',
            'store_id' => 'required|integer',
            'city_id'  => 'required|integer',
            'zone_id'  => 'required|integer',
            'area_id'  => 'required|integer',
            'delivery_charge'  => 'required|integer',
        ], [
            'id.required'       => 'Order ID is required.',
            'id.integer'        => 'Order ID must be an integer.',

            'status.required'   => 'Status is required.',
            'status.integer'    => 'Status must be an integer.',

            'store_id.required' => 'Store is required.',
            'store_id.integer'  => 'Store must be an integer.',

            'city_id.required'  => 'City is required.',
            'city_id.integer'   => 'City must be an integer.',

            'zone_id.required'  => 'Zone is required.',
            'zone_id.integer'   => 'Zone must be an integer.',

            'area_id.required'  => 'Area is required.',
            'area_id.integer'   => 'Area must be an integer.',
            'delivery_charge.integer'   => 'Delivery charge must be an integer.',

        ]);

        $checkOrder           =  Orders::find($request->id);
        $orderId              = $checkOrder ? $checkOrder->orderId : "";
        $recipient_address    = $checkOrder ? $checkOrder->address : "";
        $shipping_phone       = $checkOrder ? $checkOrder->shipping_phone : "";

        //Customer 

        $chkCustomer          = User::find($checkOrder->customer_id);
        $customerName         = $chkCustomer ? $chkCustomer->name : "";

        //dd("Order ID: $orderId-- Reciept Name: $customerName--Phone: $shipping_phone--Address: $recipient_address");

        $user = Auth::user();
        // Prepare update data
        $data = [
            'order_status'     => 10, //$validated['status'],
            'orderUpdateDate'  => date("Y-m-d"),
            'orderUpdateby'    => $user->id,
        ];

        Orders::where('id', $request->id)->update($data);

        $pathaoOrder =  PathaoCourier::order()
            ->create([
                "store_id"            => $request->store_id, //349959, // Find in store list,
                "merchant_order_id"   => $orderId, //"ORD-" . time(), // Unique order id
                "recipient_name"      => $customerName, //"Gazi Giash Uddin", // Customer name
                "recipient_phone"     => $shipping_phone, //"01988846927", // Customer phone
                "recipient_address"   => $recipient_address, //"House 123, Mirpur-1, Dhaka", // Customer address
                "recipient_city"      => $request->city_id, //52, // Find in city method
                "recipient_zone"      => $request->zone_id, //"156", // Find in zone method
                "recipient_area"      => $request->area_id, //"13193", // Find in Area method
                "delivery_type"       => "48", // 48 for normal delivery or 12 for on demand delivery
                "item_type"           => 2, // 1 for document,
                "special_instruction" => "",
                "item_quantity"       => "1", // item quantity
                "item_weight"         => "1", // parcel weight
                "amount_to_collect"   => $request->delivery_charge,//"60", // amount to collect
                "item_description"    => "No details" // product details
            ]);

        // 3. Extract Pathao data and update your order
        Orders::where('id', $request->id)->update([
            'pathao_consignment_id'      => $pathaoOrder->consignment_id ?? null,
            'pathao_merchant_order_id'   => $pathaoOrder->merchant_order_id ?? null,
            'pathao_order_status'        => $pathaoOrder->order_status ?? null,
            'pathao_delivery_fee'        => $pathaoOrder->delivery_fee ?? null,
        ]);



        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'orderResonse' => $pathaoOrder,
        ], 200);
    }
}
