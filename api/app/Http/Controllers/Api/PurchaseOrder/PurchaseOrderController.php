<?php

namespace App\Http\Controllers\Api\PurchaseOrder;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\PurchaseOrderInvoice;
use App\Models\PurchaseOrderParticular;
use App\Models\Supplier;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpParser\Node\Stmt\Catch_;
use PhpParser\Node\Stmt\TryCatch;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Validator;

class PurchaseOrderController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('view purchase order')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view purchase order',
            ], 403);
        }
        $page           = $request->input('page', 1);
        $pageSize       = $request->input('pageSize', 10);
        $searchQuery    = $request->searchQuery;
        $selectedSupplier = (int) $request->selectedSupplier;

        $query = PurchaseOrderParticular::leftJoin('supplier', 'supplier.id', '=', 'purchase_order_particular.supplier_id')
            ->select('purchase_order_particular.*', 'supplier.name as supplierName')
            ->orderBy('purchase_order_particular.id', 'desc');

        if ($searchQuery !== null) {
            $query->where('purchase_order_particular.invNumber', 'like', '%' . $searchQuery . '%');
        }
        if (!empty($selectedSupplier)) {
            $query->where('purchase_order_particular.supplier_id', $selectedSupplier);
        }

        // $query->where('users.role_id', 1);
        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);
        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
            return [
                'id'              => $item->id,
                'invNumber'       => $item->invNumber,
                'orderDate'       => date("d-M-Y", strtotime($item->orderDate)),
                'grandTotal'      => 'TK. ' . $item->grandTotal,
                'supplier_name'   => $item->supplierName,
                'transfer_status' => $item->transfer_status,
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

    public function sendToTransferProduct($id)
    {

        $purchase_order_id = $id;
        $chkData           = PurchaseOrderInvoice::where('purchase_order_id', $purchase_order_id)->get();
        // Delete existing products for this purchase order
        Product::where('purchase_order_id', $purchase_order_id)->delete();

        $phsitory = [];
        foreach ($chkData as $r) {
            $chkSupplier  = PurchaseOrderParticular::where('id', $r->purchase_order_id)->first();
            $supName      = Supplier::where('id', $chkSupplier->supplier_id)->first();
            $phsitory[] = [
                'name'               => $r->description ?? "",
                'slug'               => Str::slug($r->description ?? ""), // generate slug
                'stock_qty'          => $r->qty ?? "",
                'price'              => $r->price ?? "",
                'purchase_order_id'  => $r->purchase_order_id ?? "",
                'supplier_id'        => $chkSupplier->supplier_id ?? "",
                'supplier_name'      => $supName->name ?? "", // only for response
                'status'             => 0, // Inactive 

            ];
        }
        $insertData = array_map(function ($item) {
            unset($item['supplier_name']); // remove supplier_name before insert
            return $item;
        }, $phsitory);
        // Insert all records at once
        if (!empty($insertData)) {
            Product::insert($insertData);
        }
        // Update transfer_status for all purchase order particulars
        PurchaseOrderParticular::where('id', $purchase_order_id)
            ->update(['transfer_status' => 1]);

        return response()->json([
            'status'            => true,
            'message'           => 'Successfully transfer',
            'purchase_order_id' => $purchase_order_id,
            'phsitory'          => $phsitory,
        ], 201);
    }

    public function store(Request $request)
    {
        //   dd($request->all());
        $user = Auth::user();
        if (! $user->can('create purchase order')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create purchase order',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'invNumber'             => 'required',
            'supplier'              => 'required',
            'orderDate'             => 'required',
            'grandTotal'            => 'required|numeric',
            'items'                 => 'required|array|min:1',
            'items.*.description'   => 'required',
            //'items.*.sku'           => 'required',
            'items.*.qty'           => 'required|integer|min:1',
            'items.*.price'         => 'required|numeric|min:0',
        ], [
            'invNumber.required'    => 'Invoice number is required.',
            'supplier.required'     => 'Please select a supplier.',
            'orderDate.required'    => 'Order date is required.',
            'grandTotal.required'   => 'Grand total must not be empty.',
            'grandTotal.numeric'    => 'Grand total must be a valid number.',
            'items.required'        => 'At least one item must be included.',
            'items.*.description.required' => 'Each item must have a description.',
            'items.*.qty.required'  => 'Each item must have quantity.',
            'items.*.qty.integer'   => 'Quantity must be an integer.',
            'items.*.price.required' => 'Each item must have a price.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Get validated data
        $validated = $validator->validated();

        $order = PurchaseOrderParticular::create([
            'invNumber'       => $validated['invNumber'],
            'supplier_id'     => $validated['supplier'],
            'orderDate'       => $validated['orderDate'],
            'billingAddress'  => $request->billingAddress ?? "",
            'shippingAddress' => $request->shippingAddress ?? "",
            'remarks'         => $request->remarks ?? "",
            'grandTotal'      => $validated['grandTotal'],
        ]);

        $orderId = $order->id;

        foreach ($request->input('items', []) as $item) {
            PurchaseOrderInvoice::create([
                'purchase_order_id' => $orderId,
                'description'       => $item['description'] ?? '',
                'sku'               => $item['sku'] ?? '',
                'attribute'         => $item['attribute'] ?? '',
                'qty'               => $item['qty'] ?? 0,
                'price'             => $item['price'] ?? 0,
            ]);
        }
        return response()->json([
            'status'   => true,
            'message'  => 'Purchase order created successfully!',
            'order_id' => $orderId,
        ], 201);
    }

    public function checkrow($id)
    {

        $particularData =  PurchaseOrderParticular::select('purchase_order_particular.*', 'supplier.name as supplier_name')
            ->leftJoin('supplier', 'supplier.id', '=', 'purchase_order_particular.supplier_id')
            ->where('purchase_order_particular.id', $id)
            ->first();

        $historyData    = PurchaseOrderInvoice::where('purchase_order_id', $id)->get();

        return response()->json([
            'status'   => true,
            'particularData' => $particularData,
            'historyData' => $historyData,
        ], 201);
    }

    public function destroy($id)
    {
        $user = Auth::user();

        if (! $user->can('delete purchase order')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to delete',
            ], 403);
        }

        $post = Supplier::find($id);
        if (! $post) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }
        //$post->delete();

        return response()->json([
            'message' => 'Deleted successfully',
            'id' => $id,
        ], 200);
    }

    public function update(Request $request)
    {
        //dd($request->all());
        $user = Auth::user();
        if (! $user->can('edit purchase order')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit supplier',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'invNumber'             => 'required',
            'supplier'              => 'required',
            'orderDate'             => 'required',
            'grandTotal'            => 'required|numeric',
            'items'                 => 'required|array|min:1',
            'items.*.description'   => 'required',
            //'items.*.sku'           => 'required',
            'items.*.qty'           => 'required|integer|min:1',
            'items.*.price'         => 'required|numeric|min:0',
        ], [
            'invNumber.required'    => 'Invoice number is required.',
            'supplier.required'     => 'Please select a supplier.',
            'orderDate.required'    => 'Order date is required.',
            'grandTotal.required'   => 'Grand total must not be empty.',
            'grandTotal.numeric'    => 'Grand total must be a valid number.',
            'items.required'        => 'At least one item must be included.',
            'items.*.description.required' => 'Each item must have a description.',
            'items.*.qty.required'  => 'Each item must have quantity.',
            'items.*.qty.integer'   => 'Quantity must be an integer.',
            'items.*.price.required' => 'Each item must have a price.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Get validated data
        $validated = $validator->validated();

        $data = [
            'invNumber'       => $validated['invNumber'],
            'supplier_id'     => $validated['supplier'],
            'orderDate'       => $validated['orderDate'],
            'billingAddress'  => $request->billingAddress ?? "",
            'shippingAddress' => $request->shippingAddress ?? "",
            'remarks'         => $request->remarks ?? "",
            'grandTotal'      => $validated['grandTotal'],
        ];

        // ✅ Update existing record
        PurchaseOrderParticular::where('id', $request->id)->update($data);

        $purchase_order_id = $request->id;
        $chkHistoryData = PurchaseOrderInvoice::where('purchase_order_id', $purchase_order_id)->get();

        if ($chkHistoryData->count() > 0) {
            PurchaseOrderInvoice::where('purchase_order_id', $purchase_order_id)->delete();
        }


        foreach ($request->input('items', []) as $item) {
            PurchaseOrderInvoice::create([
                'purchase_order_id' => $purchase_order_id,
                'description'       => $item['description'] ?? '',
                'sku'               => $item['sku'] ?? '',
                'attribute'         => $item['attribute'] ?? '',
                'qty'               => $item['qty'] ?? 0,
                'price'             => $item['price'] ?? 0,
            ]);
        }
        return response()->json([
            'status'   => true,
            'message'  => 'Purchase order created successfully!',
            'order_id' => $purchase_order_id,
        ], 201);



        // $validator = Validator::make($request->all(), [
        //     'name'   => 'required',
        //     'status' => 'required',

        // ]);
        // if ($validator->fails()) {
        //     return response()->json(['errors' => $validator->errors()], 422);
        // }

        // $data = [
        //     'name'   => $request->name,
        //     'slug'   => Str::slug($request->name),
        //     'status' => $request->status,
        // ];

        // $data['id'] = $request->id;

        // $post = Supplier::find($request->id);
        // $post->update($data);
        // $resdata['id'] = $post->id;

        return response()->json($resdata);
    }
}
