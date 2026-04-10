<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Orders;
use App\Models\PostCategory;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\PurchaseOrderInvoice;
use App\Models\Supplier;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpParser\Node\Stmt\Catch_;
use PhpParser\Node\Stmt\TryCatch;
use Illuminate\Support\Str;
use Validator;

class DashboardController extends Controller
{
    public function getDashboardData()
    {
        try {
            $data['product_catgory'] = ProductCategory::where('status', 1)->count();
            $data['baner']           = Banner::count();
            $data['customer']        = User::where('role_type', 4)->where('status', 1)->count();
            $data['supplier']        = Supplier::where('status', 1)->count();
            $data['pendingOrders']   = Orders::where('order_status', 1)->count();
            $data['purchase']        = PurchaseOrderInvoice::count();
            $data['products']        = Product::count();
            // ✅ return data as JSON or view
            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong while fetching dashboard data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
