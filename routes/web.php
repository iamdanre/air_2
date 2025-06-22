<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SalaryController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api/salaries/filters', [SalaryController::class, 'getFilters']);
Route::get('/api/salaries', [SalaryController::class, 'getSalaries']);
