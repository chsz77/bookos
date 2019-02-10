import React from 'react';
import {
  Col, 
  Row} from 'reactstrap';
import Rating from 'react-rating'
  

const BookDescription = props => {
  let {image_url, author, title, synopsis, published_at, rating} = props.book
  
  return (
    <Row>
      <Col md="4">
        <div style={{background: `url(${image_url}) no-repeat center`,  backgroundSize: "cover", height: "330px", width: '100%'} }/>
      </Col>
      <Col md="8">
        <h4>{title}</h4>
        <Rating 
          emptySymbol="far fa-star"
          fullSymbol="fas fa-star"
          readonly
          initialRating={parseFloat(rating)/10} 
          /><span> {(parseFloat(rating)/10).toFixed(1)}</span>
        <p>{author} &middot; {published_at}</p>
        <hr/>
        <p style={{whiteSpace: 'pre-line'}}>{synopsis}</p>
      </Col>
    </Row>
  )
}

export default BookDescription