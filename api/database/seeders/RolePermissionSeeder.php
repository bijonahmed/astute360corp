<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{

    public function run()
    {
        //This dynamic script.
        // Step 1: Reset cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Step 1b: Ensure post permissions exist (group: Post Management)
        $postParent = Permission::where('name', 'Post Management')->first();
        $postPermissions = [
            ['name' => 'add post', 'role_type' => '1,2'],
            ['name' => 'view post', 'role_type' => '1,2,3'],
            ['name' => 'create post', 'role_type' => '1,2'],
            ['name' => 'delete post', 'role_type' => '1,2,3'],
        ];

        // Step 1c: Ensure department permissions exist (group: HRM Management)
        Permission::firstOrCreate(['name' => 'HRM Management'], ['parent_id' => 0, 'role_type' => '1']);
        $hrmParent = Permission::where('name', 'HRM Management')->first();
        $departmentPermissions = [
            ['name' => 'view department', 'role_type' => '1,2,3'],
            ['name' => 'create department', 'role_type' => '1,2'],
            ['name' => 'edit department', 'role_type' => '1,2'],
            ['name' => 'delete department', 'role_type' => '1,2,3'],
            ['name' => 'view designation', 'role_type' => '1,2,3'],
            ['name' => 'create designation', 'role_type' => '1,2'],
            ['name' => 'edit designation', 'role_type' => '1,2'],
            ['name' => 'delete designation', 'role_type' => '1,2,3'],
            ['name' => 'view project', 'role_type' => '1,2,3'],
            ['name' => 'create project', 'role_type' => '1,2'],
            ['name' => 'edit project', 'role_type' => '1,2'],
            ['name' => 'delete project', 'role_type' => '1,2,3'],
            ['name' => 'view employee', 'role_type' => '1,2,3'],
            ['name' => 'create employee', 'role_type' => '1,2'],
            ['name' => 'edit employee', 'role_type' => '1,2'],
            ['name' => 'delete employee', 'role_type' => '1,2,3'],
            ['name' => 'view payslip', 'role_type' => '1,2,3'],
            ['name' => 'create payslip', 'role_type' => '1,2'],
            ['name' => 'edit payslip', 'role_type' => '1,2'],
            ['name' => 'delete payslip', 'role_type' => '1,2,3'],
        ];

        foreach (array_merge($postPermissions, $departmentPermissions) as $perm) {
            Permission::firstOrCreate(['name' => $perm['name']]);
            $parentId = str_contains($perm['name'], 'department') || str_contains($perm['name'], 'designation') || str_contains($perm['name'], 'project') || str_contains($perm['name'], 'employee')
                ? ($hrmParent ? $hrmParent->id : 0)
                : ($postParent ? $postParent->id : 0);
            DB::table('permissions')
                ->where('name', $perm['name'])
                ->update([
                    'parent_id' => $parentId,
                    'role_type' => $perm['role_type'],
                ]);
        }

        // Step 2: Collect ALL permissions (Existing in DB)
        $allPermissions = Permission::pluck('name')->toArray();
        // AUTO: Detect unique prefixes (posts, users, products)
        $modules = [];
        foreach ($allPermissions as $perm) {
            $prefix = explode(' ', $perm)[1] ?? null;
            if ($prefix) {
                $modules[$prefix][] = $perm;
            }
        }
        // Step 3: Create Super Admin Role (All Permissions)
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'api']);
        $admin->givePermissionTo($allPermissions);

        // Step 4: Sync Module-based Permissions to existing {module}_manager roles
        // (roles.role_type is required — new roles must be created via the Roles UI)
        foreach ($modules as $module => $perms) {
            $roleName = $module . '_manager';
            $role = Role::where('name', $roleName)->where('guard_name', 'api')->first();
            if ($role) {
                $role->syncPermissions($perms);
            }
        }

        echo "✅ Dynamic Roles Generated!";
    }
    /*
    public function run()
    {
    This manual script.
        // Clear cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions grouped by category
        $permissionsByCategory = [
            'posts_category' => ['view posts category', 'create posts category', 'edit posts category', 'delete posts category'],
            'posts' => ['view posts', 'create posts', 'edit posts', 'delete posts'],
            'users' => ['view users', 'create users', 'edit users', 'delete users'],
            'products' => ['view products', 'create products', 'edit products', 'delete products'],

        ];
        // Create all permissions
        foreach ($permissionsByCategory as $category => $perms) {
            foreach ($perms as $perm) {
                Permission::firstOrCreate(['name' => $perm]);
            }
        }
        // Define roles with permissions (can reference categories)
        $roles = [
            'admin' => array_merge(
                $permissionsByCategory['posts'],
                $permissionsByCategory['users'],
                $permissionsByCategory['products'],
                $permissionsByCategory['posts_category']
            ),
            'editor' => array_merge(
                $permissionsByCategory['posts'],
                $permissionsByCategory['products']
            ),
            'viewer' => array_merge(
                [$permissionsByCategory['posts'][0]], // view posts
                [$permissionsByCategory['products'][0]] // view products
            ),
        ];
        // Loop through roles and assign permissions dynamically
        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($rolePermissions);
        }
    }
   */
}
