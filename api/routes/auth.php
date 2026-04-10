<?php

use Illuminate\Support\Facades\Route;

// Block GET requests to auth pages returning JSON
Route::get('register', function () {
    return response()->json(['message' => 'sorry invalid request'], 400);
})->name('register.block');

Route::get('login', function () {
    return response()->json(['message' => 'sorry invalid request'], 400);
})->name('login.block');

Route::get('forgot-password', function () {
    return response()->json(['message' => 'sorry invalid request'], 400);
});
