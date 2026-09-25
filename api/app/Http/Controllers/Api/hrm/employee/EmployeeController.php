<?php

namespace App\Http\Controllers\Api\hrm\employee;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Validator;

class EmployeeController extends Controller
{
    private $fillableFields = [
        'employee_code',
        'name',
        'father_name',
        'mother_name',
        'date_of_birth',
        'age',
        'gender',
        'marital_status',
        'blood_group',
        'mobile',
        'alternative_mobile',
        'email',
        'present_address',
        'permanent_address',
        'emergency_contact_name',
        'emergency_contact_mobile',
        'emergency_contact_relation',
        'project_id',
        'department_id',
        'designation_id',
        'joining_date',
        'employment_type',
        'employee_status',
        'reporting_to',
        'work_location',
        'shift',
        'basic_salary',
        'gross_salary',
        'nid_number',
        'passport_number',
        'passport_expiry_date',
        'birth_certificate_number',
        'driving_license_number',
        'bank_name',
        'bank_account_name',
        'bank_account_number',
        'branch_name',
        'routing_number',
        'payment_method',
        'highest_education',
        'institution_name',
        'passing_year',
        'username',
        'status',
        'remarks',
    ];

    public function index(Request $request)
    {
        $user = Auth::user();
        // if (! $user->can('view employee')) {
        //     return response()->json([
        //         'message' => 'Unauthorized: You do not have permission to view employee',
        //     ], 403);
        // }

        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);
        $searchQuery = $request->input('searchQuery');
        $selectedFilter = $request->input('selectedFilter');
        $employeeStatus = $request->input('employeeStatus');
        $projectId = $request->input('projectId');
        $departmentId = $request->input('departmentId');
        $designationId = $request->input('designationId');

        $query = Employee::query()
            ->leftJoin('project', 'project.id', '=', 'employee.project_id')
            ->leftJoin('department', 'department.id', '=', 'employee.department_id')
            ->leftJoin('designation', 'designation.id', '=', 'employee.designation_id')
            ->select(
                'employee.*',
                'project.name as project_name',
                'department.name as department_name',
                'designation.name as designation_name'
            )
            ->orderBy('employee.id', 'desc');

