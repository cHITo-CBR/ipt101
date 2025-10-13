<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware('guest')->group(function () {
    // Show login on root and /login
    Route::get('/', [AuthController::class, 'showLogin'])->name('root');
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth')->group(function () {
    // Admin SPA at /admin with deep-link support for React Router
    Route::get('/admin', [AuthController::class, 'home'])->name('admin');
    Route::get('/admin/{any}', [AuthController::class, 'home'])->where('any', '.*');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});
