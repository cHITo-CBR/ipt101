<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function index()
    {
        $items = AcademicYear::orderBy('id')->get()->map(function ($a) {
            return [
                'id' => $a->id,
                'label' => $a->label,
                'status' => $a->status,
            ];
        });
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'label' => 'required|string|max:50|unique:academic_years,label',
            'status' => 'nullable|string|in:active,archived',
        ]);
        $data['status'] = $data['status'] ?? 'active';
        $item = AcademicYear::create($data);
        return response()->json(['id' => $item->id] + $data, 201);
    }

    public function update(Request $request, $id)
    {
        $item = AcademicYear::findOrFail($id);
        $data = $request->validate([
            'label' => 'required|string|max:50|unique:academic_years,label,' . $item->id,
            'status' => 'nullable|string|in:active,archived',
        ]);
        $item->update($data);
        return response()->json([
            'id' => $item->id,
            'label' => $item->label,
            'status' => $item->status,
        ]);
    }

    public function archive($id)
    {
        $item = AcademicYear::findOrFail($id);
        $item->update(['status' => 'archived']);
        return response()->json(['ok' => true]);
    }
}
