import React from 'react';
import { Card, Col} from 'reactstrap';
import { Link } from "react-router-dom";
import Rating from "react-rating"


const Book = (props) => {
  const {book_id, image_url, title, author, column, price, styling, rating} = props

  return (
    <Col className={styling} md={column} key={book_id}>
      <Link to={`/books/${book_id}`}>
      <Card className='h-100'>
        <div style={{background: `url(${image_url}) no-repeat center`,  backgroundSize: "cover", height: '100%', width: '100%'} }/>
          <div className="book-desc">
            <p><strong>{title}</strong></p>
            <p className="author">{author}</p>
            { rating &&
            <Rating 
              emptySymbol="far fa-star"
              fullSymbol="fas fa-star"
              readonly
              initialRating={parseFloat(rating)/10} 
              />
            }
            {price &&
            <p className="price">$ {price}</p>
            }
          </div>
      </Card>
      </Link>
    </Col>
  )
}

export default Book
