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

    public function update($id, Request $request)
    {

    }

    public function delete($id)
    {

    }
}