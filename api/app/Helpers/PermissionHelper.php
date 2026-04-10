<?php

namespace App\Helpers;

use Spatie\Permission\PermissionRegistrar;

class PermissionHelper
{
    /**
     * Clear Spatie Permission cache dynamically
     */
    public static function clearCache()
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
