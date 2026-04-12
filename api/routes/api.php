<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Banner\BannerController;
use App\Http\Controllers\Api\Categories\CategoryController;
use App\Http\Controllers\Api\ConfirmOrders\ConfirmOrdersController;
use App\Http\Controllers\Api\Customer\CustomerController;
use App\Http\Controllers\Api\Dashboard\DashboardController;
use App\Http\Controllers\Api\Inventory\InventoryController;
use App\Http\Controllers\Api\Orders\OrdersController;
use App\Http\Controllers\Api\Patho\GatewayController;
use App\Http\Controllers\Api\Post\PostCategoryController;
use App\Http\Controllers\Api\Post\PostController;
use App\Http\Controllers\Api\User\UserController;
use App\Http\Controllers\Api\Roles\RolesController;
use App\Http\Controllers\Api\Permissions\PermissionsController;
use App\Http\Controllers\Api\ProductCategories\ProductCategoryController;
use App\Http\Controllers\Api\Products\ProductsController;
use App\Http\Controllers\Api\Public\PublicController;
use App\Http\Controllers\Api\PurchaseOrder\PurchaseOrderController;
use App\Http\Controllers\Api\Settings\SettingsController;
use App\Http\Controllers\Api\Supplier\SupplierController;
use Illuminate\Support\Facades\Route;

