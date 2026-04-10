<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Setting;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        //dd($request->all());
        $validator = Validator::make($request->all(), [
            'name'          => 'required|max:100',
            'email'         => 'required|email|unique:users,email',
            'phone_number'  => 'required|max:20|unique:users,phone_number',
            'password'      => 'required|string|min:6|confirmed', // uses password_confirmation
        ], [
            // Custom error messages
            'name.required'          => 'Full name is required.',
            'email.required'         => 'Email address is required.',
            'email.email'            => 'Please provide a valid email address.',
            'email.unique'           => 'This email is already registered.',
            'phone_number.required'  => 'Phone number is required.',
            'phone_number.unique'    => 'This phone number is already in use.',
            'password.required'      => 'Password is required.',
            'password.min'           => 'Password must be at least 6 characters.',
            'password.confirmed'     => 'Passwords do not match.',
        ]);
        // If validation fails
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }
        // Create user
        $user = User::create([
            'name'         => $request->name,
            'email'        => $request->email,
            'phone_number' => $request->phone_number,
            'role_type'    => 4,
            'password' => Hash::make($request->password),
        ]);
        return response()->json([
            'success' => true,
            'message' => 'User created successfully.',
            'user' => $user,
        ], 201);
    }
    public function login(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');
            if (!$token = auth()->attempt($credentials)) {
                return response()->json(['error' => 'Invalid Credentials'], 401);
            }
            $user = Auth::user();
            // if (!empty($user->role_type)) {
            //     return response()->json(['error' => 'Access denied for this role.'], 403);
            // }
            return response()->json([
                'token' => $token,
                'user' => $user,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
    public function profile()
    {
        $user = Auth::user();
        return response()->json([
            'user' => $user,
            'roles' => $user->getRoleNames(),   // Spatie Roles
            'permissions' => $user->getAllPermissions()->pluck('name'),  // Spatie Permissions
        ]);
    }

    public function updateCustomerProfile(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name'          => 'required',
            'email'         => 'required',
            'phone_number'  => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = [
            'name'           => ! empty($request->name) ? $request->name : '',
            'email'          => ! empty($request->email) ? $request->email : '',
            'phone_number'   => ! empty($request->phone_number) ? $request->phone_number : '',
            'address'        => ! empty($request->address) ? $request->address : '',
            'website'        => ! empty($request->website) ? $request->website : '',
            'github'         => ! empty($request->github) ? $request->github : '',
            'twitter'        => ! empty($request->twitter) ? $request->twitter : '',
            'instagram'      => ! empty($request->instagram) ? $request->instagram : '',
            'facebook'       => ! empty($request->facebook) ? $request->facebook : '',
        ];
        User::where('id', $request->id)->update($data);
        $response = [
            'imagelink' => ! empty($user) ? url($user->image) : '',
            'message' => 'User successfully update',
        ];
        return response()->json($response);
    }



    public function updateProfile(Request $request)
    {
        // dd($request->all());
        $user = Auth::user();
        $authId = $user->id;
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required',
            'phone_number' => 'required',
            'address' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = [
            'id'             => $authId,
            'name'           => ! empty($request->name) ? $request->name : '',
            'email'          => ! empty($request->email) ? $request->email : '',
            'phone_number'   => ! empty($request->phone_number) ? $request->phone_number : '',
            'address'        => ! empty($request->address) ? $request->address : '',
            'website'        => ! empty($request->website) ? $request->website : '',
            'github'         => ! empty($request->github) ? $request->github : '',
            'twitter'        => ! empty($request->twitter) ? $request->twitter : '',
            'instagram'      => ! empty($request->instagram) ? $request->instagram : '',
            'facebook'       => ! empty($request->facebook) ? $request->facebook : '',
        ];
        if (! empty($request->file('file'))) {
            $documents = $request->file('file');
            $fileName = Str::random(20);
            $ext = strtolower($documents->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/files/';
            $upload_url = $uploadPath . $path;
            $documents->move(public_path('/backend/files/'), $upload_url);
            $data['image'] = $upload_url;
        }
        // dd($data);
        User::where('id', $authId)->update($data);
        $response = [
            'imagelink' => ! empty($user) ? url($user->image) : '',
            'message' => 'User successfully update',
        ];
        return response()->json($response);
    }

    public function customerChangePassword(Request $request)
    {
        $user = Auth::user(); // Logged-in user

        // Validate request
        $validator = Validator::make($request->all(), [
            'currentPassword' => 'required',
            'newPassword' => 'required|min:6|confirmed',
            // expects: newPassword_confirmation
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if current password is correct
        if (!Hash::check($request->currentPassword, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Current password is incorrect'
            ], 400);
        }

        // Update password
        $user->password = Hash::make($request->newPassword);
        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'Password updated successfully'
        ]);
    }
}
