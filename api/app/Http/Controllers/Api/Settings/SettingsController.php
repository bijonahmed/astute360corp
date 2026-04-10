<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
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

class SettingsController extends Controller
{

    public function settingrow()
    {


        $data = Setting::find(1);
        $data['qa_pages_meta_description'] = $data['q&a_pages_meta_description'];
        $data['qa_pages_meta_keywords']    = $data['q&a_pages_meta_keywords'];
        $response = [
            'data' => $data,
            'message' => 'success'
        ];

        return response()->json($response, 200);
    }


    public function upateSetting(Request $request)
    {
        $user = Auth::user();
        if ($user->hasRole('admin')) {

            $validator = Validator::make($request->all(), [
                'name'        => 'required',
                'email'       => 'required',
                'devliery_charge_inside_dhk'  => 'required',
                'devliery_charge_outside_dhk' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = [
                'name'        => $request->name ?? "",
                'email'       => $request->email ?? "",
                'address'     => $request->address ?? "",
                'whatsApp'    => $request->whatsApp ?? "",
                'description' => $request->description ?? "",
                'copyright'   => $request->copyright ?? "",
                'currency'    => $request->currency ?? "",
                'fblink'      => $request->fblink ?? "",
                'website'     => $request->website ?? "",
                'telegram'    => $request->telegram ?? "",

                // Convert empty to 0 for integer column
                'promotional_banner' => isset($request->promotional_banner) && $request->promotional_banner !== ''
                    ? (int)$request->promotional_banner
                    : 0,

                'devliery_charge_inside_dhk'  => $request->devliery_charge_inside_dhk ?? "",
                'devliery_charge_outside_dhk' => $request->devliery_charge_outside_dhk ?? "",
            ];

            Setting::where('id', 1)->update($data);

            return response()->json([
                'message' => 'Settings updated successfully',
            ]);
        } else {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to update settings',
            ], 403);
        }
    }
}
