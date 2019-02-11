<?php

namespace App\Http\Controllers;

// use App\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function showReviews(Request $request, $book_id, $limit, $offset)
    {
        if(!is_null($offset)){
            $offset = " OFFSET " . $offset;
        }
        if(!is_null($limit)){
            $limit = " LIMIT " . $limit;
        }
        
        $sql = "SELECT reviews.review_id, text, reviews.created_at, reviews.book_id, value as rating, reviews.user_id, username 
            FROM reviews 
            LEFT JOIN ratings ON reviews.review_id = ratings.review_id
            LEFT JOIN users ON reviews.user_id = users.user_id
            WHERE reviews.book_id=$book_id ORDER BY reviews.created_at DESC" . $limit . $offset;
        $result = app('db')->select($sql);
        return response()->json(["data" => $result, "status" => "success"]);
    }

    public function create(Request $request)
    {
        
    }

    public function update($id, Request $request)
    {

    }

    public function delete($id)
    {

    }
}