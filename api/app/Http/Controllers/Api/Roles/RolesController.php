<?php

namespace App\Http\Controllers\Api\Roles;

use App\Http\Controllers\Controller;
use App\Models\Roles;
use App\Models\RolesType;
use App\Models\Permission as ModelsPermission;
use App\Models\User;
use DB;
use File;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Contracts\Permission;
use Validator;

class RolesController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if (! $user->can('view role')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view role',
            ], 403);
        }
        $page         = $request->input('page', 1);
        $pageSize     = $request->input('pageSize', 10);
        $searchQuery  = $request->searchQuery;

        $query = Roles::select('roles.*', 'roles_type.name as type_name')
            ->leftJoin('roles_type', 'roles.role_type', '=', 'roles_type.id')
            ->orderBy('roles.id', 'desc');

        if ($searchQuery !== null) {
            $query->where('roles.name', 'like', '%' . $searchQuery . '%');
        }

        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);
        $modifiedCollection = $paginator->getCollection()->map(function ($item) {

            return [
                'id'            => $item->id,
                'name'          => Str::title(Str::replace('_', ' ', $item->name)),
                'type_name'     => $item->type_name,
            ];
        });
        // Return the modified collection along with pagination metadata
        return response()->json([
            'data' => $modifiedCollection,
            'current_page' => $paginator->currentPage(),
            'total_pages' => $paginator->lastPage(),
            'total_records' => $paginator->total(),
        ], 200);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('create role')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create role',
            ], 403);
        }
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name'          => 'required',
            'role_type'     => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [
            'name'          => $request->name,
            'guard_name'    => 'api',
            'role_type'     => $request->role_type,
        ];

        Roles::insertGetId($data);

        $response = [
            'message' => 'Successfully insert:',
        ];
        return response()->json($response);
    }


    public function update(Request $request)
    {

        $id = $request->id;

        $user = Auth::user();
        if (! $user->can('edit role')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit role',
            ], 403);
        }
        // Validate Request
        $validator = Validator::make($request->all(), [
            'name'      => 'required|unique:roles,name,' . $id,
            'role_type' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update Role by Role ID, not User ID!
        Roles::where('id', $id)->update([
            'name'      => $request->name,
            'role_type' => $request->role_type,
        ]);

        return response()->json([
            'message' => 'Role updated successfully.'
        ], 200);
    }



    public function checkrow($id)
    {
        $data = Roles::find($id);
        $response = [
            'data' => $data,
            'message' => 'success',
        ];
        return response()->json($response, 200);
    }


    public function destroy($id)
    {
        $user = Auth::user();

        if (! $user->can('delete role')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to delete role',
            ], 403);
        }

        $data = Roles::find($id);
        if (! $data) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }
        // $data->delete();
        return response()->json([
            'message' => 'Data deleted successfully',
            'id' => $id,
        ], 200);
    }

    public function getRolesType()
    {
        try {
            $data = RolesType::all(); // Fetch all roles

            return response()->json([
                'data' => $data,
                'message' => 'success',
            ], 200);
        } catch (\Exception $e) {
            // Catch any error and send error response
            return response()->json([
                'message' => 'Something went wrong while fetching roles.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function checkRoleType(Request $request)
    {

        try {
            $roleType = $request->input('role_type');
            // Get all unique parent IDs
            $parentIds = ModelsPermission::pluck('parent_id')->unique()->filter(fn($id) => $id != 0);
            $result = [];

            foreach ($parentIds as $parentId) {
                // Get parent name
                $parent = ModelsPermission::find($parentId);
                $groupName = $parent ? $parent->name : 'Unknown Group';
                // Get permissions under this parent where role_type includes $roleType
                $permissions = ModelsPermission::where('parent_id', $parentId)
                    ->whereRaw("FIND_IN_SET(?, role_type)", [$roleType])
                    ->get(['id', 'name']); // ✅ important

                if ($permissions->count() > 0) {
                    $result[] = [
                        'group_name'  => $groupName,
                        'permissions' => $permissions
                    ];
                }
            }
            return response()->json([
                'message' => 'success',
                'data'    => $result
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Something went wrong while fetching permissions.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
