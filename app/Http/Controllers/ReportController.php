<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Archive;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    public function index()
    {
        $items = Report::orderBy('id')->get()->map(function ($r) {
            return [
                'id' => $r->id,
                'title' => $r->title,
                'studentId' => (int) $r->student_id,
                'facultyId' => (int) $r->faculty_id,
                'filePath' => $r->file_path,
                'status' => $r->status,
                'remarks' => $r->remarks,
            ];
        });
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'studentId' => 'required|integer|exists:students,id',
            'facultyId' => 'required|integer|exists:faculty,id',
            'filePath' => 'nullable|string|max:1000',
            'status' => 'nullable|string|in:pending,approved,rejected',
            'remarks' => 'nullable|string|max:1000',
        ]);
        $report = Report::create([
            'title' => $data['title'],
            'student_id' => $data['studentId'],
            'faculty_id' => $data['facultyId'],
            'file_path' => $data['filePath'] ?? null,
            'status' => $data['status'] ?? 'pending',
            'remarks' => $data['remarks'] ?? null,
        ]);
        return response()->json([
            'id' => $report->id,
            'title' => $report->title,
            'studentId' => (int) $report->student_id,
            'facultyId' => (int) $report->faculty_id,
            'filePath' => $report->file_path,
            'status' => $report->status,
            'remarks' => $report->remarks,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $report = Report::findOrFail($id);
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'studentId' => 'required|integer|exists:students,id',
            'facultyId' => 'required|integer|exists:faculty,id',
            'filePath' => 'nullable|string|max:1000',
            'status' => 'nullable|string|in:pending,approved,rejected,archived',
            'remarks' => 'nullable|string|max:1000',
        ]);
        $report->update([
            'title' => $data['title'],
            'student_id' => $data['studentId'],
            'faculty_id' => $data['facultyId'],
            'file_path' => $data['filePath'] ?? null,
            'status' => $data['status'] ?? $report->status,
            'remarks' => $data['remarks'] ?? $report->remarks,
        ]);
        return response()->json([
            'id' => $report->id,
            'title' => $report->title,
            'studentId' => (int) $report->student_id,
            'facultyId' => (int) $report->faculty_id,
            'filePath' => $report->file_path,
            'status' => $report->status,
            'remarks' => $report->remarks,
        ]);
    }

    public function archive($id)
    {
        $report = Report::findOrFail($id);
        $report->update(['status' => 'archived']);

        Archive::create([
            'archivable_id' => $report->id,
            'archivable_type' => 'Report',
            'category' => 'report',
            'data_snapshot' => [
                'title' => $report->title,
                'student_id' => (int) $report->student_id,
                'faculty_id' => (int) $report->faculty_id,
                'file_path' => $report->file_path,
                'remarks' => $report->remarks,
            ],
            'archived_by' => Auth::id(),
            'archived_at' => now(),
            'remarks' => 'Archived via API',
        ]);

        return response()->json(['ok' => true]);
    }
}
