<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\FacultyController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public API for the Admin SPA (session-protected at the page level)
// Courses
Route::get('/courses', [CourseController::class, 'index']);
Route::post('/courses', [CourseController::class, 'store']);
Route::put('/courses/{id}', [CourseController::class, 'update']);
Route::post('/courses/{id}/archive', [CourseController::class, 'archive']);

// Departments
Route::get('/departments', [DepartmentController::class, 'index']);
Route::post('/departments', [DepartmentController::class, 'store']);
Route::put('/departments/{id}', [DepartmentController::class, 'update']);
Route::post('/departments/{id}/archive', [DepartmentController::class, 'archive']);

// Academic Years
Route::get('/academic-years', [AcademicYearController::class, 'index']);
Route::post('/academic-years', [AcademicYearController::class, 'store']);
Route::put('/academic-years/{id}', [AcademicYearController::class, 'update']);
Route::post('/academic-years/{id}/archive', [AcademicYearController::class, 'archive']);

// Students
Route::get('/students', [StudentController::class, 'index']);
Route::post('/students', [StudentController::class, 'store']);
Route::put('/students/{id}', [StudentController::class, 'update']);
Route::post('/students/{id}/archive', [StudentController::class, 'archive']);

// Faculty
Route::get('/faculty', [FacultyController::class, 'index']);
Route::post('/faculty', [FacultyController::class, 'store']);
Route::put('/faculty/{id}', [FacultyController::class, 'update']);
Route::post('/faculty/{id}/archive', [FacultyController::class, 'archive']);

