<?php

namespace App\Http\Controllers\Api\Banner;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\PostCategory;
use App\Models\ProductCategory;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpParser\Node\Stmt\Catch_;
use PhpParser\Node\Stmt\TryCatch;
use Illuminate\Support\Str;
use Validator;

class BannerController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('view banner')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view banner',
            ], 403);
        }

        try {
            $query = Banner::orderBy('id', 'desc')->get()->map(function ($item) {
                if ($item->home_slider) {
                    $item->home_slider = url($item->home_slider); // full URL
                }
                if ($item->banner_image) {
                    $item->banner_image = url($item->banner_image); // full URL
                }
                return $item;
            });

            return response()->json([
                'data' => $query,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function SliderStore(Request $request)
    {
        // dd($request->all());

        $user = Auth::user();
        if (! $user->can('create banner')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create banner',
            ], 403);
        }
        $validator = Validator::make($request->all(), [
            'home_slider' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Find the category
        $checkData = new Banner();
        $checkData->name = 'For Slider'; //$request->input('name');
        $checkData->type = 'slider';


        // Handle thumbnail upload
        if ($request->hasFile('home_slider')) {
            $thumbnail = $request->file('home_slider');
            $thumbnailName = 'thumb_' . time() . '.' . $thumbnail->getClientOriginalExtension();
            $thumbnail->move(public_path('uploads/banner'), $thumbnailName);
            $checkData->home_slider = 'uploads/banner/' . $thumbnailName;
        }

        $checkData->save();

        return response()->json([
            'message' => 'Images uploaded successfully',
            'category' => $checkData,
        ]);
    }



    public function bannerStore(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('create banner')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create banner',
            ], 403);
        }
        $validator = Validator::make($request->all(), [
            'banner_image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // required and max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $existingBanner = Banner::where('type', 'top_banner')->first();

        if ($existingBanner) {
            if ($existingBanner->banner_image && file_exists(public_path($existingBanner->banner_image))) {
                unlink(public_path($existingBanner->banner_image));
            }
            $existingBanner->delete();
        }

        $banner = new Banner();
        $banner->name = 'For Banner';
        $banner->type = 'top_banner';

        if ($request->hasFile('banner_image')) {
            $file = $request->file('banner_image');
            $fileName = 'thumb_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/banner'), $fileName);
            $banner->banner_image = 'uploads/banner/' . $fileName;
        }
        $banner->save();

        return response()->json([
            'message' => 'Top banner replaced successfully',
            'banner' => $banner,
        ]);
    }




    public function postrow($id)
    {
        $data = PostCategory::where('id', $id)->first();
        $responseData['data'] = $data;

        return response()->json($responseData);
    }

    public function destroyHomeSlider(Request $request)
    {
        $user = Auth::user();

        if (! $user->can('delete banner')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to delete',
            ], 403);
        }
        $id = (int) $request->id;
        $banner = Banner::find($id);

        if (! $banner) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }
        // ✅ Delete image file from server (if exists)
        if ($banner->home_slider && file_exists(public_path($banner->home_slider))) {
            unlink(public_path($banner->home_slider));
        }

        if ($banner->banner_image && file_exists(public_path($banner->banner_image))) {
            unlink(public_path($banner->banner_image));
        }
        $banner->delete();

        return response()->json([
            'message' => 'Banner deleted successfully',
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
            'name'   => 'required',
            'status' => 'required',

        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [
            'name'   => $request->name,
            'slug'   => Str::slug($request->name),
            'status' => $request->status,
        ];

        $data['id'] = $request->id;

        $post = ProductCategory::find($request->id);
        $post->update($data);
        $resdata['id'] = $post->id;

        return response()->json($resdata);
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
