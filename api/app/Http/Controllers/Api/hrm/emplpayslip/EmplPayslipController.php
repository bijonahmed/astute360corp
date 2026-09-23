<?php

namespace App\Http\Controllers\Api\hrm\emplpayslip;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Payslip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmplPayslipController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $empId = ! empty($user->emp_id) ? (int) $user->emp_id : null;

        if (! $empId) {
            return response()->json([
                'message' => 'Unauthorized: No employee profile linked to this account',
            ], 403);
        }

        $employee = Employee::with(['department:id,name', 'designation:id,name'])
            ->find($empId);

        if (! $employee) {
            return response()->json([
                'message' => 'Employee not found',
            ], 404);
        }

        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);

        $query = Payslip::query()
            ->where('employee_id', $empId)
            ->orderBy('selected_date', 'desc');

        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);
        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
            return [
                'id'            => $item->id,
                'employee_id'   => $item->employee_id,
                'selected_date' => $item->selected_date,
                'payslip'       => $item->payslip,
                'payslip_url'   => $item->payslip ? url($item->payslip) : '',
                'created_at'    => $item->created_at,
            ];
        });

        return response()->json([
            'employee' => [
                'id'               => $employee->id,
                'name'             => $employee->name,
                'employee_code'    => $employee->employee_code,
                'department_name'  => optional($employee->department)->name ?? '',
                'designation_name' => optional($employee->designation)->name ?? '',
            ],
            'data'           => $modifiedCollection,
            'current_page'   => $paginator->currentPage(),
            'total_pages'    => $paginator->lastPage(),
            'total_records'  => $paginator->total(),
        ], 200);
    }

    public function checkrow($id)
    {
        $user = Auth::user();
        $empId = ! empty($user->emp_id) ? (int) $user->emp_id : null;

        if (! $empId) {
            return response()->json([
                'message' => 'Unauthorized: No employee profile linked to this account',
            ], 403);
        }

        $payslip = Payslip::with([
            'employee:id,name,employee_code,department_id,designation_id',
            'employee.department:id,name',
            'employee.designation:id,name',
        ])->find($id);

        if (! $payslip || (int) $payslip->employee_id !== $empId) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }

        $responseData['data'] = $payslip;
        $responseData['data']->payslip_url = $payslip->payslip ? url($payslip->payslip) : '';

        return response()->json($responseData);
    }

    public function stream($id)
    {
        $user = Auth::user();
        $empId = ! empty($user->emp_id) ? (int) $user->emp_id : null;

        if (! $empId) {
            return response()->json([
                'message' => 'Unauthorized: No employee profile linked to this account',
            ], 403);
        }

        $payslip = Payslip::find($id);
        if (! $payslip || (int) $payslip->employee_id !== $empId || empty($payslip->payslip)) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }

        $path = public_path($payslip->payslip);
        if (! file_exists($path)) {
            return response()->json([
                'message' => 'File not found',
            ], 404);
        }

        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $mimeMap = [
            'pdf'  => 'application/pdf',
            'jpg'  => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png'  => 'image/png',
            'gif'  => 'image/gif',
            'webp' => 'image/webp',
            'bmp'  => 'image/bmp',
            'svg'  => 'image/svg+xml',
        ];
        $mime = $mimeMap[$ext] ?? 'application/octet-stream';
        $filename = basename($path);

        $response = response()->file($path, [
            'Content-Type' => $mime,
            'Content-Disposition' => 'inline; filename="' . $filename . '"',
            'Access-Control-Allow-Origin' => '*',
            'Cache-Control' => 'private, max-age=3600',
        ]);

        $response->headers->remove('X-Frame-Options');
        $response->headers->set('Content-Type', $mime);
        $response->headers->set('Content-Disposition', 'inline; filename="' . $filename . '"');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        return $response;
    }
}
