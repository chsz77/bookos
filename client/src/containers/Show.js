import React, { Component } from 'react';
import axios from 'axios';
import {API} from '../config.js';
import Loader from "./Loader"
import { Container, Col, Row } from 'reactstrap';
import BookTabs from "../components/BookTabs"
import BookDescription from "../components/BookDescription"
import BookInfo from "../components/BookInfo"
import BuyButtons from "../components/BuyButtons"
import BookRecommendation from "../components/BookRecommendation"

class Show extends Component {
  state = {book: {}, loading:false}
  
  componentDidMount(){
    window.scrollTo(0, 0)
    this.setState({loading: true})
    let book_id = this.props.match.params.book_id
    this.fetchBook(book_id);
  }
  
  componentDidUpdate(prevProps){
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    let book_id = this.props.match.params.book_id
    let prevBook_id = prevProps.match.params.book_id
    if(book_id !== prevBook_id){
      this.fetchBook(book_id);
    }
  }
  
  fetchBook = (book_id) => {
    axios.get(`${API}/books/${book_id}`)
      .then(res => {
        let book = res.data.data
        let rating = res.data.rating
        book.count_rating = rating.count_rating
        book.rating = rating.rating
        this.setState({book, loading: false})
      })
  }
   
  render (){
    let {loading} = this.state
    
    let {book} = this.state 
    
    return (
      <div>
        <Loader {...this.props} loading={this.state.loading}/>
        <Container>
          <div className={loading ? 'd-none' : ''}>
            <Row className="showpage">
              <Col>
                <BookDescription book={book}/>
                <br/>
                <BookTabs {...this.props}/>
              </Col>
              <Col md="3">
                <BookInfo book={book}/>
                <hr/>
                <BuyButtons {...this.props} price={book.price} book_id={book.book_id} currentUser={this.props.currentUser}/>
                <hr/>
                {book.genre && 
                  <BookRecommendation book_filter={book.book_id}keyword={book.genre}/>  
                }
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    )
  }
}

export default Show
