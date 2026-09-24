<?php

namespace App\Http\Controllers\Api\hrm\worksubmit;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Project;
use App\Models\WorkSubmit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;

class WorkSubmitController extends Controller
{
    public function projects()
    {
        $auth = $this->resolveEmployee();
        if (isset($auth['error'])) {
            return $auth['error'];
        }
        $employee = $auth['employee'];
        $empId = (int) $employee->id;

        $submittedProjectIds = WorkSubmit::where('employee_id', $empId)
            ->pluck('project_id')
            ->unique()
            ->values();

        $projects = Project::query()
            ->where(function ($query) use ($employee, $submittedProjectIds) {
                $query->where('status', 1);

                if ($submittedProjectIds->isNotEmpty()) {
                    $query->orWhereIn('id', $submittedProjectIds);
                }

                if (! empty($employee->project_id)) {
                    $query->orWhere('id', (int) $employee->project_id);
                }
            })
            ->orderBy('name')
            ->get(['id', 'name', 'status']);

        $modifiedCollection = $projects->map(function ($item) {
            return [
                'id'     => $item->id,
                'name'   => $item->name,
                'status' => $item->status == 1 ? 'Active' : 'Inactive',
            ];
        });

        return response()->json([
            'employee' => $this->employeePayload($employee),
            'data'     => $modifiedCollection,
        ], 200);
    }

