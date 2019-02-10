<?php

namespace App\Http\Controllers;
use \Firebase\JWT\JWT;


// use App\Book;
use Illuminate\Http\Request;

$key = "helloworld";

class AuthController extends Controller
{
    
    
    public function signin(Request $request)
    {
        $key = "helloworld";
        $username = $request->input("username");
        $password = crypt($request->input("password"), $key);
        $sql = "SELECT * FROM users WHERE username='$username' AND password='$password'";
        $login_user = app('db')->select($sql)[0];
        $data = (object) ['username' => $login_user->username, 'user_id' => $login_user->user_id];
        $token = JWT::encode($data, $key);
        return response()->json(["status" => "success", "data" => $token], 200);
    }
    
    public function signup(Request $request)
    {
        $key = "helloworld";
        $username = $request->input('username');
        $password = $request->input("password");
        if(!empty($password)){
            $hashed_password = crypt($password, $key);
        }
            
        $sql = "INSERT INTO users (username, password) VALUE (:username, :password)";
        $data = [
            ":username" => $username,
            ":password" => $hashed_password,
        ];
        
        $new_user = app('db')->insert($sql, $data);
        
        if($new_user){
            $login_sql = "SELECT * FROM users WHERE username=:username AND password=:password";
            $login_user = app('db')->select($login_sql, $data)[0];
            $data = (object) ['username' => $login_user->username, 'user_id' => $login_user->user_id];
            $token = JWT::encode($data, $key);
            
            return response()->json(["status" => "success", "data" => $token], 200);
        }
        
        return response()->json(["status" => "failed", "data" => 0], 500);
    }
    
}