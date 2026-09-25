<?php

namespace App\Http\Controllers\Api\hrm\designation;

use App\Http\Controllers\Controller;
use App\Models\Designation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;

class DesignationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        // if (! $user->can('view designation')) {
        //     return response()->json([
        //         'message' => 'Unauthorized: You do not have permission to view designation',
        //     ], 403);
        // }
        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);
        $searchQuery    = $request->searchQuery;
        $selectedFilter = (int) $request->selectedFilter;
        $query = Designation::orderBy('id', 'desc');
        if ($searchQuery !== null) {
            $query->where('name', 'like', '%' . $searchQuery . '%');
        }
        if ($selectedFilter !== null) {
            $query->where('status', $selectedFilter);
        }
        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);
        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
            $status = $item->status == 1 ? 'Active' : 'Inactive';
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
        // if (! $user->can('create designation')) {
        //     return response()->json([
        //         'message' => 'Unauthorized: You do not have permission to create designation',
        //     ], 403);
        // }
        $validator = Validator::make($request->all(), [
            'name'   => 'required',
            'status' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [
            'name'   => $request->name,
            'status' => $request->status,
        ];

        $resdata = Designation::insertGetId($data);
        return response()->json($resdata);
    }

    public function checkrow($id)
    {
        $data = Designation::where('id', $id)->first();
        $responseData['data'] = $data;
        return response()->json($responseData);
    }

    public function destroy($id)
    {
        $user = Auth::user();

        // if (! $user->can('delete designation')) {
        //     return response()->json([
        //         'message' => 'Unauthorized: You do not have permission to delete',
        //     ], 403);
        // }

        $designation = Designation::find($id);
        if (! $designation) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }
        $designation->delete();

        return response()->json([
            'message' => 'Deleted successfully',
            'id' => $id,
        ], 200);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        // if (! $user->can('edit designation')) {
        //     return response()->json([
        //         'message' => 'Unauthorized: You do not have permission to edit designation',
        //     ], 403);
        // }

        $validator = Validator::make($request->all(), [
            'name'   => 'required',
            'status' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $designation = Designation::find($request->id);
        if (! $designation) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }

        $data = [
            'name'   => $request->name,
            'status' => $request->status,
        ];

        $designation->update($data);
        $resdata['id'] = $designation->id;

        return response()->json($resdata);
    }
}
