<?php

namespace App\Http\Controllers\Api\Permissions;

use App\Http\Controllers\Controller;
use App\Models\Roles;
use App\Models\RolesType;
use App\Models\Permission as ModelsPermission;
use App\Models\RoleHasPermissions;
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
use App\Helpers\PermissionHelper;

class PermissionsController extends Controller
{

    public function store(Request $request)
    {
        //dd($request->all());
        $user = Auth::user();
        if (! $user->can('create permission')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create permission',
            ], 403);
        }
        $request->validate([
            'role_type'    => 'required|integer',
            'permissions' => 'required|array',
        ]);

        // Whenever you update permissions or want fresh cache
        PermissionHelper::clearCache();

        $role_type = $request->role_type ?? '';
        $rid = Roles::where('id', $role_type)->first();

        if (!$rid) {
            return response()->json([
                'message' => 'Invalid Role Selected',
            ], 400);
        }

        $role_id = $rid->id;

        // Filter out empty permissions (avoid errors)
        $permissions = array_filter($request->permissions, function ($perm) {
            return !empty($perm) && isset($perm['id']);
        });

        // Prepare insert data
        $insertData = array_map(function ($perm) use ($role_id) {
            return [
                'role_id'        => $role_id,
                'permission_id'  => $perm['id'],
            ];
        }, $permissions);

        // Clear previous permissions
        RoleHasPermissions::where('role_id', $role_id)->delete();
        // Clear existing permissions for the role

        // Insert in chunks
        foreach (array_chunk($insertData, 100) as $batch) {
            DB::table('role_has_permissions')->insert($batch);
        }

        return response()->json([
            'message' => 'Permissions assigned successfully',
        ], 200);
    }

    public function checkpermissions($id)
    {
        $chkRole = Roles::find($id);
        if (!$chkRole) {
            return response()->json([
                'message' => 'Role not found.',
            ], 404);
        }

        $role_id = $chkRole->id;

        $data = RoleHasPermissions::where('role_id', $role_id)->get();
        $response = [
            'data' => $data,
            'message' => 'success',
        ];
        return response()->json($response, 200);
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