    public function index(Request $request)
    {
        $auth = $this->resolveEmployee();
        if (isset($auth['error'])) {
            return $auth['error'];
        }
        $employee = $auth['employee'];
        $empId = (int) $employee->id;

        $month = $request->input('month', date('Y-m'));
        $validator = Validator::make(['month' => $month], [
            'month' => 'required|date_format:Y-m',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 50);
        $statusFilter = $request->input('status');
        [$startDate, $endDate] = $this->monthRange($month);

        $query = WorkSubmit::query()
            ->with('project:id,name')
            ->where('employee_id', $empId)
           // ->whereBetween('work_date', [$startDate, $endDate])
            ->orderBy('work_date', 'asc')
            ->orderBy('id', 'asc');

        if ($statusFilter !== null && $statusFilter !== '' && in_array((int) $statusFilter, [0, 1, 2], true)) {
            $query->where('status', (int) $statusFilter);
        }

        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);
        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
            return [
                'id'           => $item->id,
                'employee_id'  => $item->employee_id,
                'project_id'   => $item->project_id,
                'project_name' => optional($item->project)->name ?? '',
                'work_date'    => $item->work_date,
                'hours'        => (float) $item->hours,
                'status'       => (int) $item->status,
                'status_label' => $this->statusLabel((int) $item->status),
                'created_at'   => $item->created_at,
            ];
        });

        return response()->json([
            'employee'      => $this->employeePayload($employee),
            'month'         => $month,
            'data'          => $modifiedCollection,
            'summary'       => $this->buildSummary($empId, $startDate, $endDate),
            'current_page'  => $paginator->currentPage(),
            'total_pages'   => $paginator->lastPage(),
            'total_records' => $paginator->total(),
        ], 200);
    }

    public function byDate(Request $request)
    {
        $auth = $this->resolveEmployee();
        if (isset($auth['error'])) {
            return $auth['error'];
        }
        $employee = $auth['employee'];
        $empId = (int) $employee->id;

        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $entries = WorkSubmit::with('project:id,name')
            ->where('employee_id', $empId)
            ->whereDate('work_date', $request->date)
            ->orderBy('id', 'asc')
            ->get()
            ->map(function ($item) {
                return $this->entryPayload($item);
            });

        return response()->json([
            'date'        => $request->date,
            'total_hours' => round((float) $entries->sum('hours'), 2),
            'data'        => $entries,
        ], 200);
    }

    public function store(Request $request)
    {
        $auth = $this->resolveEmployee();
        if (isset($auth['error'])) {
            return $auth['error'];
        }
        $employee = $auth['employee'];
        $empId = (int) $employee->id;

        $validator = Validator::make($request->all(), [
            'project_id' => 'required|integer|exists:project,id',
            'work_date'  => 'required|date',
            'hours'      => 'required|numeric|min:1|max:24',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $exists = WorkSubmit::where('employee_id', $empId)
            ->where('project_id', (int) $request->project_id)
            ->whereDate('work_date', $request->work_date)
            ->first();
        if ($exists) {
            return response()->json([
                'errors' => [
                    'work_date' => ['Work hours already submitted for this project on the selected date.'],
                ],
            ], 422);
        }

        $data = [
            'employee_id' => $empId,
            'project_id'  => (int) $request->project_id,
            'work_date'   => $request->work_date,
            'hours'       => (float) $request->hours,
            'status'      => 0,
        ];

        $id = WorkSubmit::insertGetId($data);

        return response()->json(['id' => $id]);
    }

    public function checkrow($id)
    {
        $auth = $this->resolveEmployee();
        if (isset($auth['error'])) {
            return $auth['error'];
        }
        $empId = (int) $auth['employee']->id;

        $workSubmit = WorkSubmit::with('project:id,name')->find($id);
        if (! $workSubmit || (int) $workSubmit->employee_id !== $empId) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }

        $responseData['data'] = $this->entryPayload($workSubmit);

        return response()->json($responseData);
    }

    public function destroy($id)
    {
        $auth = $this->resolveEmployee();
        if (isset($auth['error'])) {
            return $auth['error'];
        }
        $empId = (int) $auth['employee']->id;

        $workSubmit = WorkSubmit::find($id);
        if (! $workSubmit || (int) $workSubmit->employee_id !== $empId) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }

        if ((int) $workSubmit->status !== 0) {
            return response()->json([
                'message' => 'Only pending entries can be deleted',
            ], 422);
        }

        $workSubmit->delete();

        return response()->json([
            'message' => 'Deleted successfully',
            'id'      => $id,
        ], 200);
    }

    public function update(Request $request)
    {
        $auth = $this->resolveEmployee();
        if (isset($auth['error'])) {
            return $auth['error'];
        }
        $employee = $auth['employee'];
        $empId = (int) $employee->id;

        $validator = Validator::make($request->all(), [
            'id'         => 'required|integer|exists:worksubmit,id',
            'project_id' => 'required|integer|exists:project,id',
            'work_date'  => 'required|date',
            'hours'      => 'required|numeric|min:1|max:24',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $workSubmit = WorkSubmit::find($request->id);
        if (! $workSubmit || (int) $workSubmit->employee_id !== $empId) {
            return response()->json([
                'message' => 'Data not found',
            ], 404);
        }

        if ((int) $workSubmit->status !== 0) {
            return response()->json([
                'message' => 'Only pending entries can be edited',
            ], 422);
        }

        $exists = WorkSubmit::where('employee_id', $empId)
            ->where('project_id', (int) $request->project_id)
            ->whereDate('work_date', $request->work_date)
            ->where('id', '!=', $workSubmit->id)
            ->first();
        if ($exists) {
            return response()->json([
                'errors' => [
                    'work_date' => ['Work hours already submitted for this project on the selected date.'],
                ],
            ], 422);
        }

        $data = [
            'project_id' => (int) $request->project_id,
            'work_date'  => $request->work_date,
            'hours'      => (float) $request->hours,
        ];

        $workSubmit->update($data);

        return response()->json(['id' => $workSubmit->id]);
    }

    public function monthlyTotals(Request $request)
    {
        $auth = $this->resolveEmployee();
        if (isset($auth['error'])) {
            return $auth['error'];
        }
        $empId = (int) $auth['employee']->id;

        $month = $request->input('month', date('Y-m'));
        $validator = Validator::make(['month' => $month], [
            'month' => 'required|date_format:Y-m',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        [$startDate, $endDate] = $this->monthRange($month);

        return response()->json(array_merge(
            ['month' => $month],
            $this->buildSummary($empId, $startDate, $endDate)
        ), 200);
    }

    public function months()
    {
        $auth = $this->resolveEmployee();
        if (isset($auth['error'])) {
            return $auth['error'];
        }
        $empId = (int) $auth['employee']->id;

        $rows = WorkSubmit::where('employee_id', $empId)
            ->selectRaw("DATE_FORMAT(work_date, '%Y-%m') as ym, SUM(hours) as total_hours, COUNT(*) as entries")
            ->groupBy('ym')
            ->orderBy('ym', 'desc')
            ->get();

        return response()->json([
            'data' => $rows->map(function ($row) {
                return [
                    'month'      => $row->ym,
                    'label'      => date('M-y', strtotime($row->ym . '-01')),
                    'total_hours' => round((float) $row->total_hours, 2),
                    'entries'    => (int) $row->entries,
                ];
            }),
        ], 200);
    }

    public function bulkUpdate(Request $request)
    {
        $auth = $this->resolveEmployee();
        if (isset($auth['error'])) {
            return $auth['error'];
        }
        $empId = (int) $auth['employee']->id;

        $validator = Validator::make($request->all(), [
            'updates'                    => 'nullable|array',
            'updates.*.id'               => 'required|integer|exists:worksubmit,id',
            'updates.*.hours'            => 'required|numeric|min:0|max:24',
            'creates'                    => 'nullable|array',
            'creates.*.work_date'        => 'required|date',
            'creates.*.project_id'       => 'required|integer|exists:project,id',
            'creates.*.hours'            => 'required|numeric|min:1|max:24',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $updated = 0;
        foreach ($request->input('updates', []) as $row) {
            $workSubmit = WorkSubmit::find($row['id']);
            if (! $workSubmit || (int) $workSubmit->employee_id !== $empId) {
                continue;
            }
            if ((int) $workSubmit->status !== 0) {
                continue;
            }
            $workSubmit->hours = (float) $row['hours'];
            $workSubmit->save();
            $updated++;
        }

        $created = 0;
        foreach ($request->input('creates', []) as $row) {
            $exists = WorkSubmit::where('employee_id', $empId)
                ->where('project_id', (int) $row['project_id'])
                ->whereDate('work_date', $row['work_date'])
                ->first();
            if ($exists) {
                if ((int) $exists->status === 0) {
                    $exists->hours = (float) $row['hours'];
                    $exists->save();
                    $updated++;
                }
                continue;
            }
            WorkSubmit::insertGetId([
                'employee_id' => $empId,
                'project_id'  => (int) $row['project_id'],
                'work_date'   => $row['work_date'],
                'hours'       => (float) $row['hours'],
                'status'      => 0,
            ]);
            $created++;
        }

        return response()->json([
            'message' => 'Timesheet saved successfully',
            'updated' => $updated,
            'created' => $created,
        ], 200);
    }

    public function adminBulkUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id'          => 'required|integer|exists:employee,id',
            'updates'              => 'nullable|array',
            'updates.*.id'         => 'required|integer|exists:worksubmit,id',
            'updates.*.hours'      => 'required|numeric|min:0',
            'updates.*.status'     => 'nullable|integer|in:0,1,2',
            'creates'              => 'nullable|array',
            'creates.*.work_date'  => 'required|date',
            'creates.*.project_id' => 'required|integer|exists:project,id',
            'creates.*.hours'      => 'required|numeric|min:0',
            'creates.*.status'     => 'nullable|integer|in:0,1,2',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $empId = (int) $request->input('employee_id');

        $updated = 0;
        foreach ($request->input('updates', []) as $row) {
            $workSubmit = WorkSubmit::find($row['id']);
            if (! $workSubmit || (int) $workSubmit->employee_id !== $empId) {
                continue;
            }
            $workSubmit->hours = (float) $row['hours'];
            if (array_key_exists('status', $row) && $row['status'] !== null && $row['status'] !== '') {
                $workSubmit->status = (int) $row['status'];
            }
            $workSubmit->save();
            $updated++;
        }

        $created = 0;
        foreach ($request->input('creates', []) as $row) {
            $exists = WorkSubmit::where('employee_id', $empId)
                ->where('project_id', (int) $row['project_id'])
                ->whereDate('work_date', $row['work_date'])
                ->first();
            $status = isset($row['status']) && $row['status'] !== null && $row['status'] !== ''
                ? (int) $row['status']
                : 0;
            if ($exists) {
                $exists->hours = (float) $row['hours'];
                $exists->status = $status;
                $exists->save();
                $updated++;
                continue;
            }
            WorkSubmit::insertGetId([
                'employee_id' => $empId,
                'project_id'  => (int) $row['project_id'],
                'work_date'   => $row['work_date'],
                'hours'       => (float) $row['hours'],
                'status'      => $status,
            ]);
            $created++;
        }

        return response()->json([
            'message' => 'Timesheet saved successfully',
            'updated' => $updated,
            'created' => $created,
        ], 200);
    }

    public function adminEmployees()
    {
        $employees = Employee::where('status', 1)
            ->orderBy('name')
            ->get(['id', 'name', 'employee_code']);

        return response()->json([
            'data' => $employees,
        ], 200);
    }

    public function adminProjects()
    {
        $projects = Project::where('status', 1)
            ->orderBy('name')
            ->get(['id', 'name', 'status']);

        return response()->json([
            'data' => $projects->map(function ($item) {
                return [
                    'id'     => $item->id,
                    'name'   => $item->name,
                    'status' => $item->status == 1 ? 'Active' : 'Inactive',
                ];
            }),
        ], 200);
    }

    public function adminIndex(Request $request)
    {
        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);
        $searchQuery = $request->input('searchQuery');
        $employeeId = $request->input('employeeId');
        $projectId = $request->input('projectId');
        $month = $request->input('month');
        $statusFilter = $request->input('status', '0');

        $query = WorkSubmit::query()
            ->with(['project:id,name', 'employee:id,name,employee_code,department_id,designation_id'])
            ->join('employee', 'employee.id', '=', 'worksubmit.employee_id')
            ->leftJoin('department', 'department.id', '=', 'employee.department_id')
            ->leftJoin('designation', 'designation.id', '=', 'employee.designation_id')
            ->select(
                'worksubmit.*',
                'employee.name as employee_name',
                'employee.employee_code',
                'department.name as department_name',
                'designation.name as designation_name'
            )
            ->orderBy('worksubmit.work_date', 'desc')
            ->orderBy('worksubmit.id', 'desc');

        if ($searchQuery !== null && $searchQuery !== '') {
            $query->where(function ($q) use ($searchQuery) {
                $q->where('employee.name', 'like', '%' . $searchQuery . '%')
                    ->orWhere('employee.employee_code', 'like', '%' . $searchQuery . '%');
            });
        }
        if ($employeeId !== null && $employeeId !== '') {
            $query->where('worksubmit.employee_id', (int) $employeeId);
        }
        if ($projectId !== null && $projectId !== '') {
            $query->where('worksubmit.project_id', (int) $projectId);
        }
        if ($month !== null && $month !== '') {
            [$startDate, $endDate] = $this->monthRange($month);
            $query->whereBetween('worksubmit.work_date', [$startDate, $endDate]);
        }
        if ($statusFilter !== null && $statusFilter !== '' && in_array((int) $statusFilter, [0, 1, 2], true)) {
            $query->where('worksubmit.status', (int) $statusFilter);
        }

        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);
        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
            return [
                'id'               => $item->id,
                'employee_id'      => $item->employee_id,
                'employee_name'    => $item->employee_name ?? '',
                'employee_code'    => $item->employee_code ?? '',
                'department_name'  => $item->department_name ?? '',
                'designation_name' => $item->designation_name ?? '',
                'project_id'       => $item->project_id,
                'project_name'     => optional($item->project)->name ?? '',
                'work_date'        => $item->work_date,
                'hours'            => (float) $item->hours,
                'status'           => (int) $item->status,
                'status_label'     => $this->statusLabel((int) $item->status),
                'created_at'       => $item->created_at,
            ];
        });

        return response()->json([
            'data'          => $modifiedCollection,
            'current_page'  => $paginator->currentPage(),
            'total_pages'   => $paginator->lastPage(),
            'total_records' => $paginator->total(),
            'status_counts' => $this->adminStatusCounts(),
        ], 200);
    }

    public function adminStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|integer|exists:employee,id',
            'project_id'  => 'required|integer|exists:project,id',
            'work_date'   => 'required|date',
            'hours'       => 'required|numeric|min:1|max:24',
            'status'      => 'nullable|integer|in:0,1,2',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $empId = (int) $request->employee_id;
        $exists = WorkSubmit::where('employee_id', $empId)
            ->where('project_id', (int) $request->project_id)
            ->whereDate('work_date', $request->work_date)
            ->first();
        if ($exists) {
            return response()->json([
                'errors' => [
                    'work_date' => ['Work hours already submitted for this project on the selected date.'],
                ],
            ], 422);
        }

        $id = WorkSubmit::insertGetId([
            'employee_id' => $empId,
            'project_id'  => (int) $request->project_id,
            'work_date'   => $request->work_date,
            'hours'       => (float) $request->hours,
            'status'      => $request->filled('status') ? (int) $request->status : 0,
        ]);

        return response()->json(['id' => $id]);
    }

    public function adminUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id'         => 'required|integer|exists:worksubmit,id',
            'employee_id' => 'required|integer|exists:employee,id',
            'project_id' => 'required|integer|exists:project,id',
            'work_date'  => 'required|date',
            'hours'      => 'required|numeric|min:1|max:24',
            'status'     => 'nullable|integer|in:0,1,2',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $workSubmit = WorkSubmit::find($request->id);
        if (! $workSubmit) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $empId = (int) $request->employee_id;
        $exists = WorkSubmit::where('employee_id', $empId)
            ->where('project_id', (int) $request->project_id)
            ->whereDate('work_date', $request->work_date)
            ->where('id', '!=', $workSubmit->id)
            ->first();
        if ($exists) {
            return response()->json([
                'errors' => [
                    'work_date' => ['Work hours already submitted for this project on the selected date.'],
                ],
            ], 422);
        }

        $data = [
            'employee_id' => $empId,
            'project_id'  => (int) $request->project_id,
            'work_date'   => $request->work_date,
            'hours'       => (float) $request->hours,
        ];
        if ($request->filled('status')) {
            $data['status'] = (int) $request->status;
        }

        $workSubmit->update($data);

        return response()->json(['id' => $workSubmit->id]);
    }

    public function adminCheckrow($id)
    {
        $workSubmit = WorkSubmit::with(['project:id,name', 'employee:id,name,employee_code'])
            ->find($id);
        if (! $workSubmit) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        return response()->json(['data' => $this->adminEntryPayload($workSubmit)]);
    }

    public function adminDestroy($id)
    {
        $workSubmit = WorkSubmit::find($id);
        if (! $workSubmit) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $workSubmit->delete();

        return response()->json([
            'message' => 'Deleted successfully',
            'id'      => $id,
        ], 200);
    }

    private function adminStatusCounts(): array
    {
        $counts = WorkSubmit::selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return [
            'pending'   => (int) ($counts[0] ?? 0),
            'approved'  => (int) ($counts[1] ?? 0),
            'cancelled' => (int) ($counts[2] ?? 0),
            'total'     => (int) $counts->sum(),
        ];
    }

    private function adminEntryPayload(WorkSubmit $item): array
    {
        return [
            'id'            => $item->id,
            'employee_id'   => $item->employee_id,
            'employee_name' => optional($item->employee)->name ?? '',
            'project_id'    => $item->project_id,
            'project_name'  => optional($item->project)->name ?? '',
            'work_date'     => $item->work_date,
            'hours'         => (float) $item->hours,
            'status'        => (int) $item->status,
            'status_label'  => $this->statusLabel((int) $item->status),
            'created_at'    => $item->created_at,
        ];
    }

    private function resolveEmployee(): array
    {
        $user = Auth::user();
        $empId = ! empty($user->emp_id) ? (int) $user->emp_id : null;

        if (! $empId) {
            return [
                'error' => response()->json([
                    'message' => 'Unauthorized: No employee profile linked to this account',
                ], 403),
            ];
        }

        $employee = Employee::with(['department:id,name', 'designation:id,name'])
            ->find($empId);

        if (! $employee) {
            return [
                'error' => response()->json([
                    'message' => 'Employee not found',
                ], 404),
            ];
        }

        return ['employee' => $employee];
    }

    private function employeePayload(Employee $employee): array
    {
        return [
            'id'               => $employee->id,
            'name'             => $employee->name,
            'employee_code'    => $employee->employee_code,
            'department_name'  => optional($employee->department)->name ?? '',
            'designation_name' => optional($employee->designation)->name ?? '',
        ];
    }

    private function entryPayload(WorkSubmit $item): array
    {
        return [
            'id'           => $item->id,
            'employee_id'  => $item->employee_id,
            'project_id'   => $item->project_id,
            'project_name' => optional($item->project)->name ?? '',
            'work_date'    => $item->work_date,
            'hours'        => (float) $item->hours,
            'status'       => (int) $item->status,
            'status_label' => $this->statusLabel((int) $item->status),
            'created_at'   => $item->created_at,
        ];
    }

    private function statusLabel(int $status): string
    {
        if ($status === 1) {
            return 'Approved';
        }
        if ($status === 2) {
            return 'Cancelled';
        }

        return 'Pending';
    }

    private function monthRange(string $month): array
    {
        $startDate = $month . '-01';
        $endDate = date('Y-m-t', strtotime($startDate));

        return [$startDate, $endDate];
    }

    private function buildSummary(int $empId, string $startDate, string $endDate): array
    {
        $rows = WorkSubmit::query()
            ->with('project:id,name')
            ->where('employee_id', $empId)
            ->whereBetween('work_date', [$startDate, $endDate])
            ->get(['id', 'project_id', 'work_date', 'hours', 'status']);

        $projectTotals = [];
        $dayTotals = [];
        $totalHours = 0.0;
        $statusCounts = [
            'pending'   => 0,
            'approved'  => 0,
            'cancelled' => 0,
        ];

        foreach ($rows as $row) {
            $hours = (float) $row->hours;
            $totalHours += $hours;

            $rowStatus = (int) ($row->status ?? 0);
            if ($rowStatus === 1) {
                $statusCounts['approved'] += 1;
            } elseif ($rowStatus === 2) {
                $statusCounts['cancelled'] += 1;
            } else {
                $statusCounts['pending'] += 1;
            }

            $projectId = (int) $row->project_id;
            if (! isset($projectTotals[$projectId])) {
                $projectTotals[$projectId] = [
                    'project_id'   => $projectId,
                    'project_name' => optional($row->project)->name ?? '',
                    'hours'        => 0.0,
                    'entries'      => 0,
                    'days'         => [],
                ];
            }
            $projectTotals[$projectId]['hours'] += $hours;
            $projectTotals[$projectId]['entries'] += 1;
            $projectTotals[$projectId]['days'][] = (string) $row->work_date;

            $date = date('Y-m-d', strtotime($row->work_date));
            if (! isset($dayTotals[$date])) {
                $dayTotals[$date] = [
                    'date'    => $date,
                    'hours'   => 0.0,
                    'entries' => 0,
                ];
            }
            $dayTotals[$date]['hours'] += $hours;
            $dayTotals[$date]['entries'] += 1;
        }

        foreach ($projectTotals as &$projectTotal) {
            $projectTotal['hours'] = round($projectTotal['hours'], 2);
            $projectTotal['days_worked'] = count(array_unique($projectTotal['days']));
            unset($projectTotal['days']);
        }
        unset($projectTotal);

        foreach ($dayTotals as &$dayTotal) {
            $dayTotal['hours'] = round($dayTotal['hours'], 2);
        }
        unset($dayTotal);

        ksort($dayTotals);

        return [
            'total_hours'    => round($totalHours, 2),
            'total_entries'  => $rows->count(),
            'days_worked'    => count($dayTotals),
            'status_counts'  => $statusCounts,
            'project_totals' => array_values($projectTotals),
            'day_totals'     => array_values($dayTotals),
        ];
    }
}
