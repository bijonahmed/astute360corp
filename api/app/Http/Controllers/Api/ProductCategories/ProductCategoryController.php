<?php

namespace App\Http\Controllers\Api\ProductCategories;

use App\Http\Controllers\Controller;
use App\Models\PostCategory;
use App\Models\ProductCategory;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpParser\Node\Stmt\Catch_;
use PhpParser\Node\Stmt\TryCatch;
use Illuminate\Support\Str;
use Validator;

class ProductCategoryController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('view product category')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view category',
            ], 403);
        }

        try {
            $query = ProductCategory::where('tabs_status', 1)->where('status', 1)->orderBy('id', 'desc')->get()->map(function ($item) {
                if ($item->thumbnail_image) {
                    $item->thumbnail_image = url($item->thumbnail_image); // full URL
                }
                if ($item->banner_image) {
                    $item->banner_image = url($item->banner_image); // full URL
                }

                if ($item->banner_sub_cat_image) {
                    $item->banner_sub_cat_image = url($item->banner_sub_cat_image); // full URL
                }

                if ($item->category_image_inside_page) {
                    $item->category_image_inside_page = url($item->category_image_inside_page); // full URL
                }

                return $item;
            });



            return response()->json([
                'data'          => $query,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong',
                'message' => $e->getMessage(),
            ], 500);
        }
    }




    public function getinSubCategory(Request $request)
    {

        //  dd($request->all());

        $user = Auth::user();
        if (! $user->can('view product category')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view category',
            ], 403);
        }

        try {
            $insubCateogry = ProductCategory::where('tabs_status', 2)
                ->when($request->filterStatus !== null && $request->filterStatus !== '', function ($q) use ($request) {
                    $q->where('status', $request->filterStatus);
                })
                ->when($request->subcategoryId, function ($q) use ($request) {
                    // parent_child_id = parent subcategory
                    $q->where('parent_child_id', $request->subcategoryId);
                })
                ->when($request->selectedCategory, function ($q) use ($request) {
                    // main category = parent_id of parent_child
                    $q->whereHas('parentChild.parent', function ($query) use ($request) {
                        $query->where('id', $request->selectedCategory);
                    });
                })
                ->orderBy('id', 'desc')
                ->get()
                ->map(function ($item) {

                    $parentName = "";
                    $childName  = "";
                    $pId = "";

                    // 🔹 Child level
                    if (!empty($item->parent_child_id)) {

                        $childCategory = ProductCategory::find($item->parent_child_id);

                        if ($childCategory) {
                            $childName = $childCategory->name;

                            // 🔹 Parent of child
                            if (!empty($childCategory->parent_id)) {
                                $parentCategory = ProductCategory::find($childCategory->parent_id);
                                $parentName = $parentCategory ? $parentCategory->name : "";
                                $pId = $parentCategory ? $parentCategory->id : "";
                            }
                        }
                    }

                    if (!empty($item->insubCategoryImage)) {
                        $item->insubCategoryImage = url($item->insubCategoryImage);
                    }

                    $item->parentName = $parentName;
                    $item->childName  = $childName;
                    $item->pid        = $pId;

                    return $item;
                });


            return response()->json([
                'insubCateogry' => $insubCateogry,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function restoreCategorys(Request $request)
    {
        $data = ProductCategory::where('status', 0)
            ->where('tabs_status', 1)
            ->get()
            ->map(function ($category) {
                return [
                    'id'     => $category->id,
                    'name'   => $category->name,
                    'slug'   => $category->slug,
                    'status' => $category->status,
                ];
            });

        return response()->json([
            'success' => true,
            'data'    => $data,
        ], 200);
    }




    public function insubcategory(Request $request)
    {

        // dd($request->all());

        $user = Auth::user();
        if (! $user->can('view product category')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view category',
            ], 403);
        }

        $subcategory_id   = $request->subcategory_id;
        $query         = ProductCategory::where('parent_child_id', $subcategory_id)->where('tabs_status', 2)->where('status', 1)->orderBy('id', 'desc')->get();

        return response()->json([
            'inSubCatAll'          => $query
        ], 200);

        exit;
    }


    public function checkSubcategory(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('view product category')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view category',
            ], 403);
        }

        $category_id   = $request->category_id;
        $query         = ProductCategory::where('parent_id', $category_id)->where('tabs_status', 1)->where('status', 1)->orderBy('id', 'desc')->get();

        return response()->json([
            'data'          => $query
        ], 200);

        exit;
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('create product category')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create product category',
            ], 403);
        }
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $user_id = $user->id;

        $data = [
            'name'          => $request->name,
            'slug'          => Str::slug($request->name),
            'parent_id'     => 0,
            'status'        => 1, // !empty($request->status) ? $request->status : "",
        ];

        $resdata = ProductCategory::insertGetId($data);
        return response()->json($resdata);
    }



    public function createSubcategory(Request $request)
    {
        //dd($request->all());
        $user = Auth::user();
        if (! $user->can('create product category')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create product category',
            ], 403);
        }
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'parent_id' => 'required',
            'status'    => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [
            'name'          => $request->name,
            'slug'          => Str::slug($request->name),
            'parent_id'     => $request->parent_id,
            'status'        => $request->status,
        ];
        //dd($data);

        $resdata = ProductCategory::insertGetId($data);
        return response()->json($resdata);
    }

    public function postrow($id)
    {
        $data = PostCategory::where('id', $id)->first();
        $responseData['data'] = $data;

        return response()->json($responseData);
    }

    public function destroy($id)
    {
        $user = Auth::user();

        if (! $user->can('delete posts category')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to delete',
            ], 403);
        }

        $post = PostCategory::find($id);
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

    public function updatestatus(Request $request, $id)
    {
        $user = Auth::user();

        if (! $user->can('edit product category')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit product category',
            ], 403);
        }

        // Validate request
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:0,1', // only allow 0 or 1
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Find category
        $category = ProductCategory::find($id);
        if (! $category) {
            return response()->json([
                'message' => 'Category not found',
            ], 404);
        }

        // Update status only
        $category->status = $request->status;
        $category->save();

        return response()->json([
            'id' => $category->id,
            'status' => $category->status,
            'message' => 'Status updated successfully',
        ]);
    }


    public function update(Request $request, $id)
    {
        // dd($request->all());
        $user = Auth::user();
        if (! $user->can('edit product category')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit product category',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name'    => 'required',
            'status'  => 'required',
            'sorting' => 'required',

        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [
            'name'   => $request->name,
            'sorting' => $request->sorting,
            'slug'   => Str::slug($request->name),
            'status' => $request->status,
        ];

        $category = ProductCategory::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        $category->update($data);
        $resdata['id'] = $category->id;

        return response()->json($resdata);
    }



    public function subcategoryUpdate(Request $request, $id)
    {
        //dd($request->all());
        $user = Auth::user();
        if (! $user->can('edit product category')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit product category',
            ], 403);
        }


        $chk = ProductCategory::where('id', $request->id)->first();
        if (!$chk) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'id'           => 'required',
            'parent_id'    => 'required',

        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $resdata = ProductCategory::where('id', $request->id) //31
            ->update([
                'parent_id' => $request->parent_id //79
            ]);


        return response()->json($resdata);
    }


    public function addinsubcategory(Request $request)
    {
        //  dd($request->all());

        $id = (int) $request->id; // may be empty for new insert

        $user = Auth::user();
        if (!$user->can('edit product category')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit product category',
            ], 403);
        }

        // Validate input
        $validator = Validator::make($request->all(), [
            'insubCategoryImage' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'name'               => 'required|string|max:255',
            'category_id'        => 'required|integer',
            'subcategoryId'      => 'nullable|integer', // allow empty for new insert
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Generate slug
        $slug = Str::slug($request->name);

        // Check if slug already exists (exclude current ID for update)
        $slugExists = ProductCategory::where('slug', $slug)
            ->when($id, function ($query) use ($id) {
                return $query->where('id', '!=', $id);
            })
            ->exists();

        if ($slugExists) {
            return response()->json([
                'message' => 'This subcategory name already exists',
            ], 409); // 409 Conflict
        }


        $data['name']       = $request->name;
        $data['slug']       = $request->slug;
        $data['status']     = $request->status ?? 1;
        $data['tabs_status'] = 2;

        // Handle image upload
        //$insubCategoryImage = null;
        if ($request->hasFile('insubCategoryImage')) {
            $thumbnail = $request->file('insubCategoryImage');
            $thumbnailName = 'thumb_' . time() . '.' . $thumbnail->getClientOriginalExtension();
            $thumbnail->move(public_path('uploads/categories'), $thumbnailName);
            $data['insubCategoryImage'] = 'uploads/categories/' . $thumbnailName;
        }

        $data['name']         = $request->name;
        $data['slug']         = $slug;
        $data['status']       = $request->status ?? 1;
        $data['tabs_status']  = 2;
        $data['parent_child_id']   = $request->subcategoryId;
        //  $data['insubCategoryImage'] = $insubCategoryImage ?? null;

        //dd($data);
        if ($id) {
            // Update existing
            ProductCategory::where('id', $id)->update($data);
        } else {
            // Insert new
            ProductCategory::insert($data);
        }
        //$category->save();
        return response()->json([
            'message' => $id ? 'Subcategory updated successfully' : 'Subcategory added successfully',
            'category' => $request->name,
        ]);
    }






    public function uploadCategoryImage(Request $request)
    {
        $id = (int) $request->id;

        $user = Auth::user();
        if (! $user->can('edit product category')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit product category',
            ], 403);
        }
        // Validate uploaded files
        $validator = Validator::make($request->all(), [
            'thumbnail_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Find the category
        $category = ProductCategory::find($id);
        if (! $category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail_image')) {
            $thumbnail = $request->file('thumbnail_image');
            $thumbnailName = 'thumb_' . time() . '.' . $thumbnail->getClientOriginalExtension();
            $thumbnail->move(public_path('uploads/categories'), $thumbnailName);
            $category->thumbnail_image = 'uploads/categories/' . $thumbnailName;
        }

        $category->save();

        return response()->json([
            'message' => 'Images uploaded successfully',
            'category' => $category,
        ]);
    }



    public function uploadBannerImageSubCategory(Request $request)
    {

        $id = (int) $request->id;

        $user = Auth::user();
        if (! $user->can('edit product category')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit product category',
            ], 403);
        }


        // Find the category
        $category = ProductCategory::find($id);
        if (! $category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // Handle thumbnail upload
        if ($request->hasFile('banner_sub_cat_image')) {
            $thumbnail = $request->file('banner_sub_cat_image');
            $thumbnailName = 'thumb_' . time() . '.' . $thumbnail->getClientOriginalExtension();
            $thumbnail->move(public_path('uploads/categories'), $thumbnailName);
            $category->banner_sub_cat_image = 'uploads/categories/' . $thumbnailName;
        }

        $category->save();

        return response()->json([
            'message' => 'Images uploaded successfully',
            'category' => $category,
        ]);
    }

    public function uploadBannerImageCategoryInside(Request $request)
    {
        //dd($request->all());

        $id = (int) $request->id;

        $user = Auth::user();
        if (! $user->can('edit product category')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit product category',
            ], 403);
        }
        // Validate uploaded files
        $validator = Validator::make($request->all(), [
            'category_image_inside_page' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Find the category
        $category = ProductCategory::find($id);
        if (! $category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // Handle thumbnail upload
        if ($request->hasFile('category_image_inside_page')) {
            $thumbnail = $request->file('category_image_inside_page');
            $thumbnailName = 'thumb_' . time() . '.' . $thumbnail->getClientOriginalExtension();
            $thumbnail->move(public_path('uploads/categories'), $thumbnailName);
            $category->category_image_inside_page = 'uploads/categories/' . $thumbnailName;
        }

        $category->save();

        return response()->json([
            'message' => 'Images uploaded successfully',
            'category' => $category,
        ]);
    }
    public function uploadBannerImage(Request $request)
    {
        //dd($request->all());

        $id = (int) $request->id;

        $user = Auth::user();
        if (! $user->can('edit product category')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit product category',
            ], 403);
        }
        // Validate uploaded files
        $validator = Validator::make($request->all(), [
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Find the category
        $category = ProductCategory::find($id);
        if (! $category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // Handle thumbnail upload
        if ($request->hasFile('banner_image')) {
            $thumbnail = $request->file('banner_image');
            $thumbnailName = 'thumb_' . time() . '.' . $thumbnail->getClientOriginalExtension();
            $thumbnail->move(public_path('uploads/categories'), $thumbnailName);
            $category->banner_image = 'uploads/categories/' . $thumbnailName;
        }

        $category->save();

        return response()->json([
            'message' => 'Images uploaded successfully',
            'category' => $category,
        ]);
    }
}
