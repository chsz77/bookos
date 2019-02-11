<?php

namespace App\Http\Middleware;

use Closure;

use \Firebase\JWT\JWT;


class AuthJwtMiddleware{
    public function handle($request, Closure $next){
        $auth_header = $request->header('Authorization');
        $token = explode(" ", $auth_header)[1];
        $key = env('SECRET_KEY');
        try{
            $decode = JWT::decode($token, $key, array('HS256'));
            if($decode){
                return $next($request);
            }
        } 
        catch (\Exception $e) { 
            // return print_r("hahahah");
            return response()->json(["status" => "auth failed", "data" => "0"], 200);
        }
        // return $next($request);
    }
}

// $authentication = function ($request, $response, $next) {
//     $auth_header = $request->getHeaderLine("Authorization");
//     $token = explode(" ", $auth_header)[1];
//     $key = "helloworld";
//     try{
//         $decode = JWT::decode($token, $key, array('HS256'));
//         if($decode){
//             $response = $next($request, $response);
//             return $response;
//         }
//     } catch (\Exception $e) { return $response->withJson(["status" => "failed", "data" => "0"], 200); }
// };