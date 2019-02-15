<?php

namespace App\Http\Controllers;

// use App\User;
use Illuminate\Http\Request;
\Stripe\Stripe::setApiKey('sk_test_NHz3XmYKyW11cc9nwLz3APXq');


class UserController extends Controller
{

    public function showCart(Request $request, $user_id)
    {
        $sql = "SELECT cart_item_id, user_id, added_at, title, author, image_url, price 
            FROM cart_items INNER JOIN books ON cart_items.book_id = books.book_id 
            WHERE user_id=:user_id AND paid=0 ORDER BY added_at DESC";
        $result = app('db')->select($sql, [":user_id" => $user_id]);
        return response()->json(["data" => $result]);
    }

    public function addToCart(Request $request, $user_id, $book_id)
    {
        $sql = "INSERT INTO cart_items (user_id, book_id) VALUE(:user_id, :book_id)";
        $result = app('db')->insert($sql, [":user_id" => $user_id, ":book_id" => $book_id]);
        return response()->json(["status" => "success"]);
    }

    public function showProfile(Request $request, $user_id)
    {
        $sql = "SELECT *  FROM users_profile WHERE user_id=:user_id";
        $result = app('db')->select($sql, [":user_id" => $user_id])[0];

        return response()->json(["data" => $result, "status"=>"success"], 200);
    }

    public function createProfile(Request $request, $user_id){
        $sql = "INSERT INTO users_profile (user_id, name, phone, email, address, profile_image) 
            VALUE(:user_id, :name, :phone, :email, :address, 'test')";
        $data = [
          ":user_id" => $user_id,
          ":name" => $request->input("name"),
          ":phone" => $request->input("phone"),
          ":email" => $request->input("email"),
          ":address" => $request->input("address"),
        ];
        
        $new_profile = app('db')->insert($sql, $data);
        return response()->json(["status" => "success", "data" => $data], 200);    
        
    }

    public function updateProfile(Request $request, $user_id){
        $sql = "UPDATE users_profile SET name=:name, phone=:phone, email=:email, address=:address 
            WHERE user_id=:user_id";
        
        $data = [
          ":user_id" => $user_id,
          ":name" => $request->input("name"),
          ":phone" => $request->input("phone"),
          ":email" => $request->input("email"),
          ":address" => $request->input("address"),
        ];
        
        $update_profile = app('db')->insert($sql, $data);
        return response()->json(["status" => "success", "data" => "1"], 200);    
        
    }
    
    public function checkout(Request $request, $user_id)
    {
        $token = $request->input('token');
        $ship_address = $request->input("ship_address");
        $ship_cost = (float) $request->input("ship_cost");
        
        $cart_total_sql = "SELECT SUM(price) as cart_total FROM cart_items 
            INNER JOIN books ON cart_items.book_id = books.book_id 
            WHERE user_id=:user_id AND paid=0
            GROUP BY user_id
            ;";
        
        $cart_total = (float) app('db')->select($cart_total_sql, [":user_id" => $user_id])[0]->cart_total;
        $total = ($cart_total + $ship_cost) * 100;
        
        $charge = \Stripe\Charge::create(
            ['amount' => $total, 
            'currency' => 'usd', 
            'source' => $token]);
        
        if($charge){
          $paidbooks = app('db')->select("SELECT book_id FROM cart_items WHERE paid=0 AND user_id=$user_id");
          forEach ($paidbooks as $paidbook){
            $paidbook = $paidbook->book_id;
            $sql = "UPDATE books SET stock = stock - 1, sold = sold + 1 WHERE book_id=:paidbook";
            app('db')->update($sql, [":paidbook" => $paidbook]);
          };
          
          $pay_sql = "UPDATE cart_items SET paid=1, pay_id=:token WHERE user_id=:user_id AND paid=0";
          $pay_success = app('db')->update($pay_sql, [":user_id" => $user_id, ":token" => $token]);  
          
          if($pay_success){
            $data = [
              ":user_id" => $user_id,
              ":ship_cost" => $ship_cost,
              ":cart_total" => $total/100,
              ":ship_address" => $ship_address,
              ":pay_id" => $token
            ];
            $sql = "INSERT INTO payment (pay_id, ship_address, ship_cost, cart_total, user_id) 
                VALUE(:pay_id, :ship_address, :ship_cost, :cart_total, :user_id)";
            $checkout = app('db')->insert($sql, $data);
            if($checkout){
              return response()->json(["status" => "success", "data" => "1"], 200);
            }
            
        return response()->json(["status" => "failed", "data" => 0], 400);    
        };  
    }
        
    // return response()->json(["status" => "failed", "data" => "0"], 200); 

        return response()->json($total, 200);
    }

    public function delCartItem($user_id, $cart_item_id)
    {
        $data = [
          ":user_id" => $user_id,
          ":cart_item_id" => $cart_item_id
        ];
        
        $sql = "DELETE FROM cart_items WHERE user_id=:user_id AND cart_item_id=:cart_item_id";
        $del_cartitem = app('db')->delete($sql, $data);
        if($del_cartitem){
            return response()->json(["status" => "success", "data" => $cart_item_id], 200);
        }
        return response()->json(["status" => "failed", "data" => "0"], 400);
    }
    
    public function showTransactions(Request $request, $user_id){
      $sql = "SELECT * FROM payment WHERE user_id=$user_id 
      ORDER BY created_at DESC";
      
      $transactions = app('db')->select($sql);
      
      return response()->json(["status" => "success", "data" => $transactions], 200);
    }
    
    public function showTransItems(Request $request, $user_id, $pay_id){
      $sql = "SELECT title, image_url, price, pay_id FROM cart_items  
      LEFT JOIN books ON cart_items.book_id = books.book_id 
      WHERE user_id=:user_id AND pay_id=:pay_id AND paid=1
      ORDER BY cart_items.added_at DESC";
      
      $items = app('db')->select($sql, [":user_id" => $user_id, ":pay_id" => $pay_id]);
      return response()->json(["status" => "success", "data" => $items], 200);
    }
}