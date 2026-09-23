<?php

namespace App\Http\Controllers\Api\hrm\project;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('view project')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view project',
            ], 403);
        }
        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);
        $searchQuery    = $request->searchQuery;
        $selectedFilter = (int) $request->selectedFilter;
        $query = Project::orderBy('id', 'desc');
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
        if (! $user->can('create project')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create project',
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
            'status' => $request->status,
        ];

        $resdata = Project::insertGetId($data);
        return response()->json($resdata);
    }

    public function checkrow($id)
    {
        $data = Project::where('id', $id)->first();
        $responseData['data'] = $data;
        return response()->json($responseData);
    }

    public function destroy($id)
    {
        $user = Auth::user();

        if (! $user->can('delete project')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to delete',
            ], 403);
        }

        $project = Project::find($id);
        if (! $project) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }
        $project->delete();

        return response()->json([
            'message' => 'Deleted successfully',
            'id' => $id,
        ], 200);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('edit project')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit project',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name'   => 'required',
            'status' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project = Project::find($request->id);
        if (! $project) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }

        $data = [
            'name'   => $request->name,
            'status' => $request->status,
        ];

        $project->update($data);
        $resdata['id'] = $project->id;

        return response()->json($resdata);
    }
}
