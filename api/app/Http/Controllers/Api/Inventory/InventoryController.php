<?php

namespace App\Http\Controllers\Api\Inventory;

use App\Http\Controllers\Controller;
use App\Models\OrderHistory;
use App\Models\Orders;
use App\Models\OrderStatus;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductInventory;
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

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('view order')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view order',
            ], 403);
        }



        $deliveredQtys = OrderHistory::join('orders', 'orders.id', '=', 'order_history.order_id')
            ->where('orders.order_status', 5)
            ->groupBy('order_history.product_id')
            ->select('order_history.product_id', DB::raw('SUM(order_history.qty) as total_qty_out'))
            ->pluck('total_qty_out', 'product_id');



        $inventories = ProductInventory::leftJoin('product', 'product_inventory.product_id', '=', 'product.id')
            ->select(
                'product_inventory.product_id',
                'product.name as product_name',
                DB::raw('SUM(product_inventory.qty_in) as total_qty_in')
            )
            ->groupBy('product_inventory.product_id', 'product.name')
            ->get();



        $finalData              = $inventories->map(function ($inv) use ($deliveredQtys) {
            $totalQtyOut        = $deliveredQtys[$inv->product_id] ?? 0;
            $currentBalance     = $inv->total_qty_in - $totalQtyOut;

            return [
                'product_id'        => $inv->product_id,
                'product_name'      => $inv->product_name ?? 'Unknown',
                'total_qty_in'      => $inv->total_qty_in,
                'total_qty_out'     => $totalQtyOut,
                'current_balance'   => $currentBalance,
            ];
        });

        return response()->json([
            'data'           => $finalData,
        ], 200);
    }


    public function searchproductId(Request $request)
    {
        try {

            $product_id = $request->get('query');

            if (!$product_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product ID is required',
                    'data' => []
                ], 400);
            }

            $products = ProductInventory::where('product_id', $product_id)
                ->leftJoin('users', 'users.id', '=', 'product_inventory.user_id')
                ->select('product_inventory.*', \DB::raw('UPPER(users.name) as entry_by'))
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Data fetched successfully',
                'data' => $products
            ], 200);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    public function addStock(Request $request)
    {

        $user = Auth::user();
        if (! $user->can('view order')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view order',
            ], 403);
        }


        try {
            // 1. Validate input
            $validated = $request->validate([
                'product_id' => 'required', // product must exist
                'quantity'   => 'required|integer|min:1',
                'stock_date' => 'required|date',
            ]);

            // 2. Insert stock into inventory
            $stock = new ProductInventory();
            $stock->product_id = $validated['product_id'];
            $stock->qty_in = $validated['quantity'];
            $stock->stock_date = $validated['stock_date'];
            $stock->user_id = $user->id; // assuming user is authenticated
            $stock->save();

            // 3. Return success response
            return response()->json([
                'success' => true,
                'message' => 'Stock added successfully',
                'data' => $stock
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Validation errors
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // General errors
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
