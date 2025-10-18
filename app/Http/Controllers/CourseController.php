<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        $items = Course::orderBy('id')->get()->map(function ($c) {
            return [
                'id' => $c->id,
                'code' => $c->code,
                'name' => $c->name,
                'status' => $c->status,
            ];
        });
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|max:50|unique:courses,code',
            'name' => 'required|string|max:255',
            'status' => 'nullable|string|in:active,archived',
        ]);
        $data['status'] = $data['status'] ?? 'active';
        $course = Course::create($data);
        return response()->json(['id' => $course->id] + $data, 201);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $data = $request->validate([
            'code' => 'required|string|max:50|unique:courses,code,' . $course->id,
            'name' => 'required|string|max:255',
            'status' => 'nullable|string|in:active,archived',
        ]);
        $course->update($data);
        return response()->json([
            'id' => $course->id,
            'code' => $course->code,
            'name' => $course->name,
            'status' => $course->status,
        ]);
    }

    public function archive($id)
    {
        $course = Course::findOrFail($id);
        $course->update(['status' => 'archived']);
        return response()->json(['ok' => true]);
    }
}
