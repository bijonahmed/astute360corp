<?php

namespace App\Http\Controllers\Api\Orders;

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

class OrdersController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('view order')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view order',
            ], 403);
        }
        $page             = (int) $request->input('page', 1);
        $pageSize         = (int) $request->input('pageSize', 10);
        $orderId          = $request->input('searchQuery');
        $customerId       = (int) $request->input('customerId');
        $status           = (int) $request->input('status');
        if ($pageSize <= 0) {
            $pageSize = 10;
        }
        $query = Orders::leftJoin('users', 'users.id', '=', 'orders.customer_id')
            ->select('orders.*', 'users.name as customerName')
            ->orderBy('orders.id', 'desc');


        if (!empty($orderId)) {
            $query->where('orders.orderId', 'like', '%' . $orderId . '%');
        }
        if (!empty($customerId)) {
            $query->where('orders.customer_id', $customerId);
        }
        if (!empty($status)) {
            $query->where('orders.order_status', $status);
        }
        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);
        $modifiedCollection = $paginator->getCollection()->map(function ($item) {

            $statusName = OrderStatus::where('id', $item->order_status)->first();
            $updateBy   = User::find($item->orderUpdateby)->name ?? "-";

            $totalBill = $item->grand_total;

            return [
                'id'                => $item->id,
                'orderId'           => $item->orderId,
                'customerName'      => $item->customerName,
                'order_date'        => $item->order_date,
                'updateBy'          => strtoupper($updateBy),
                'grand_total'       => "Tk." . number_format($totalBill, 2),
                'paymentMethod'     => strtoupper($item->paymentMethod) ?? "N/A",
                'status'            => $statusName->name ?? "",
                'order_status'      => $item->order_status ?? "",
            ];
        });
        // Return the modified collection along with pagination metadata
        return response()->json([
            'data'           => $modifiedCollection,
            'current_page'   => $paginator->currentPage(),
            'total_pages'    => $paginator->lastPage(),
            'total_records'  => $paginator->total(),
        ], 200);
    }


    public function orderUpdate(Request $request, PathaoService $pathao)
    {
        // Validate request
        $validated = $request->validate([
            'id'     => 'required|integer|exists:orders,id',
            'status' => 'required|integer',
        ]);
        $user = Auth::user();
        // Prepare update data
        $data = [
            'order_status'     => $validated['status'],
            'orderUpdateDate'  => date("Y-m-d"),
            'orderUpdateby'    => $user->id,
        ];

        // Update order
        $response = Orders::where('id', $validated['id'])->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'updated' => $response,
        ], 200);
    }


    public function getOrderStatusList()
    {
        $oderStatus = OrderStatus::where('status', 1)->get();
        return response()->json([
            'status'        => true,
            'data'          => $oderStatus,
        ], 200); // 200 OK for data fetch
    }
}
