<?php

namespace App\Http\Controllers;

use App\Models\Archive;
use Illuminate\Http\Request;

class ArchiveController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->query('category');
        $q = Archive::query()->orderByDesc('archived_at')->orderByDesc('id');
        if ($category) {
            $q->where('category', $category);
        }
        $items = $q->get()->map(function ($a) {
            return [
                'id' => $a->id,
                'archivableId' => (int) $a->archivable_id,
                'archivableType' => $a->archivable_type,
                'category' => $a->category,
                'dataSnapshot' => $a->data_snapshot,
                'archivedBy' => $a->archived_by,
                'archivedAt' => optional($a->archived_at)->toIso8601String(),
                'remarks' => $a->remarks,
            ];
        });
        return response()->json($items);
    }
}
