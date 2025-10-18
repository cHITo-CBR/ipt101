<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_no',
        'name',
        'course_id',
        'year_level',
        'status',
    ];

    protected $casts = [
        'year_level' => 'integer',
        'course_id' => 'integer',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
