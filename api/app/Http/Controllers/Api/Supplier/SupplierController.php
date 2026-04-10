<?php

namespace App\Http\Controllers\Api\Supplier;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpParser\Node\Stmt\Catch_;
use PhpParser\Node\Stmt\TryCatch;
use Illuminate\Support\Str;
use Validator;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        //dd($user);
        if (! $user->can('view supplier')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view supplier',
            ], 403);
        }
        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);
        $searchQuery    = $request->searchQuery;
        $selectedFilter = (int) $request->selectedFilter;
        $query = Supplier::orderBy('id', 'desc');
        if ($searchQuery !== null) {
            $query->where('name', 'like', '%' . $searchQuery . '%');
        }
        if ($selectedFilter !== null) {
            $query->where('status', $selectedFilter);
        }
        // $query->where('users.role_id', 1);
        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);
        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
            $status = $item->status == 1 ? 'Active' : 'None';
            return [
                'id'            => $item->id,
                'name'          => $item->name,
                'status'        => $status,
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

    public function store(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('create supplier')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create supplier',
            ], 403);
        }
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [
            'name'          => $request->name,
            'status'        => 1, // !empty($request->status) ? $request->status : "",
        ];

        $resdata = Supplier::insertGetId($data);
        return response()->json($resdata);
    }



    public function checkrow($id)
    {
        $data = Supplier::where('id', $id)->first();
        $responseData['data'] = $data;
        return response()->json($responseData);
    }

    public function destroy($id)
    {
        $user = Auth::user();

        if (! $user->can('delete supplier')) {
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
        if (! $user->can('edit supplier')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit supplier',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name'   => 'required',
            'status' => 'required',

        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [
            'name'   => $request->name,
            'slug'   => Str::slug($request->name),
            'status' => $request->status,
        ];

        $data['id'] = $request->id;

        $post = Supplier::find($request->id);
        $post->update($data);
        $resdata['id'] = $post->id;

        return response()->json($resdata);
    }
}
