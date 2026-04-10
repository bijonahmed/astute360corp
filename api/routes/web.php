<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

 


Route::fallback(function (Request $request) {
    if ($request->expectsJson()) {
        return response()->json([
            'success' => false,
            'message' => 'Oops! Invalid request. Use the proper API endpoint.',
        ], 404);
    }

    return redirect('/')->with('error', 'Oops! Invalid URL, redirected to home.');
});