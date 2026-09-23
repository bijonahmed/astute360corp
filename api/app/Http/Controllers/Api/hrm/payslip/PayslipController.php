<?php

namespace App\Http\Controllers\Api\hrm\payslip;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Payslip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Validator;

class PayslipController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('view payslip')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view payslip',
            ], 403);
        }

        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);
        $searchQuery = $request->input('searchQuery');
        $employeeCode = $request->input('employeeCode');
        $date = $request->input('date');
        $departmentId = $request->input('departmentId');
        $designationId = $request->input('designationId');
        $employeeId = $request->input('employeeId');

        $query = Payslip::query()
            ->join('employee', 'employee.id', '=', 'payslip.employee_id')
            ->leftJoin('department', 'department.id', '=', 'employee.department_id')
            ->leftJoin('designation', 'designation.id', '=', 'employee.designation_id')
            ->select(
                'payslip.*',
                'employee.name as employee_name',
                'employee.employee_code',
                'department.name as department_name',
                'designation.name as designation_name'
            )
            ->orderBy('payslip.id', 'desc');

        if ($searchQuery !== null && $searchQuery !== '') {
            $query->where('employee.name', 'like', '%' . $searchQuery . '%');
        }
        if ($employeeCode !== null && $employeeCode !== '') {
            $query->where('employee.employee_code', 'like', '%' . $employeeCode . '%');
        }
        if ($date !== null && $date !== '') {
            $query->whereDate('payslip.selected_date', $date);
        }
        if ($departmentId !== null && $departmentId !== '') {
            $query->where('employee.department_id', (int) $departmentId);
        }
        if ($designationId !== null && $designationId !== '') {
            $query->where('employee.designation_id', (int) $designationId);
        }
        if ($employeeId !== null && $employeeId !== '') {
            $query->where('payslip.employee_id', (int) $employeeId);
        }

        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);
        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
            return [
                'id'                => $item->id,
                'employee_id'       => $item->employee_id,
                'selected_date'     => $item->selected_date,
                'payslip'           => $item->payslip,
                'payslip_url'       => $item->payslip ? url($item->payslip) : '',
                'employee_name'     => $item->employee_name ?? '',
                'employee_code'     => $item->employee_code ?? '',
                'department_name'   => $item->department_name ?? '',
                'designation_name'  => $item->designation_name ?? '',
                'created_at'        => $item->created_at,
            ];
        });

        return response()->json([
            'data'           => $modifiedCollection,
            'current_page'   => $paginator->currentPage(),
            'total_pages'    => $paginator->lastPage(),
            'total_records'  => $paginator->total(),
        ], 200);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('create payslip')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to create payslip',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'selected_date' => 'required|date',
            'employee_id'   => 'required|integer|exists:employee,id',
            'payslip'       => 'required|file|mimes:pdf,jpg,jpeg,png,gif,webp,bmp,svg|max:512000',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $exists = Payslip::where('employee_id', $request->employee_id)
            ->whereDate('selected_date', $request->selected_date)
            ->first();
        if ($exists) {
            return response()->json([
                'errors' => [
                    'selected_date' => ['A payslip already exists for this employee on the selected date.'],
                ],
            ], 422);
        }

        $data = [
            'employee_id'   => (int) $request->employee_id,
            'selected_date' => $request->selected_date,
            'payslip'       => $this->uploadPayslip($request),
        ];

        $id = Payslip::insertGetId($data);
        return response()->json(['id' => $id]);
    }

    public function checkrow($id)
    {
        $payslip = Payslip::with(['employee:id,name,employee_code,department_id,designation_id'])
            ->where('id', $id)
            ->first();

        $responseData['data'] = $payslip;
        if ($payslip) {
            $responseData['data']->payslip_url = $payslip->payslip ? url($payslip->payslip) : '';
        }

        return response()->json($responseData);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        if (! $user->can('delete payslip')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to delete payslip',
            ], 403);
        }

        $payslip = Payslip::find($id);
        if (! $payslip) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }

        if (! empty($payslip->payslip) && file_exists(public_path($payslip->payslip))) {
            unlink(public_path($payslip->payslip));
        }

        $payslip->delete();

        return response()->json([
            'message' => 'Deleted successfully',
            'id' => $id,
        ], 200);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        if (! $user->can('edit payslip')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to edit payslip',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'id'            => 'required|integer|exists:payslip,id',
            'selected_date' => 'required|date',
            'employee_id'   => 'required|integer|exists:employee,id',
            'payslip'       => 'nullable|file|mimes:pdf,jpg,jpeg,png,gif,webp,bmp,svg|max:512000',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $exists = Payslip::where('employee_id', $request->employee_id)
            ->whereDate('selected_date', $request->selected_date)
            ->where('id', '!=', $request->id)
            ->first();
        if ($exists) {
            return response()->json([
                'errors' => [
                    'selected_date' => ['A payslip already exists for this employee on the selected date.'],
                ],
            ], 422);
        }

        $payslip = Payslip::find($request->id);
        if (! $payslip) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }

        $data = [
            'employee_id'   => (int) $request->employee_id,
            'selected_date' => $request->selected_date,
        ];

        if ($request->hasFile('payslip')) {
            if (! empty($payslip->payslip) && file_exists(public_path($payslip->payslip))) {
                unlink(public_path($payslip->payslip));
            }
            $data['payslip'] = $this->uploadPayslip($request);
        }

        $payslip->update($data);

        return response()->json(['id' => $payslip->id]);
    }

    public function employeePayslips(Request $request, $employeeId)
    {
        $user = Auth::user();
        if (! $user->can('view payslip')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to view payslip',
            ], 403);
        }

        $employee = Employee::with(['department:id,name', 'designation:id,name'])
            ->find($employeeId);

        if (! $employee) {
            return response()->json([
                'message' => 'Employee not found',
            ], 404);
        }

        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);

        $query = Payslip::query()
            ->where('employee_id', $employeeId)
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
            'employee'       => [
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

    public function stream($id)
    {
        $payslip = Payslip::find($id);
        if (! $payslip || empty($payslip->payslip)) {
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

    private function uploadPayslip(Request $request): string
    {
        $file = $request->file('payslip');
        $employeeId = (int) $request->employee_id;
        $directory = public_path('uploads/payslips/' . $employeeId);

        if (! file_exists($directory)) {
            mkdir($directory, 0755, true);
        }

        $filename = time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
        $file->move($directory, $filename);

        return 'uploads/payslips/' . $employeeId . '/' . $filename;
    }
}
