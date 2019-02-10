import React from 'react';
import {Button} from 'reactstrap';
import { Link } from "react-router-dom";
  

const BookInfo = props => {
  let {views, sold, stock, count_rating, genre} = props.book
  
  let genres = []
  
  genre ? genres = genre.split('|').map((gen, i) => {
    return <Link key={i} to={`/books/browse?keyword=${gen}`}><Button className="genre-button" key={i}>{gen}</Button></Link>
  }): genres = <Link to={`/books/browse?keyword=${genre}`}> <Button>{genre}</Button></Link>
  
  return (
    <div className="book-info">
      <h2>{views} views</h2>
      <h2>{Number(count_rating)} reviews</h2>
      <h2>{sold} sold</h2>
      <h2>{stock} left</h2>
      <div className="book-genres">
        {genres}
      </div>
    </div>

  )
}

export default BookInfo