Route::middleware('api')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('api.register');
    Route::post('/login', [AuthController::class, 'login'])->name('api.login');
});
Route::prefix('public')->group(function () {
    Route::get('/getCategory', [PublicController::class, 'index']);
    Route::get('/inSubcategoryFilter', [PublicController::class, 'inSubcategoryFilter']);

    Route::get('/categoryFilter', [PublicController::class, 'categoryFilter']);
    Route::get('/getCategoryParent', [PublicController::class, 'getCategoryParent']);
    Route::get('/productsCategory', [PublicController::class, 'productsCategory']);
    Route::get('/productsCategoryAllData', [PublicController::class, 'productsCategoryAllData']);
    Route::get('/getProducts', [PublicController::class, 'getProducts']);
    Route::get('/getInSubProducts', [PublicController::class, 'getInSubProducts']);
    Route::get('/search-products', [PublicController::class, 'searchProducts']);
   
    Route::get('/getsAllproducts', [PublicController::class, 'getsAllproducts']);
    Route::get('/getsAllproductsByCategories', [PublicController::class, 'getsAllproductsByCategories']);
    Route::get('/getsAllproductsBySubCategories', [PublicController::class, 'getsAllproductsBySubCategories']);
    Route::get('/getChildDataOnly', [PublicController::class, 'getChildDataOnly']);
    Route::get('/getChildChildDataOnly', [PublicController::class, 'getChildChildDataOnly']);
    Route::get('/getsAllproductsByInSubCategories', [PublicController::class, 'getsAllproductsByInSubCategories']);
    Route::get('/checkProductDetails/{slug}', [PublicController::class, 'checkProductDetails']);
    Route::get('/getsPost', [PublicController::class, 'getsPost']);
    Route::get('/checkedPostRow/{slug}', [PublicController::class, 'checkedPostRow']);
    Route::get('/checkedProductRow/{slug}', [PublicController::class, 'checkedProductRow']);
    Route::get('/getsBlogPost', [PublicController::class, 'getsBlogPost']);


    Route::get('/getsAllServices', [PublicController::class, 'getsAllServices']);
    Route::get('/getsAllTraining', [PublicController::class, 'getsAllTraining']);
    Route::post('/contact', [PublicController::class, 'contact']);


    Route::get('/popularPosts', [PublicController::class, 'popularPosts']);
    Route::get('/track-order/{order_number}', [PublicController::class, 'track']);
    Route::get('/getSetting', [PublicController::class, 'getSetting']);
    Route::get('/callback-hook', [PublicController::class, 'testApiCallbackHook']);
});
Route::prefix('confirOrders')->group(function () {
    Route::post('/confirm-order', [ConfirmOrdersController::class, 'confirmOrder']);
    Route::get('/getOrderCustomer', [ConfirmOrdersController::class, 'getOrderCustomer']);
});
Route::middleware(['auth:api'])->group(function () {
    // User
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/updateProfile', [AuthController::class, 'updateProfile']);
    Route::put('/updateCustomerProfile', [AuthController::class, 'updateCustomerProfile']);
    Route::post('/changePassword', [AuthController::class, 'changePassword']);
    Route::post('/customerChangePassword', [AuthController::class, 'customerChangePassword']);
    Route::prefix('setting')->group(function () {
        Route::get('/settingrow', [SettingsController::class, 'settingrow']);
        Route::post('/upateSetting', [SettingsController::class, 'upateSetting']);
    });
    Route::prefix('dashbaord')->group(function () {
        Route::get('/getDashboardData', [DashboardController::class, 'getDashboardData']);
    });
    Route::prefix('customer')->group(function () {
        Route::get('/index', [CustomerController::class, 'index']);
        Route::get('/getOrderCustomer', [CustomerController::class, 'getOrderCustomer']);
        Route::get('/getOnlyOrderData', [CustomerController::class, 'getOnlyOrderData']);
        Route::get('/getCustomerLists', [CustomerController::class, 'getCustomerLists']);
    });
    Route::prefix('banner')->group(function () {
        Route::get('/index', [BannerController::class, 'index']);
        Route::post('/SliderStore', [BannerController::class, 'SliderStore']);
        Route::post('/bannerStore', [BannerController::class, 'bannerStore']);
        Route::post('/deleteHomeSlider', [BannerController::class, 'destroyHomeSlider']);
    });
    Route::prefix('product-category')->group(function () {
        Route::get('/index', [ProductCategoryController::class, 'index']);
        Route::get('/getinSubCategory', [ProductCategoryController::class, 'getinSubCategory']);
        Route::get('/restoreCategorys', [ProductCategoryController::class, 'restoreCategorys']);
        Route::post('/create', [ProductCategoryController::class, 'store']);
        Route::post('/add-insubcategory', [ProductCategoryController::class, 'addinsubcategory']);
        Route::post('/create-subcategory', [ProductCategoryController::class, 'createSubcategory']);
        Route::post('/update/{id}', [ProductCategoryController::class, 'update']);
        Route::post('/update-status/{id}', [ProductCategoryController::class, 'updatestatus']);
        Route::post('/subcategoryUpdate/{id}', [ProductCategoryController::class, 'subcategoryUpdate']);
        Route::post('/checkSubcategory', [ProductCategoryController::class, 'checkSubcategory']);
        Route::post('/insubcategory', [ProductCategoryController::class, 'insubcategory']);
        Route::post('/uploadCategoryImage', [ProductCategoryController::class, 'uploadCategoryImage']);
        Route::post('/uploadBannerImage', [ProductCategoryController::class, 'uploadBannerImage']);
        Route::post('/uploadBannerImageCategoryInside', [ProductCategoryController::class, 'uploadBannerImageCategoryInside']);
        Route::post('/uploadBannerImageSubCategory', [ProductCategoryController::class, 'uploadBannerImageSubCategory']);
    });
    Route::prefix('supplier')->group(function () {
        Route::get('/index', [SupplierController::class, 'index']);
        Route::post('/create', [SupplierController::class, 'store']);
        Route::DELETE('/delete/{id}', [SupplierController::class, 'destroy']);
        Route::get('/chkrow/{id}', [SupplierController::class, 'checkrow']);
        Route::post('/updateData', [SupplierController::class, 'update']);
    });
    Route::prefix('purchase')->group(function () {
        Route::get('/index', [PurchaseOrderController::class, 'index']);
        Route::get('/sendToTransferProduct/{id}', [PurchaseOrderController::class, 'sendToTransferProduct']);
        Route::post('/create', [PurchaseOrderController::class, 'store']);
        Route::DELETE('/delete/{id}', [PurchaseOrderController::class, 'destroy']);
        Route::get('/chkrow/{id}', [PurchaseOrderController::class, 'checkrow']);
        Route::post('/update', [PurchaseOrderController::class, 'update']);
    });
    Route::prefix('product')->group(function () {
        Route::get('/index', [ProductsController::class, 'index']);
        Route::post('/create', [ProductsController::class, 'store']);
        // Route::get('/sendToTransferProduct/{id}', [PurchaseOrderController::class, 'sendToTransferProduct']);
        // Route::post('/create', [PurchaseOrderController::class, 'store']);
        Route::DELETE('/delete/{id}', [ProductsController::class, 'destroy']);
        Route::get('/productrow/{id}', [ProductsController::class, 'productrow']);
        Route::get('/search', [ProductsController::class, 'search']);
        Route::post('/update', [ProductsController::class, 'update']);
        Route::post('/gallery-delete', [ProductsController::class, 'deleteGalleryImage']);
    });
    Route::prefix('orders')->group(function () {
        Route::get('/index', [OrdersController::class, 'index']);
        Route::get('/getOrderStatusList', [OrdersController::class, 'getOrderStatusList']);
        Route::post('/orderUpdate', [OrdersController::class, 'orderUpdate']);
    });
    Route::prefix('deliveryAssign')->group(function () {
        Route::post('/checkInitialized', [GatewayController::class, 'checkInitialized']);
        Route::post('/checkZone', [GatewayController::class, 'checkZone']);
        Route::post('/checkZoneWiseArea', [GatewayController::class, 'checkZoneWiseArea']);
        Route::post('/sendMerchant', [GatewayController::class, 'sendMerchant']);
        Route::get('/checkPathaoResponseOrder', [GatewayController::class, 'checkPathaoResponseOrder']);
    });
    Route::prefix('inventory')->group(function () {
        Route::get('/index', [InventoryController::class, 'index']);
        Route::get('/searchproductId', [InventoryController::class, 'searchproductId']);
        Route::post('/add-stock', [InventoryController::class, 'addStock']);
    });
    Route::prefix('roles')->group(function () {
        Route::get('/index', [RolesController::class, 'index']);
        Route::post('/create', [RolesController::class, 'store']);
        Route::post('/update', [RolesController::class, 'update']);
        Route::DELETE('/delete/{id}', [RolesController::class, 'destroy']);
        Route::get('/checkrow/{id}', [RolesController::class, 'checkrow']);
        Route::get('/getRolesType', [RolesController::class, 'getRolesType']);
        Route::POST('/checkRoleType', [RolesController::class, 'checkRoleType']);
    });
    Route::prefix('permission')->group(function () {
        Route::get('/index', [PermissionsController::class, 'index']);
        Route::post('/create', [PermissionsController::class, 'store']);
        Route::get('/check-permissions/{id}', [PermissionsController::class, 'checkpermissions']);
    });
    Route::prefix('users')->group(function () {
        Route::get('/index', [UserController::class, 'index']);
        Route::post('/create', [UserController::class, 'store']);
        Route::post('/update', [UserController::class, 'update']);
        Route::DELETE('/delete/{id}', [UserController::class, 'destroy']);
        Route::get('/checkUserrow/{id}', [UserController::class, 'checkUserrow']);
    });
    Route::prefix('posts-category')->group(function () {
        Route::get('/index', [PostCategoryController::class, 'index']);
        Route::post('/create', [PostCategoryController::class, 'store']);
        Route::post('/update', [PostCategoryController::class, 'update']);
        Route::DELETE('/delete/{id}', [PostCategoryController::class, 'destroy']);
        Route::get('/postrow/{id}', [PostCategoryController::class, 'postrow']);
    });
    Route::prefix('posts')->group(function () {
        Route::get('/index', [PostController::class, 'index']);
        Route::post('/create', [PostController::class, 'store']);
        Route::post('/update', [PostController::class, 'update']);
        Route::DELETE('/delete/{id}', [PostController::class, 'destroy']);
        Route::get('/postrow/{id}', [PostController::class, 'postrow']);
        Route::get('/postCategorysearch', [PostController::class, 'postCategorysearch']);
    });
});
Route::fallback(function () {
    return redirect('/');
});
