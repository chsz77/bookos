import React, { Component } from 'react';
import axios from 'axios';
import {API} from '../config.js';
import {
  ListGroup, 
  ListGroupItem } from 'reactstrap';
import Waypoint from 'react-waypoint';
import Rating from 'react-rating'  
  

class ReviewList extends Component{
  state = {showMore: false}
  
  render(){
    let {review, i} = this.props
    return (
      <ListGroupItem  className="reviews" key={i}>
        <div><strong>{review.username || "user-placeholder"} &middot; </strong><span>{review.created_at}</span></div>
        <Rating 
          emptySymbol="far fa-star"
          fullSymbol="fas fa-star"
          readonly
          initialRating={parseFloat(review.rating)/10} 
          />
        <p className={this.state.showMore ? "show-more" : ""}>{review.text}</p>
        {review.text.length > 750 && 
          <span className="morebutton" onClick={()=>this.setState({showMore: !this.state.showMore})}>
          {this.state.showMore ? "show less" : "show more"}</span>  
        }
      </ListGroupItem>
    )
  }
}

class Reviews extends Component {
  state = {reviews:[], limit:5, offset:0}
  timeout = 0
  
  componentDidMount(){
    this.loadReviews(this.state.limit, this.state.offset)
  }
  
  componentDidUpdate(prevProps){
    if(this.props.match){
      let book_id = this.props.match.params.book_id
      let prevBook_id = prevProps.match.params.book_id
      if(book_id !== prevBook_id){
        this.loadReviews(5, 0);
        this.refs.more.style.display = 'block'
      }
    }
  }
  
  loadMoreReviews = () => {
    let book_id = this.props.match.params.book_id
    let offset = this.state.offset + this.state.limit
    let limit = this.state.limit
    axios.get(`${API}/reviews/${book_id}/${limit}/${offset}`)
      .then(res => {
        let reviews = res.data.data
        if(reviews.length === 0){
          this.refs.more.style.display = 'none'
        }
        this.setState({reviews: [...this.state.reviews, ...reviews]})
      })
    this.setState({offset})
  }
  
  loadReviews(limit, offset){
    let book_id = this.props.match.params.book_id
    axios.get(`${API}/reviews/${book_id}/${limit}/${offset}`)
      .then(res => {
        let reviews = res.data.data
        if(reviews.length === 0){
          this.refs.more.style.display = 'none'
        }
        this.setState({reviews})
      })
  }
  
  render(){
    const review = this.state.reviews.map((review, i) => (
        <ReviewList review={review} i={i}/>
    ))
    
    return(
      <ListGroup flush>
        <div>
        {review}
        </div>
        <div className='text-center pt-4'ref='more'>
        {this.state.reviews.length !== 0 && (<Waypoint onEnter={this.loadMoreReviews.bind(this)}/>)}
          <h6>Loading...</h6>
        </div>
      </ListGroup>
    )
  }
}

export default Reviews