        if ($searchQuery !== null && $searchQuery !== '') {
            $query->where(function ($q) use ($searchQuery) {
                $q->where('employee.name', 'like', '%' . $searchQuery . '%')
                    ->orWhere('employee.employee_code', 'like', '%' . $searchQuery . '%')
                    ->orWhere('employee.mobile', 'like', '%' . $searchQuery . '%');
            });
        }
        if ($selectedFilter !== null && $selectedFilter !== '') {
            $query->where('employee.status', (int) $selectedFilter);
        }
        if ($employeeStatus !== null && $employeeStatus !== '') {
            $query->where('employee.employee_status', $employeeStatus);
        }
        if ($projectId !== null && $projectId !== '') {
            $query->where('employee.project_id', (int) $projectId);
        }
        if ($departmentId !== null && $departmentId !== '') {
            $query->where('employee.department_id', (int) $departmentId);
        }
        if ($designationId !== null && $designationId !== '') {
            $query->where('employee.designation_id', (int) $designationId);
        }

        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);
        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
            $status = $item->status == 1 ? 'Active' : 'Inactive';
            return [
                'id'               => $item->id,
                'employee_code'    => $item->employee_code,
                'name'             => $item->name,
                'mobile'           => $item->mobile,
                'email'            => $item->email,
                'photo'            => $item->photo ? url($item->photo) : '',
                'project_id'       => $item->project_id,
                'project_name'     => $item->project_name ?? '',
                'department_id'    => $item->department_id,
                'department_name'  => $item->department_name ?? '',
                'designation_id'   => $item->designation_id,
                'designation_name' => $item->designation_name ?? '',
                'joining_date'     => $item->joining_date,
                'employee_status'  => $item->employee_status,
                'status'           => $status,
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
        // if (! $user->can('create employee')) {
        //     return response()->json([
        //         'message' => 'Unauthorized: You do not have permission to create employee',
        //     ], 403);
        // }

        $validator = Validator::make($request->all(), [
            'name'     => 'required',
            'mobile'   => 'required',
            'email'    => ['required', 'email', Rule::unique('users', 'email')],
            'password' => 'required|string|min:6',
            'photo'    => 'nullable|image|mimes:jpeg,png,jpg,gif',
        ], [
            'email.required' => 'Email is required.',
            'email.email'    => 'Please provide a valid email address.',
            'email.unique'   => 'This email is already registered.',
            'password.required' => 'Password is required to create user login.',
            'password.min'   => 'Password must be at least 6 characters.',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $this->prepareData($request);

        if ($request->hasFile('photo')) {
            $data['photo'] = $this->uploadPhoto($request, $request->name);
        }

        $data['password'] = Hash::make($request->password);

        $employeeId = Employee::insertGetId($data);

        $newUser = User::create([
            'emp_id'       => $employeeId,
            'name'         => $data['name'],
            'email'        => $data['email'],
            'phone_number' => $data['mobile'] ?? null,
            'password'     => Hash::make($request->password),
            'status'       => (int) ($data['status'] ?? 1),
            'role_type'    => 2,
        ]);
        $newUser->syncRoles([2]);

        return response()->json($employeeId);
    }

    public function checkrow($id)
    {
        $employee = Employee::with(['project:id,name', 'department:id,name', 'designation:id,name'])
            ->where('id', $id)
            ->first();

        $responseData['data'] = $employee;
        if ($employee) {
            $responseData['data']->photo_url = $employee->photo ? url($employee->photo) : '';
        }

        return response()->json($responseData);
    }

    public function destroy($id)
    {
        $user = Auth::user();

        if (! $user->can('delete employee')) {
            return response()->json([
                'message' => 'Unauthorized: You do not have permission to delete',
            ], 403);
        }

        $employee = Employee::find($id);
        if (! $employee) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }

        if (! empty($employee->photo) && file_exists(public_path($employee->photo))) {
            unlink(public_path($employee->photo));
        }

        $employee->delete();

        return response()->json([
            'message' => 'Deleted successfully',
            'id' => $id,
        ], 200);
    }

    public function update(Request $request)
    {
        // $user = Auth::user();
        // if (! $user->can('edit employee')) {
        //     return response()->json([
        //         'message' => 'Unauthorized: You do not have permission to edit employee',
        //     ], 403);
        // }

        $employee = Employee::find($request->id);
        if (! $employee) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }

        $existingUser = User::where('email', $employee->email)->first()
            ?: User::where('email', $request->email)->first();

        $validator = Validator::make($request->all(), [
            'name'     => 'required',
            'mobile'   => 'required',
            'email'    => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($existingUser?->id),
            ],
            'password' => 'nullable|string|min:6',
            'photo'    => 'nullable|image|mimes:jpeg,png,jpg,gif',
        ], [
            'email.required' => 'Email is required.',
            'email.email'    => 'Please provide a valid email address.',
            'email.unique'   => 'This email is already registered.',
            'password.min'   => 'Password must be at least 6 characters.',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $this->prepareData($request);

        if ($request->hasFile('photo')) {
            if (! empty($employee->photo) && file_exists(public_path($employee->photo))) {
                unlink(public_path($employee->photo));
            }
            $data['photo'] = $this->uploadPhoto($request, $request->name);
        } else {
            unset($data['photo']);
        }

        if (! empty($request->password)) {
            $data['password'] = Hash::make($request->password);
        } else {
            unset($data['password']);
        }

        $employee->update($data);

        $userData = [
            'emp_id'       => $employee->id,
            'name'         => $data['name'] ?? $employee->name,
            'email'        => $data['email'] ?? $employee->email,
            'phone_number' => $data['mobile'] ?? $employee->mobile,
            'status'       => (int) ($data['status'] ?? $employee->status ?? 1),
            'role_type'    => 2,
        ];
        if (! empty($request->password)) {
            $userData['password'] = Hash::make($request->password);
        }

        if ($existingUser) {
            $existingUser->update($userData);
            $linkedUser = $existingUser;
        } else {
            $linkedUser = User::create($userData + ['password' => Hash::make($request->password ?? Str::random(12))]);
        }
        $linkedUser->syncRoles([2]);
        

        $resdata['id'] = $employee->id;

        return response()->json($resdata);
    }

    private function prepareData(Request $request): array
    {
        $data = [];
        foreach ($this->fillableFields as $field) {
            $value = $request->input($field);
            if ($value === '' || $value === null) {
                if ($field === 'status') {
                    $data[$field] = 1;
                } else {
                    $data[$field] = null;
                }
                continue;
            }
            $data[$field] = $value;
        }

        if (! empty($data['date_of_birth'])) {
            $data['age'] = \Carbon\Carbon::parse($data['date_of_birth'])->age;
        } elseif (isset($data['age'])) {
            $data['age'] = (int) $data['age'];
        }

        if (isset($data['status'])) {
            $data['status'] = (int) $data['status'];
        }

        foreach (['project_id', 'department_id', 'designation_id'] as $fk) {
            if (isset($data[$fk])) {
                $data[$fk] = (int) $data[$fk];
            }
        }

        return $data;
    }

    private function uploadPhoto(Request $request, string $name): string
    {
        $file = $request->file('photo');
        $filename = time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('uploads/employees'), $filename);

        return 'uploads/employees/' . $filename;
    }
}
