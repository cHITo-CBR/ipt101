<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Archive extends Model
{
    use HasFactory;

    protected $fillable = [
        'archivable_id',
        'archivable_type',
        'category',
        'data_snapshot',
        'archived_by',
        'archived_at',
        'remarks',
    ];

    protected $casts = [
        'archivable_id' => 'integer',
        'archived_by' => 'integer',
        'archived_at' => 'datetime',
        'data_snapshot' => 'array',
    ];
}
