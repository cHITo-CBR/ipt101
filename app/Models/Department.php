<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'status',
    ];

    protected $table = 'departments';

    public function faculty()
    {
        return $this->hasMany(Faculty::class, 'departmentId');
    }
}
