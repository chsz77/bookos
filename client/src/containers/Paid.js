import React from 'react';
import { Container, Col } from 'reactstrap';
import {Link} from 'react-router-dom'
  
const Paid = () => (
  <Container>
    <Col md={{size: 6, offset: 3}} className="payment-success">
      <h2>Your payment has been received</h2>
      <h4>we will proceed to deliver your books</h4>
      <p>contact our customer service for more info</p>
      <p><Link to="/books/browse">Browse More Books</Link></p>
    </Col>
  </Container>
)

export default Paid