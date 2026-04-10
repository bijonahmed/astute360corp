<?php

namespace App\Services;

use App\Models\PathaoToken;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class PathaoService
{
    /*Sandbox */

/*
    private $baseUrl = "https://courier-api-sandbox.pathao.com/aladdin/api/v1";
    private $clientId = "7N1aMJQbWm";
    private $clientSecret = "wRcaibZkUdSNz2EI9ZyuXLlNrnAv0TdPUPXMnD39";
    private $username = "test@pathao.com";
    private $password = "lovePathao";
  
*/

    //Live 
    
    private $baseUrl = "https://api-hermes.pathao.com/aladdin/api/v1";
    private $clientId = "MYer92WdOB";
    private $clientSecret = "imJVUfIiKoLfmMqhMQt5Mmf2rN3tOPztLtq9i7kz";

    private $username = "riyasadmarketer@gmail.com";
    private $password = "*Pp198913";
 
    
    

    /**
     * Core: Return Valid Access Token
     */
    public function getAccessToken()
    {
        $token = PathaoToken::latest()->first();

        if ($token && Carbon::now()->lt($token->expires_at)) {
            return $token->access_token;
        }

        if ($token) {
            return $this->refreshToken($token->refresh_token);
        }

        return $this->issueToken();
    }

    /**
     * Issue Token First Time
     */
    public function issueToken()
    {
        $response = Http::post($this->baseUrl . "/issue-token", [
            "client_id"     => $this->clientId,
            "client_secret" => $this->clientSecret,
            "grant_type"    => "password",
            "username"      => $this->username,
            "password"      => $this->password,
        ]);

        return $this->saveToken($response->json());
    }

    /**
     * Refresh Token
     */
    public function refreshToken($refreshToken)
    {
        $response = Http::post($this->baseUrl . "/issue-token", [
            "client_id"     => $this->clientId,
            "client_secret" => $this->clientSecret,
            "grant_type"    => "refresh_token",
            "refresh_token" => $refreshToken,
        ]);

        return $this->saveToken($response->json());
    }

    /**
     * Store Token in DB
     */
    private function saveToken($data)
    {
        $expiresAt = Carbon::now()->addSeconds($data["expires_in"]);

        PathaoToken::truncate();

        PathaoToken::create([
            "access_token"  => $data["access_token"],
            "refresh_token" => $data["refresh_token"],
            "expires_in"    => $data["expires_in"],
            "expires_at"    => $expiresAt,
        ]);

        return $data["access_token"];
    }

    /**
     * Create Pathao Order
     */
    public function createOrder($payload)
    {
        $token = $this->getAccessToken();

        $response = Http::withToken($token)
            ->post($this->baseUrl . "/orders", $payload);

        return $response->json();
    }

    public function getStores()
    {
        $token = $this->getAccessToken();

        $response = Http::withToken($token)
            ->get($this->baseUrl . "/stores");

        return $response->json();
    }
}
