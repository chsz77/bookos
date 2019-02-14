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

    public function showOneBook(Request $request, $book_id)
    {
        $book_sql = "SELECT * FROM books WHERE books.book_id=$book_id";
        $rating_sql = "SELECT COUNT(value) as count_rating, AVG(value) as rating FROM ratings WHERE book_id=$book_id";
        $book = app('db')->select($book_sql);
        $rating = app('db')->select($rating_sql);
        //better way is needed
        $update_views = app('db')->update("UPDATE books SET views = views + 1 WHERE book_id = $book_id");
        
        return response()->json(["data" => $book[0], "rating" => $rating[0], "status" => "success"]);
    }

    public function newBook(Request $request)
    {
        $sql = 
            "INSERT INTO books (title, author, synopsis, isbn, published_at, price, stock, image_url, genre) 
            VALUE (:title, :author, :synopsis, :isbn, :published_at, :price, :stock, :image_url, :genre)";
        
        
        $data = [
            ":title" => $request->input("title"),
            ":author" => $request->input("author"),
            ":synopsis" => $request->input("synopsis"),
            ":isbn" => $request->input("isbn"),
            ":published_at" => $request->input("published_at"),
            ":price" => $request->input("price"),
            ":stock" => $request->input("stock"),
            ":image_url" => $request->input("image_url"),
            ":genre" => $request->input("genre"),
        ];
    
        $new_book = app('db')->insert($sql, $data);
        
        return response()->json(["data" => $data, "status"=>"success"], 201);
    }

    public function updateBook(Request $request, $book_id)
    {
        $sql = "UPDATE books SET title=:title, author=:author, synopsis=:synopsis, 
            isbn=:isbn, price=:price, stock=:stock, image_url=:image_url, genre=:genre,
            published_at=:published_at
            WHERE book_id=:book_id";

         $data = [
            ":book_id" => $book_id,
            ":title" => $request->input("title"),
            ":author" => $request->input("author"),
            ":synopsis" => $request->input("synopsis"),
            ":isbn" => $request->input("isbn"),
            ":published_at" => $request->input("published_at"),
            ":price" => $request->input("price"),
            ":stock" => $request->input("stock"),
            ":image_url" => $request->input("image_url"),
            ":genre" => $request->input("genre"),
        ];
        
        $updated_book = app('db')->update($sql, $data);
        
        return response()->json(["status" => "success", "data" => $data], 201);
    }

    public function deleteBook($book_id)
    {
        $sql = "DELETE FROM books WHERE book_id=$book_id";
        $deleted_book = app('db')->delete($sql);
        return response()->json(["status" => "success", "data" => $book_id], 201);
    }
}