<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\OrderHistory;
use App\Models\Orders;
use App\Models\OrderStatus;
use App\Models\Post;
use App\Models\Product;
use App\Models\Roles;
use App\Models\ProductCategory;
use App\Models\ProductsAttribues;
use App\Models\ProductsGallery;
use App\Models\Setting;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Mail\ContactMail;
use Illuminate\Support\Facades\Mail;
use Attribute;
use DB;
use File;
use Helper;
use Illuminate\Http\Request;
use Validator;

class PublicController extends Controller
{
    public function index(Request $request)
    {
        try {
            $categories = ProductCategory::where('status', 1)->where('tabs_status', 1)->get();

            $grouped    = $categories->groupBy('parent_id');
            $buildTree  = function ($parentId) use (&$buildTree, $grouped) {
                return $grouped->get($parentId, collect())->map(function ($category) use ($buildTree) {
                    return [
                        'id'         => $category->id,
                        'name'      => $category->name,
                        'slug'       => $category->slug,
                        'parent_id'  => $category->parent_id,
                        'children'   => $buildTree($category->id),
                    ];
                });
            };
            $chkBanner    = Banner::where('type', 'top_banner')->first();
            $topBanner    = !empty($chkBanner) ? url($chkBanner->banner_image) : "";
            $sliderBanner = Banner::where('type', 'slider')->get();
            $sliders = $sliderBanner->map(function ($item) {
                if (!empty($item->home_slider)) {
                    $item->home_slider = url($item->home_slider);
                }
                return $item;
            });
            // Start with parent_id = 0 (top-level)
            $nestedCategories = $buildTree(0);
            $settingData        = Setting::find(1);
            $promotionalStatus  = !empty($settingData->promotional_banner) ? $settingData->promotional_banner : "";

            return response()->json([
                'success'   => true,
                'data'      => $nestedCategories,
                'pro_status'  => $promotionalStatus,
                'topBanner' => $topBanner,
                'sliders' => $sliders,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Category fetch failed: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch categories. Please try again later.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    public function categoryFilter(Request $request)
    {
        $slug = $request->slug;

        $checkCategories = ProductCategory::where('slug', $slug)->first();


        $filterProducts = Product::where('subcategoryId', $checkCategories->id)
            ->where('status', 1)
            ->limit(6)
            ->get()
            ->map(function ($product) {
                return [
                    'id'    => $product->id,
                    'name' => Str::limit($product->name, 25, '...'),
                    'fname' => $product->name,
                    'slug'  => $product->slug,
                    'price' => $product->price,
                    'discount_price' => $product->discount_price,
                    'thumbnail'      => $product->thumnail_img ? url($product->thumnail_img) : null,
                ];
            });
        $subcategoryImage = !empty($checkCategories->banner_sub_cat_image) ? url($checkCategories->banner_sub_cat_image) : null;


        $checkinSubCategories = ProductCategory::where('parent_child_id', $checkCategories->id)
            ->where('status', 1) // filter in DB
            ->get()
            ->map(function ($cat) {
                return [
                    'id'        => $cat->id,
                    'name'      => $cat->name,
                    'slug'      => $cat->slug,
                    'thumbnail' => $cat->insubCategoryImage ? url($cat->insubCategoryImage) : null,
                ];
            });


        return response()->json([
            'success' => true,
            'product' => $filterProducts,
            'subcategoryImage' => $subcategoryImage,
            'childId'       => $checkCategories->id ?? null,
            'subCateName'   => $checkCategories->name ?? null,
            'checkinSubCategories' => $checkinSubCategories,

        ]);
    }

    public function inSubcategoryFilter(Request $request)
    {
        $slug = $request->slug;

        $checkCategories = ProductCategory::where('slug', $slug)->first();


        $filterProducts = Product::where('inSubcategoryId', $checkCategories->id)
            ->where('status', 1)
            ->limit(6)
            ->get()
            ->map(function ($product) {
                return [
                    'id'    => $product->id,
                    'name' => Str::limit($product->name, 25, '...'),
                    'fname' => $product->name,
                    'slug'  => $product->slug,
                    'price' => $product->price,
                    'discount_price' => $product->discount_price,
                    'thumbnail'      => $product->thumnail_img ? url($product->thumnail_img) : null,
                ];
            });
        $subcategoryImage = !empty($checkCategories->banner_sub_cat_image) ? url($checkCategories->banner_sub_cat_image) : null;


        $checkinSubCategories = ProductCategory::where('parent_child_id', $checkCategories->id)
            ->where('status', 1) // filter in DB
            ->get()
            ->map(function ($cat) {
                return [
                    'id'        => $cat->id,
                    'name'      => $cat->name,
                    'slug'      => $cat->slug,
                    'thumbnail' => $cat->insubCategoryImage ? url($cat->insubCategoryImage) : null,
                ];
            });


        return response()->json([
            'success' => true,
            'product' => $filterProducts,
            'subcategoryImage' => $subcategoryImage,
            'childId'       => $checkCategories->id ?? null,
            'subCateName'   => $checkCategories->name ?? null,
            'checkinSubCategories' => $checkinSubCategories,

        ]);
    }
    public function getsAllproductsByInSubCategories(Request $request)
    {
        //dd($request->all());
        $slug                   = $request->query('slug');
        $offset                 = $request->query('offset', 0);
        $limit                  = $request->query('limit', 40);
        $checkCategories = ProductCategory::where('slug', $slug)->first();

        $query = Product::where('status', 1);

        if (!empty($checkCategories)) {
            $query->where('inSubcategoryId', $checkCategories->id);
        }
        $products = $query->orderBy('id', 'desc')
            ->skip($offset)
            ->take($limit)
            ->get();
        //      dd($products);
        $get_products      = $products->map(function ($data) {
            $checksupplier = Supplier::find($data->supplier_id);
            return [
                'id'                => $data->id,
                'name'              => Str::limit($data->name, 25, '...'),
                'fname'             => $data->name,
                'slug'              => $data->slug,
                'price'             => $data->price,
                'description_full'  => $data->description_full,
                'discount_price'    => $data->discount_price,
                'thumnail_img'      => $data->thumnail_img ? url($data->thumnail_img) : null,
                'vendor'            => $checksupplier ? $checksupplier->name : 'BIR GROUP',
                'currency'          => 'Tk.',
            ];
        });
        return response()->json([
            'success' => true,
            'product' => $get_products,
        ]);
    }



    public function getChildDataOnly(Request $request)
    {

        $parent_id       = $request->parent_id;
        $checkCategories = ProductCategory::where('parent_id', $parent_id)->where('status', 1)->get();


        return response()->json([
            'success' => true,
            'childData' => $checkCategories,
        ]);
    }


    public function getChildChildDataOnly(Request $request)
    {

        $parent_child_id   = $request->parent_child_id;
        $checkCategories   = ProductCategory::where('parent_child_id', $parent_child_id)->where('status', 1)->get();

        return response()->json([
            'success'     => true,
            'inChildData' => $checkCategories,
        ]);
    }




    public function getsAllproductsBySubCategories(Request $request)
    {
        //dd($request->all());
        $slug                   = $request->query('slug');
        $category_id            = $request->query('category_id', null);
        $subcategory_id         = $request->query('subcategory_id', null);
        $offset                 = $request->query('offset', 0);
        $limit                  = $request->query('limit', 40);
        $checkCategories = ProductCategory::where('slug', $slug)->first();

        //dd($checkCategories);


        // âœ… Only check slug if both category and subcategory are NOT provided
        if (empty($category_id) && empty($subcategory_id) && !empty($slug)) {
            $checkCategories = ProductCategory::where('slug', $slug)->first();
            $subcategory_id  = $checkCategories->id ?? null;
        }
        $inSubcategory_id  = $checkCategories->id ?? null;
        // âœ… Build the query
        $query = Product::where('status', 1);
        if (!empty($category_id)) {
            $query->where('categoryId', $category_id);
        }
        if (!empty($subcategory_id)) {
            $query->where('subcategoryId', $subcategory_id);
        }
        $products = $query->orderBy('id', 'desc')
            ->skip($offset)
            ->take($limit)
            ->get();
        //      dd($products);
        $get_products      = $products->map(function ($data) {
            $checksupplier = Supplier::find($data->supplier_id);
            return [
                'id'                => $data->id,
                'name'              => $data->name,
                'slug'              => $data->slug,
                'price'             => $data->price,
                'description_full'  => $data->description_full,
                'discount_price'    => $data->discount_price,
                'thumnail_img'      => $data->thumnail_img ? url($data->thumnail_img) : null,
                'vendor'            => $checksupplier ? $checksupplier->name : 'BIR GROUP',
                'currency'          => 'Tk.',
            ];
        });
        return response()->json([
            'success' => true,
            'product' => $get_products,
        ]);
    }
    public function getsAllproductsByCategories(Request $request)
    {
        //dd($request->all());
        $slug                   = $request->query('slug');
        //$category_id          = $request->query('category_id', null);
        $subcategory_id         = $request->query('subcategory_id', null);
        $offset                 = $request->query('offset', 0);
        $limit                  = $request->query('limit', 40);
        $checkCategories        = ProductCategory::where('slug', $slug)->first();

        $checkSubcategories = ProductCategory::where('parent_id', $checkCategories->id)->where('tabs_status', 1)->where('status', 1)->get();



        if ($checkCategories) {
            $category_id    = $checkCategories->id;
        }
        $query                  = Product::where('status', 1);
        if ($category_id) {
            $query->where('categoryId', $category_id);
        }
        if ($subcategory_id) {
            $query->where('subcategoryId', $subcategory_id);
        }
        $products = $query->orderBy('id', 'desc')
            ->skip($offset)
            ->take($limit)
            ->get();

        $get_products      = $products->map(function ($data) {
            $checksupplier = Supplier::find($data->supplier_id);
            return [
                'id'                => $data->id,
                'name'              => $data->name,
                'slug'              => $data->slug,
                'price'             => $data->price,
                'description_full'  => $data->description_full,
                'discount_price'    => $data->discount_price,
                'thumnail_img'      => $data->thumnail_img ? url($data->thumnail_img) : null,
                'vendor'            => $checksupplier ? $checksupplier->name : 'BIR GROUP',
                'currency'          => 'Tk.',
            ];
        });
        return response()->json([
            'success' => true,
            'product' => $get_products,
            'subCategoryLists' => $checkSubcategories ?? [],
            'categoryInsideImage' => !empty($checkCategories->category_image_inside_page) ? url($checkCategories->category_image_inside_page) : null,
        ]);
    }
    public function getsAllproducts(Request $request)
    {
        // dd($request->all());
        $category_id            = $request->query('category_id', null);
        $subcategory_id         = $request->query('subcategory_id', null);
        $offset                 = $request->query('offset', 0);
        $limit                  = $request->query('limit', 40);
        $query                  = Product::where('status', 1);

        if ($category_id) {
            $query->where('categoryId', $category_id);
        }
        if ($subcategory_id) {
            $query->where('subcategoryId', $subcategory_id);
        }

        $products = $query->orderBy('id', 'desc')
            ->skip($offset)
            ->take($limit)
            ->get();
        $get_products      = $products->map(function ($data) {
            $checksupplier = Supplier::find($data->supplier_id);
            return [
                'id'                => $data->id,
                'name'              => Str::limit($data->name, 25, '...'),
                'fname'             => $data->name,
                'slug'              => $data->slug,
                'price'             => $data->price,
                'description_full'  => $data->description_full,
                'discount_price'    => $data->discount_price,
                'thumnail_img'      => $data->thumnail_img ? url($data->thumnail_img) : null,
                'vendor'            => $checksupplier ? $checksupplier->name : 'BIR GROUP',
                'currency'          => 'Tk.',
            ];
        });

        $categories = ProductCategory::where('status', 1)->where('parent_id', 0)->where('tabs_status', 1)->get()->map(function ($category) {
            return [
                'id'                => $category->id,
                'name'              => $category->name,
                'categorySlug'      => $category->slug,
            ];
        });

        return response()->json([
            'success' => true,
            'product' => $get_products,
            'categories' => $categories,
        ]);
    }
    public function getCategoryParent()
    {
        $categories = ProductCategory::where('status', 1)
            ->where('parent_id', 0)
            ->where('status', 1)
            ->whereNotNull('thumbnail_image')
            ->get();
        // Map through categories
        $mappedCategories = $categories->map(function ($category) {
            return [
                'id'              => $category->id,
                'name'            => $category->name,
                'slug'            => $category->slug,
                'parent_id'       => $category->parent_id,
                'thumbnail_image' => $category->thumbnail_image ? url($category->thumbnail_image) : null,
                'banner_image'    => $category->banner_image ? url($category->banner_image) : null,
            ];
        });
        return response()->json([
            'success' => true,
            'data' => $mappedCategories,
        ], 200);
    }


    public function productsCategory(Request $request)
    {
        try {
            $categories = ProductCategory::where('status', 1)->where('tabs_status', 1)->orderBy('sorting', 'asc')->get();
            $grouped    = $categories->groupBy('parent_id');
            // ðŸ”¹ Recursive closure to build tree
            $buildTree = function ($parentId) use (&$buildTree, $grouped) {
                return $grouped->get($parentId, collect())->map(function ($category) use ($buildTree, $grouped) {
                    // Get up to 6 products for this category
                    $filterProducts = Product::where('categoryId', $category->id)
                        ->where('status', 1)
                        ->limit(6)
                        ->get()
                        ->map(function ($product) {
                            return [
                                'id'    => $product->id,
                                'name'  => Str::limit($product->name, 20, '...'),
                                'fname' => $product->name,
                                'slug'  => $product->slug,
                                'price' => $product->price,
                                'discount_price' => $product->discount_price,
                                'thumbnail'      => $product->thumnail_img ? url($product->thumnail_img) : null,
                            ];
                        });

                    // Recursively build child categories
                    $children = $buildTree($category->id)->take(10);

                    // ðŸ”¹ Check if any category has parent_child_id = current category id
                    $hasInSubCategory = $category->where('parent_child_id', $category->id)->first();



                    return [
                        'id'              => $category->id,
                        'name'            => $category->name,
                        'slug'            => $category->slug,
                        'parent_id'       => $category->parent_id,
                        'thumbnail_image' => $category->thumbnail_image ? url($category->thumbnail_image) : null,
                        'banner_image'    => $category->banner_image ? url($category->banner_image) : null,
                        'children'        => $children,       // nested categories
                        'products'        => $filterProducts, // related products
                        'insub_category'  => $hasInSubCategory ? true : false, // ðŸ”¹ new flag
                    ];
                });
            };



            // ðŸ”¹ Start recursion from root categories (parent_id = 0)
            $nestedCategories = $buildTree(0);

            // ðŸ”¹ Return JSON
            return response()->json([
                'success' => true,
                'data'    => $nestedCategories,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Category fetch failed: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch categories. Please try again later.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }


    public function productsCategoryAllData(Request $request)
    {
        try {
            $categories = ProductCategory::where('status', 1)->where('tabs_status', 1)->get();
            $grouped    = $categories->groupBy('parent_id');
            // Recursive closure
            $buildTree = function ($parentId) use (&$buildTree, $grouped) {
                return $grouped->get($parentId, collect())->map(function ($category) use ($buildTree) {
                    // Get up to 6 products for this category
                    $filterProducts = Product::where('categoryId', $category->id)
                        ->where('status', 1)
                        ->get()
                        ->map(function ($product) {
                            return [
                                'id'    => $product->id,
                                'name'  => $product->name,
                                'slug'  => $product->slug,
                                'price' => $product->price,
                                'discount_price' => $product->discount_price,
                                'thumbnail'      => $product->thumnail_img ? url($product->thumnail_img) : null,
                            ];
                        });
                    // Recursively build child categories (limited to 6)
                    $children = $buildTree($category->id)->take(150);
                    return [
                        'id'              => $category->id,
                        'name'            => $category->name,
                        'slug'            => $category->slug,
                        'parent_id'       => $category->parent_id,
                        'thumbnail_image' => $category->thumbnail_image ? url($category->thumbnail_image) : null,
                        'banner_image'    => $category->banner_image ? url($category->banner_image) : null,
                        'children'        => $children,       // nested categories
                        'products'        => $filterProducts, // related products
                    ];
                });
            };
            // Start recursion from parent_id = 0 (root)
            $nestedCategories = $buildTree(0);
            return response()->json([
                'success' => true,
                'data' => $nestedCategories,
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Category fetch failed: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch categories. Please try again later.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function searchProducts(Request $request)
    {
        $query = $request->query('q', '');
        if (!$query) {
            return response()->json([
                'success' => false,
                'product' => [],
            ]);
        }
        // Wildcard search in name or description
        $products = Product::where('name', 'like', "%{$query}%")
            // ->orWhere('description_full', 'like', "%{$query}%")
            ->where('status', 1)
            ->orderBy('id', 'desc')
            ->limit(20)
            ->get();
        $get_prdoucts = $products->map(function ($data) {
            return [
                'id'              => $data->id,
                'name'            => $data->name,
                'slug'            => $data->slug,
                'price'           => $data->price,
                'discount_price'  => $data->discount_price,
                'thumnail_img'    => $data->thumnail_img ? url($data->thumnail_img) : null,
                'vendor'          => 'BIR GROUP',
            ];
        });
        return response()->json([
            'success' => true,
            'product' => $get_prdoucts,
        ]);
    }


    public function getInSubProducts(Request $request)
    {
        // dd($request->all());
        $product = Product::where('status', 1)->where('inSubcategoryId', $request->id)->orderBy('id', 'desc')->get();
        $get_prdoucts = $product->map(function ($data) {
            return [
                'id'              => $data->id,
                'name'            => $data->name,
                'slug'            => $data->slug,
                'price'           => $data->price,
                'discount_price'  => $data->discount_price,
                'thumnail_img'    => $data->thumnail_img ? url($data->thumnail_img) : null,
                'vendor'          => 'BIR GROUP',
            ];
        });
        // Return a 404 response if not found
        return response()->json([
            'success'               => true,
            'product'               => $get_prdoucts,
        ], 200);
    }






    public function getProducts()
    {
        $product = Product::where('status', 1)->limit(12)->orderBy('id', 'desc')->get();
        $get_prdoucts = $product->map(function ($data) {
            return [
                'id'              => $data->id,
                'name'            => $data->name,
                'slug'            => $data->slug,
                'price'           => $data->price,
                'discount_price'  => $data->discount_price,
                'thumnail_img'    => $data->thumnail_img ? url($data->thumnail_img) : null,
                'vendor'          => 'BIR GROUP',
            ];
        });
        // Return a 404 response if not found
        return response()->json([
            'success'               => true,
            'product'               => $get_prdoucts,
        ], 200);
    }



    public function getsPost(Request $request)
    {
        $category_id = $request->query('category_id');
        $post        = Post::where('categoryId', $category_id)->first();
        // Return a 404 response if not found
        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Post not found.',
            ], 404);
        }
        return response()->json([
            'success'               => true,
            'data'                  => $post,
        ], 200);
    }




    public function checkedProductRow($slug)
    {
        $post = Product::where('slug', $slug)->first();

        // âœ… 404 if not found
        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Post not found.',
            ], 404);
        }

        // âœ… Related posts
        $relatedPosts = Product::where('status', 1)
            ->where('categoryId', $post->categoryId) // better dynamic
            ->where('id', '!=', $post->id) // exclude current
            ->latest()
            ->limit(10)
            ->get();

        $relatedData = $relatedPosts->map(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->name,
                'slug' => $item->slug,
                'description' => $item->description_short,
                'image' => $item->thumnail_img ? url($item->thumnail_img) : null,
                'created_at' => $item->created_at->format('d M Y'),
            ];
        });

        // âœ… Main post data
        $data = [
            'id' => $post->id,
            'title' => $post->name,
            'slug' => $post->slug,
            'short_description' => $post->description_short,
            'description' => $post->description_full,
            'meta_title' => $post->meta_title,
            'meta_description' => $post->meta_description,
            'meta_keyword' => $post->meta_keyword,
            'category_id' => $post->categoryId,
            'author' => 'Astute360',
            'image' => $post->thumnail_img ? url($post->thumnail_img) : null,
            'status' => $post->status,
            'created_at' => $post->created_at->format('d M Y'),
            'updated_at' => $post->updated_at->format('d M Y'),
        ];

        return response()->json([
            'success' => true,
            'data' => $data,
            'related_posts' => $relatedData,
        ], 200);
    }

    public function checkedPostRow($slug)
    {
        $post = Post::where('slug', $slug)->first();

        // âœ… 404 if not found
        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Post not found.',
            ], 404);
        }

        // âœ… Related posts
        $relatedPosts = Post::where('status', 1)
            ->where('categoryId', $post->categoryId) // better dynamic
            ->where('id', '!=', $post->id) // exclude current
            ->latest()
            ->limit(10)
            ->get();

        $relatedData = $relatedPosts->map(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->name,
                'slug' => $item->slug,
                'description' => $item->description_short,
                'image' => $item->thumnail_img ? url($item->thumnail_img) : null,
                'created_at' => $item->created_at->format('d M Y'),
            ];
        });

        // âœ… Main post data
        $data = [
            'id' => $post->id,
            'title' => $post->name,
            'slug' => $post->slug,
            'short_description' => $post->description_short,
            'description' => $post->description_full,
            'meta_title' => $post->meta_title,
            'meta_description' => $post->meta_description,
            'meta_keyword' => $post->meta_keyword,
            'category_id' => $post->categoryId,
            'author' => 'Astute360',
            'image' => $post->thumnail_img ? url($post->thumnail_img) : null,
            'status' => $post->status,
            'created_at' => $post->created_at->format('d M Y'),
            'updated_at' => $post->updated_at->format('d M Y'),
        ];

        return response()->json([
            'success' => true,
            'data' => $data,
            'related_posts' => $relatedData,
        ], 200);
    }

    public function getsBlogPost(Request $request)
    {
        $category_id = $request->query('category_id');

        $post        = Post::where('categoryId', $category_id)->where('status', 1)->get();

        $get_prdoucts = $post->map(function ($data) {
            return [
                'id'              => $data->id,
                'name'            => $data->name,
                'slug'            => $data->slug,
                'description_full' => $data->description_full,
                'meta_title'      => $data->meta_title,
                'meta_description' => $data->meta_description,
                'meta_keyword'    => $data->meta_keyword,
                'createdAt'       => date("d-M-Y", strtotime($data->created_at)),
                'thumnail_img'    => $data->thumnail_img ? url($data->thumnail_img) : null,
                'vendor'          => 'FutureGenIT',
            ];
        });
        return response()->json([
            'success'               => true,
            'data'                  => $get_prdoucts,
        ], 200);
    }



    public function getsAllServices(Request $request)
    {
        $category_id = 3; //$request->query('category_id');

        $post        = Product::where('categoryId', $category_id)->where('status', 1)->get();
        $settingData = Setting::where('id', 1)->first();

        $get_prdoucts = $post->map(function ($data) {
            return [
                'id'              => $data->id,
                'name'            => $data->name,
                'slug'            => $data->slug,
                'description_full' => $data->description_full,
                'meta_title'      => $data->meta_title,
                'meta_description' => $data->meta_description,
                'meta_keyword'    => $data->meta_keyword,
                'createdAt'       => date("d-M-Y", strtotime($data->created_at)),
                'thumnail_img'    => $data->thumnail_img ? url($data->thumnail_img) : null,
                'vendor'          => 'FutureGenIT',
                'categoryId'      => $data->categoryId,
                'subcategoryId'   => $data->subcategoryId,
                'inSubcategoryId' => $data->inSubcategoryId,
            ];
        });
        return response()->json([
            'success'               => true,
            'data'                  => $get_prdoucts,
            'settingData'           => $settingData,

        ], 200);
    }



    public function getsAllTraining(Request $request)
    {
        $category_id = 4; //$request->query('category_id');

        $post        = Product::where('categoryId', $category_id)->where('status', 1)->get();

        $get_prdoucts = $post->map(function ($data) {
            return [
                'id'              => $data->id,
                'name'            => $data->name,
                'slug'            => $data->slug,
                'description_full' => $data->description_full,
                'meta_title'      => $data->meta_title,
                'meta_description' => $data->meta_description,
                'meta_keyword'    => $data->meta_keyword,
                'createdAt'       => date("d-M-Y", strtotime($data->created_at)),
                'thumnail_img'    => $data->thumnail_img ? url($data->thumnail_img) : null,
                'vendor'          => 'Astute360',
            ];
        });
        return response()->json([
            'success'               => true,
            'data'                  => $get_prdoucts,
        ], 200);
    }
    public function popularPosts()
    {
        $post        = Post::where('status', 1)->get();

        $get_prdoucts = $post->map(function ($data) {
            return [
                'id'              => $data->id,
                'name'            => $data->name,
                'slug'            => $data->slug,
                'description_full' => $data->description_full,
                'meta_title'      => $data->meta_title,
                'meta_description' => $data->meta_description,
                'meta_keyword'    => $data->meta_keyword,
                'createdAt'       => date("d-M-Y", strtotime($data->created_at)),
                'thumnail_img'    => $data->thumnail_img ? url($data->thumnail_img) : null,
                'vendor'          => 'Astute360',
            ];
        });
        return response()->json([
            'success'               => true,
            'data'                  => $get_prdoucts,
        ], 200);
    }


    public function track($order_number)
    {
        //   dd($order_number);
        $order = Orders::where('orderId', $order_number)->first();



        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }


        $checkOrderSts = OrderStatus::where('id', $order->order_status)->first();
        $orderstsName = !empty($checkOrderSts) ? $checkOrderSts->name : "";

        return response()->json([
            'success'       => true,
            'order_id'      => $order->orderId,
            'order_status'  => $orderstsName // Pending, Delivered, Processing
        ]);
    }

    public function getSetting(Request $request)
    {
        $post        = Setting::where('id', 1)->first();
        // Return a 404 response if not found
        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Data not found.',
            ], 404);
        }
        return response()->json([
            'success'               => true,
            'data'                  => $post,
        ], 200);
    }


    public function checkProductDetails($slug)
    {
        $product = Product::where('slug', $slug)->where('status', 1)->first();
        //   dd($product);
        if ($product) {
            $product->thumnail_img = $product->thumnail_img ? url($product->thumnail_img) : null;
        }
        // Return a 404 response if not found
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.',
            ], 404);
        }
        $rproducts = Product::where('categoryId', $product->categoryId)->where('id', '!=', $product->id)->where('status', 1)->get();
        //dd($rproducts);
        $related_prdoucts = $rproducts->map(function ($data) {
            return [
                'id'              => $data->id,
                'name'            => $data->name,
                'slug'            => $data->slug,
                'price'           => $data->price,
                'discount_price'  => $data->discount_price,
                'thumbnail_image' => $data->thumnail_img ? url($data->thumnail_img) : null,
                'vendor'          => 'BIR GROUP',
            ];
        });
        // dd($product->id);

        // Fetch related data
        $attributes = ProductsAttribues::where('product_id', $product->id)->get();
        $galleries  = ProductsGallery::where('product_id', $product->id)->get();
        // Map gallery data with full URL
        $formattedGallery = $galleries->map(function ($gallery) {
            return [
                'id'            => $gallery->id,
                'product_id'    => $gallery->product_id,
                'gallery_image' => $gallery->gallery_image ? url($gallery->gallery_image) : null,
            ];
        });
        // Return a structured JSON response
        return response()->json([
            'success'               => true,
            'product'               => $product,
            'attributes'            => $attributes,
            'gallery'               => $formattedGallery,
            'related_prdoucts'      => $related_prdoucts,
        ], 200);
    }

    /*
    public function contact(Request $request)
    {
        $validatedData = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'message' => 'required',
        ]);

        // Log the contact message (you can replace this with actual email sending logic)
       // Log::info('Contact Message Received:', $validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Thank you for contacting us. We will get back to you shortly.'
        ]);
    }
    */
     //START
     public function contact(Request $request)
{
    $validated = $request->validate([
        'name'    => 'required|max:255',
        'email'   => 'required|email|max:255',
        'phone'   => 'nullable|max:20',
        'subject' => 'nullable|max:255',
        'message' => 'required',
    ]);

    try {
        $name    = htmlspecialchars($validated['name']);
        $email   = htmlspecialchars($validated['email']);
        $phone   = htmlspecialchars($validated['phone']   ?? 'N/A');
        $subject = htmlspecialchars($validated['subject'] ?? 'No Subject');
        $message = nl2br(htmlspecialchars($validated['message']));

        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: {$name} <{$email}>\r\n";
        $headers .= "Reply-To: {$email}\r\n";

        $body = "
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> {$name}</p>
            <p><strong>Email:</strong> {$email}</p>
            <p><strong>Phone:</strong> {$phone}</p>
            <p><strong>Subject:</strong> {$subject}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>{$message}</p>
        ";

        $recipients = 'mdbijon@gmail.com, info@futuregenit.com';

        $sent = mail($recipients, "New Contact FuturegenIT: {$subject}", $body, $headers);

        if (!$sent) {
            throw new \Exception('Mail delivery failed.');
        }

        return response()->json([
            'success' => true,
            'message' => 'Thank you for contacting us. We will get back to you shortly.',
        ]);

    } catch (\Exception $e) {
        Log::error('Contact form email failed: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}
     //END
      
      

    public function testApiCallbackHook(Request $request)
    {
        Log::info('Test API Request:', $request->all());

        return response()->json([
            'message' => 'Test API working'
        ]);
    }
}
