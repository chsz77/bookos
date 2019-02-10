<?php

namespace App\Http\Controllers;

// use App\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{

    public function showBooks(Request $request)
    {
        $type = $request->get("type");
        $fulltext_type = "";
        
        if($type === "popular"){
            $type = "(views+sold+SUM(value))";
        }
        
        if(!is_null($type)){
            $type = "$type DESC";
            $fulltext_type = ", $type";
        }
        
        $offset = $request->get("offset"); 
        if(!is_null($offset)){
            $offset = " OFFSET " . $offset;
        }
        $limit = $request->get("limit");
        if(!is_null($limit)){
            $limit = " LIMIT " . $limit;
        }
        $keyword = $request->get("keyword");
        
        $search = "";
        
        $groupby = " GROUP BY books.book_id, title, author, genre, image_url, price, synopsis, sold, views, created_at";
        
        if(!empty($keyword)){
            $search = " WHERE title LIKE '%$keyword%' OR genre LIKE '%$keyword%' 
                OR author LIKE '%$keyword%' OR isbn LIKE '%$keyword%'";
        }
        
        $fulltext_search = 
            "SELECT books.book_id, title, author, genre, image_url, price, AVG(value) as rating,
                MATCH (title,genre,author,synopsis) AGAINST ('$keyword') AS score
            FROM books LEFT JOIN ratings ON books.book_id = ratings.book_id
            WHERE 
            MATCH (title,genre,author,synopsis) AGAINST ('$keyword')
            > 0 
            $groupby
            ORDER BY score DESC" . $fulltext_type . $limit . $offset;
            
        $results = app('db')->select($fulltext_search);
        if(sizeof ($results) > 0){
            return response()->json(["data" => $results, "status" => "success"]);    
        } else {
            if(!empty($type)){
                $type =  " ORDER BY " . $type . " ";
            }
            $slow_search = 
                "SELECT books.book_id, title, author, genre, image_url, price, AVG(value) as rating
                FROM books 
                LEFT JOIN ratings ON books.book_id = ratings.book_id" . $search .  
                $groupby . $type . $limit . $offset;
            $results = app('db')->select($slow_search);
            return response()->json(["data" => $results, "status" => "success"]);
        }
        
    }

    public function showOneBook(Request $request, $id)
    {
        $book_sql = "SELECT * FROM books WHERE books.book_id=$id";
        $rating_sql = "SELECT COUNT(value) as count_rating, AVG(value) as rating FROM ratings WHERE book_id=$id";
        $book = app('db')->select($book_sql);
        $rating = app('db')->select($rating_sql);
        return response()->json(["data" => $book[0], "rating" => $rating[0], "status" => "success"]);
    }

    public function create(Request $request)
    {
        $Book = Book::create($request->all());

        return response()->json($Book, 201);
    }

    public function update($id, Request $request)
    {
        $Book = Book::findOrFail($id);
        $Book->update($request->all());

        return response()->json($Book, 200);
    }

    public function delete($id)
    {
        Book::findOrFail($id)->delete();
        return response('Deleted Successfully', 200);
    }
}