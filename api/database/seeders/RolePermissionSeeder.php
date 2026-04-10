<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{

    public function run()
    {
        //This dynamic script.
        // Step 1: Reset cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
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

        // Step 4: Create Module-based Roles dynamically
        foreach ($modules as $module => $perms) {
            $roleName = $module . '_manager';
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'api']);
            $role->syncPermissions($perms);
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
