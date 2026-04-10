<?php

namespace App\Http\Controllers\Api\Post;

use App\Http\Controllers\Controller;
use App\Models\Post as PostModel;
use App\Models\PostCategory;
use Helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Validator;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('view posts')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view posts',
            ], 403);
        }

        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);
        // Get search query from the request
        $searchQuery = $request->searchQuery;
        // dd($selectedFilter);
        $status = $request->selectedFilter;
        $query = PostModel::select('posts.*');
          
        if ($searchQuery !== null) {
            $query->where('posts.name', 'like', '%' . $searchQuery . '%');
        }
        if ($status !== null) {
            // If the status is '1', we consider it 'active'; if '0', it is 'inactive'
            if ($status == 1) {
                $query->where('posts.status', 1); // Active
            } elseif ($status == 0) {
                $query->where('posts.status', 0); // Inactive
            }
        }
        $paginator          = $query->paginate($pageSize, ['*'], 'page', $page);
        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
        $categoryName       = PostCategory::where('id',$item->categoryId)->first();


            return [
                'id' => $item->id,
                'category_name' => !empty($categoryName->name) ? $categoryName->name : "",
                'name' => substr($item->name, 0, 250),
                'status' => $item->status,
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
       // dd($request->all());
        $user = Auth::user();
        if (! $user->can('create posts')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create posts',
            ], 403);
        }
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'categoryId' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
       
        $user_id  = $user->id;
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $request->input('name'))));
        $data = [
            'name' => $request->name,
            'slug' => $slug,
            'description_short' => ! empty($request->description_short) ? $request->description_short : '',
            'description_full' => ! empty($request->description_full) ? $request->description_full : '',
            'meta_title' => ! empty($request->meta_title) ? $request->meta_title : '',
            'meta_description' => ! empty($request->meta_description) ? $request->meta_description : '',
            'meta_keyword' => ! empty($request->meta_keyword) ? $request->meta_keyword : '',
            'categoryId' => ! empty($request->categoryId) ? $request->categoryId : '',
            'status' => 1, // !empty($request->status) ? $request->status : "",
            'entry_by' => $user_id,
        ];
        // dd($data);
        if (! empty($request->file('files'))) {
            $files = $request->file('files');
            $fileName = Str::random(20);
            $ext = strtolower($files->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $files->move(public_path('/backend/files/'), $upload_url);
            $file_url = $uploadPath . $path;
            $data['thumnail_img'] = $file_url;
        }
        // Post::create($data);
        $resdata['product_id'] = PostModel::insertGetId($data);

        return response()->json($resdata);
    }

    public function serviceImgDelete(Request $request)
    {
        $id = $request->id;
        ServiceImages::where('id', $id)->delete();

        return response()->json('Delete Images');
    }

    public function postrow($id)
    {
        $data = PostModel::where('posts.id', $id)
            ->select('posts.*', 'post_category.name as category_name')
            ->join('post_category', 'posts.categoryId', '=', 'post_category.id')
            ->first();
        $responseData['data'] = $data;
        $responseData['images'] = ! empty($data->thumnail_img) ? url($data->thumnail_img) : '';

        return response()->json($responseData);
    }

    public function destroy($id)
    {
        $user = Auth::user();

        if (! $user->can('delete posts')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to delete posts',
            ], 403);
        }

        $post = PostModel::find($id);
        if (! $post) {
            return response()->json([
                'message' => 'Post not found',
            ], 404);
        }
        // $post->delete();
        return response()->json([
            'message' => 'Post deleted successfully',
            'id' => $id,
        ], 200);
    }

    public function update(Request $request)
    {

       // dd($request->all());

        $user = Auth::user();
        if (! $user->can('edit posts')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create posts',
            ], 403);
        }

        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name'        => 'required',
            'categoryId' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user_id = $user->id;
        // dd($user_id);

        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $request->input('name'))));
        $data = [
            'name' => $request->name,
            'slug' => $slug,
            'description_short' => ! empty($request->description_short) ? $request->description_short : '',
            'description_full'  => ! empty($request->description_full) ? $request->description_full : '',
            'meta_title'        => ! empty($request->meta_title) ? $request->meta_title : '',
            'meta_description'  => ! empty($request->meta_description) ? $request->meta_description : '',
            'meta_keyword'      => ! empty($request->meta_keyword) ? $request->meta_keyword : '',
            'categoryId'        => ! empty($request->categoryId) ? $request->categoryId : '',
            'status'            =>  $request->status !== null ? $request->status : 1, // fix here,
            'entry_by'          => $user_id,
        ];
        // dd($data);
        if (! empty($request->file('files'))) {
            $files = $request->file('files');
            $fileName = Str::random(20);
            $ext = strtolower($files->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $files->move(public_path('/backend/files/'), $upload_url);
            $file_url = $uploadPath . $path;
            $data['thumnail_img'] = $file_url;
        }

      //  dd($data);
        $data['id'] = $request->id;

        $post = PostModel::find($request->id);
        $post->update($data);
        $resdata['product_id'] = $post->id;

        return response()->json($resdata);
    }

    public function postCategorysearch()
    {
        $data = PostCategory::where('status', 1)->get();

        return response()->json($data);
    }
}
