<?php

namespace App\Http\Controllers;

// use App\Review;
use Illuminate\Http\Request;

class DiscussionController extends Controller
{
    public function showDiscussions(Request $request, $book_id)
    {
        $offset = $request->get("offset"); 
        if(!is_null($offset)){
            $offset = " OFFSET " . $offset;
        }
        $limit = $request->get("limit");
        if(!is_null($limit)){
            $limit = " LIMIT " . $limit;
        }
        
        $sql = "SELECT discussion_id, discussions.user_id, username, text, parent_id, discussions.created_at
            FROM discussions LEFT JOIN users ON discussions.user_id = users.user_id
            WHERE book_id=$book_id ORDER BY discussions.created_at DESC" . $limit . $offset;
        $result = app('db')->select($sql);
        return response()->json(["data" => $result, "status" => "success"]);
    }

    public function createDiscussion(Request $request, $book_id, $user_id)
    {
        $sql = "INSERT INTO discussions (book_id, user_id, text, parent_id) 
            VALUE (:book_id, :user_id, :text, :parent_id)";
        $data = [
          ":book_id" => $book_id,
          ":user_id" => $user_id,
          ":text" => $request->input('text'),
          ":parent_id" => $request->input('parent_id')
        ];
        
        $new_discussion = app('db')->insert($sql, $data);
        $new_disc_sql = "SELECT discussion_id, discussions.user_id, username, text, parent_id, discussions.created_at
            FROM discussions LEFT JOIN users ON discussions.user_id = users.user_id
            WHERE discussion_id=LAST_INSERT_ID()";
        $new_disc_data= app('db')->select($new_disc_sql)[0];
        return response()->json(["data" => $new_disc_data, "status" => "success"], 200);
    }
    
    public function deleteDiscussion($discussion_id)
    {
        $sql = "DELETE FROM discussions WHERE discussion_id=:discussion_id";
        $deleted = app('db')->delete($sql, [":discussion_id"=>$discussion_id]);
        return response()->json(["data" => $discussion_id, "status" => "success"], 200);
    }
}