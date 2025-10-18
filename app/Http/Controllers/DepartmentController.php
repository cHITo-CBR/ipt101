<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        $items = Department::orderBy('id')->get()->map(function ($d) {
            return [
                'id' => $d->id,
                'code' => $d->code,
                'name' => $d->name,
                'status' => $d->status,
            ];
        });
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|max:50|unique:departments,code',
            'name' => 'required|string|max:255',
            'status' => 'nullable|string|in:active,archived',
        ]);
        $data['status'] = $data['status'] ?? 'active';
        $item = Department::create($data);
        return response()->json(['id' => $item->id] + $data, 201);
    }

    public function update(Request $request, $id)
    {
        $item = Department::findOrFail($id);
        $data = $request->validate([
            'code' => 'required|string|max:50|unique:departments,code,' . $item->id,
            'name' => 'required|string|max:255',
            'status' => 'nullable|string|in:active,archived',
        ]);
        $item->update($data);
        return response()->json([
            'id' => $item->id,
            'code' => $item->code,
            'name' => $item->name,
            'status' => $item->status,
        ]);
    }

    public function archive($id)
    {
        $item = Department::findOrFail($id);
        $item->update(['status' => 'archived']);
        return response()->json(['ok' => true]);
    }
}
