<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        $items = Student::orderBy('id')->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'studentNo' => $s->student_no,
                'name' => $s->name,
                'courseId' => (int) $s->course_id,
                'yearLevel' => (int) $s->year_level,
                'status' => $s->status,
            ];
        });
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'studentNo' => 'required|string|max:50|unique:students,student_no',
            'name' => 'required|string|max:255',
            'courseId' => 'required|integer|exists:courses,id',
            'yearLevel' => 'nullable|integer|min:1|max:6',
            'status' => 'nullable|string|in:active,archived',
        ]);
        $student = Student::create([
            'student_no' => $data['studentNo'],
            'name' => $data['name'],
            'course_id' => $data['courseId'],
            'year_level' => $data['yearLevel'] ?? 1,
            'status' => $data['status'] ?? 'active',
        ]);
        return response()->json([
            'id' => $student->id,
            'studentNo' => $student->student_no,
            'name' => $student->name,
            'courseId' => (int) $student->course_id,
            'yearLevel' => (int) $student->year_level,
            'status' => $student->status,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $data = $request->validate([
            'studentNo' => 'required|string|max:50|unique:students,student_no,' . $student->id,
            'name' => 'required|string|max:255',
            'courseId' => 'required|integer|exists:courses,id',
            'yearLevel' => 'required|integer|min:1|max:6',
            'status' => 'nullable|string|in:active,archived',
        ]);
        $student->update([
            'student_no' => $data['studentNo'],
            'name' => $data['name'],
            'course_id' => $data['courseId'],
            'year_level' => $data['yearLevel'],
            'status' => $data['status'] ?? $student->status,
        ]);
        return response()->json([
            'id' => $student->id,
            'studentNo' => $student->student_no,
            'name' => $student->name,
            'courseId' => (int) $student->course_id,
            'yearLevel' => (int) $student->year_level,
            'status' => $student->status,
        ]);
    }

    public function archive($id)
    {
        $student = Student::findOrFail($id);
        $student->update(['status' => 'archived']);
        return response()->json(['ok' => true]);
    }
}
