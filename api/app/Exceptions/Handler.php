<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{
    protected function unauthenticated($request, \Illuminate\Auth\AuthenticationException $exception)
    {
        return response()->json([
            'message' => 'Unauthenticated. Please use API client (Postman, Axios, Fetch).',
        ], 401);
    }
}
