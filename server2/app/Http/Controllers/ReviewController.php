<?php

namespace App\Http\Controllers;

// use App\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function showReviews(Request $request, $book_id)
    {
        $offset = $request->get("offset"); 
        if(!is_null($offset)){
            $offset = " OFFSET " . $offset;
        }
        $limit = $request->get("limit");
        if(!is_null($limit)){
            $limit = " LIMIT " . $limit;
        }
        
        $sql = "SELECT reviews.review_id, text, reviews.created_at, reviews.book_id, value as rating, reviews.user_id, username 
            FROM reviews 
            LEFT JOIN ratings ON reviews.review_id = ratings.review_id
            LEFT JOIN users ON reviews.user_id = users.user_id
            WHERE ratings.book_id=$book_id ORDER BY reviews.created_at DESC" . $limit . $offset;
        $result = app('db')->select($sql);
        return response()->json(["data" => $result, "status" => "success"]);
    }

    public function createReview(Request $request, $book_id, $user_id)
    {
        $review_sql = "INSERT INTO reviews (book_id, user_id, text) VALUE (:book_id, :user_id, :text)";
        $review_data = [
          ":book_id" => $book_id,
          ":user_id" => $user_id,
          ":text" => $request->input('text')
        ];
        
        $new_review = app('db')->insert($review_sql, $review_data);
        // if(new_review){
        $review_id_sql = "SELECT review_id FROM reviews WHERE book_id=:book_id AND user_id=:user_id AND text=:text";
        $review_id = app('db')->select($review_id_sql, $review_data);
        $review_id =  $review_id[0]->review_id;
        
        if($review_id){
            $rating_sql = "INSERT INTO ratings (book_id, user_id, review_id, value) VALUE (:book_id, :user_id, :review_id, :value)";
            $rating_data = [
              ":book_id" => $book_id,
              ":user_id" => $user_id,
              ":review_id" => $review_id,
              ":value" => $request->input('value')
            ];
            $rating = app('db')->insert($rating_sql, $rating_data);
            
            
            $new_review_sql = "SELECT reviews.review_id, text, reviews.created_at, reviews.book_id, value as rating, reviews.user_id, username 
            FROM reviews 
            LEFT JOIN ratings ON reviews.review_id = ratings.review_id
            LEFT JOIN users ON reviews.user_id = users.user_id
            WHERE reviews.review_id = LAST_INSERT_ID()";
            $new_review_data = app('db')->select($new_review_sql)[0];
            
            return response()->json(["data" => $new_review_data , "status" => "success"], 200);
        }
    }
    
    public function showUserReviews(Request $request, $user_id){
        $book_id = $request->get('book');
        
        if($book_id){
           $book_id  = " AND reviews.book_id=$book_id";
        }
        
        $sql = "SELECT title, image_url, reviews.review_id, text, reviews.created_at, reviews.book_id, value as rating FROM reviews 
            LEFT JOIN ratings ON reviews.review_id = ratings.review_id
            LEFT JOIN books on reviews.book_id = books.book_id
            WHERE reviews.user_id=$user_id" . $book_id . " ORDER BY created_at DESC";
        
        $reviews = app('db')->select($sql); 
        return response()->json(["data" => $reviews, "status" => "success"], 200);
    }
    
    
    public function updateReview(Request $request, $review_id)
    {
        $text =  $request->input('text');
        $value =  $request->input('value');
        
        $upreview_sql = "UPDATE reviews SET text=:text WHERE review_id=$review_id";
        $upreview = app('db')->update($upreview_sql, [":text" => $text]);
        $uprating_sql = "UPDATE ratings SET value=:value WHERE review_id=$review_id";
        $uprating = app('db')->update($uprating_sql, [":value" => $value]);
        
        $sql = "SELECT reviews.review_id, text, reviews.created_at, reviews.book_id, value as rating FROM reviews 
            LEFT JOIN ratings ON reviews.review_id = ratings.review_id
            WHERE reviews.review_id=$review_id"; 
        
        $updated_review = app('db')->select($sql); 
        
        return response()->json(["data" => $updated_review, "status" => "success"]);
    }

    public function deleteReview($review_id)
    {   
        $sql = "DELETE FROM reviews WHERE review_id=$review_id";
        $del_review = app('db')->delete($sql);
        return response()->json(["data" => $review_id, "status" => "deleted"], 200);
    }
}