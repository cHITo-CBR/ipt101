<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_no',
        'name',
        'department_id',
        'status',
    ];

    protected $casts = [
        'department_id' => 'integer',
    ];

    protected $table = 'faculty';

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }
}
