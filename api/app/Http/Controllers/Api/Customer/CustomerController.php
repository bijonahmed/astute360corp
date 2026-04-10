<?php

namespace App\Http\Controllers\Api\Customer;

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

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $user        = Auth::user();
        $searchQuery = $request->searchQuery;

        // Build query
        $query = User::where('role_type', 4);

        // If search exists
        if (!empty($searchQuery)) {
            $query->where(function ($q) use ($searchQuery) {
                $q->where('name', 'like', "%{$searchQuery}%")
                    ->orWhere('email', 'like', "%{$searchQuery}%")
                    ->orWhere('phone_number', 'like', "%{$searchQuery}%");
            });
        }

        $custmerInfo = $query->orderBy('id', 'desc')->get();

        // Prepare JSON response
        $orderJson = [];
        foreach ($custmerInfo as $c) {
            $orderJson[] = [
                'id'           => $c->id,
                'name'         => $c->name,
                'email'        => $c->email,
                'phone_number' => $c->phone_number,
                'created_at'   => date("d-M-Y", strtotime($c->created_at)),
            ];
        }

        return response()->json([
            'data' => $orderJson,
        ], 200);
    }

    public function getOrderCustomer(Request $request)
    {

        $checkOrder   = Orders::join('order_status', 'order_status.id', '=', 'orders.order_status')
            ->where('orders.id', $request->id)
            ->select('orders.*', 'order_status.name as status_name')->first();

        $updateBy = "";

        if ($checkOrder && $checkOrder->orderUpdateby) {
            $updateBy = optional(User::find($checkOrder->orderUpdateby))->name ?? "";
        }

        $orderDetails = OrderHistory::where('order_id', $checkOrder->id)
            ->join('product', 'order_history.product_id', '=', 'product.id')
            ->select('order_history.*', 'product.name as product_name') // select fields you need
            ->get();

        $data['orderRow']     = $checkOrder;
        $data['updateBy']     = strtoupper($updateBy);
        $data['orderHistory'] = $orderDetails;

        return response()->json([
            'data' => $data,
        ], 200);
    }


    public function getOnlyOrderData(Request $request)
    {


        $user        = Auth::user();
        $orderDetails   = Orders::join('order_status', 'order_status.id', '=', 'orders.order_status')->where('customer_id', $user->id)
                        
                        ->select('orders.*', 'order_status.name as status_name')->get();

        return response()->json([
            'orderHistory' => $orderDetails,
        ], 200);
    }




    public function getCustomerLists(Request $request)
    {

        $getCustomer             = User::where('role_type', 4)->get();

        return response()->json([
            'data' => $getCustomer,
        ], 200);
    }
}
