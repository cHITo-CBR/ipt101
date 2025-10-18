<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    public function index()
    {
        $items = Faculty::orderBy('id')->get()->map(function ($f) {
            return [
                'id' => $f->id,
                'employeeNo' => $f->employee_no,
                'name' => $f->name,
                'departmentId' => (int) $f->department_id,
                'status' => $f->status,
            ];
        });
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'employeeNo' => 'required|string|max:50|unique:faculty,employee_no',
            'name' => 'required|string|max:255',
            'departmentId' => 'required|integer|exists:departments,id',
            'status' => 'nullable|string|in:active,archived',
        ]);
        $item = Faculty::create([
            'employee_no' => $data['employeeNo'],
            'name' => $data['name'],
            'department_id' => $data['departmentId'],
            'status' => $data['status'] ?? 'active',
        ]);
        return response()->json([
            'id' => $item->id,
            'employeeNo' => $item->employee_no,
            'name' => $item->name,
            'departmentId' => (int) $item->department_id,
            'status' => $item->status,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $item = Faculty::findOrFail($id);
        $data = $request->validate([
            'employeeNo' => 'required|string|max:50|unique:faculty,employee_no,' . $item->id,
            'name' => 'required|string|max:255',
            'departmentId' => 'required|integer|exists:departments,id',
            'status' => 'nullable|string|in:active,archived',
        ]);
        $item->update([
            'employee_no' => $data['employeeNo'],
            'name' => $data['name'],
            'department_id' => $data['departmentId'],
            'status' => $data['status'] ?? $item->status,
        ]);
        return response()->json([
            'id' => $item->id,
            'employeeNo' => $item->employee_no,
            'name' => $item->name,
            'departmentId' => (int) $item->department_id,
            'status' => $item->status,
        ]);
    }

    public function archive($id)
    {
        $item = Faculty::findOrFail($id);
        $item->update(['status' => 'archived']);
        return response()->json(['ok' => true]);
    }
}
