<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'student_id',
        'faculty_id',
        'file_path',
        'status',
        'remarks',
    ];

    protected $casts = [
        'student_id' => 'integer',
        'faculty_id' => 'integer',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function faculty()
    {
        // Table name is `faculty` not `faculties`
        return $this->belongsTo(Faculty::class, 'faculty_id');
    }
}
