import React, { Component } from 'react';
import BookRow from "./BookRow"
import {
  Col, 
  Row } from 'reactstrap';
import { Link } from "react-router-dom";


class BookSlide extends Component {
  state = {activeIndex: 0, categories: ["Sci-Fi", "Fantasy", "Romance", "Drama", "Comedy"]}
  
  componentDidMount(){
    this.timerID = setInterval(
      () => this.tick(),
      7000
    );
  }
  
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  
  tick() {
    if(this.state.activeIndex < this.state.categories.length - 1){
      this.setState({
        activeIndex: this.state.activeIndex + 1
      });
    } else {
      this.setState({
        activeIndex: 0
      })
    }
  }
  render(){
    let {activeIndex} = this.state
    let rowstyle2 = {display: 'flex'}
    
    let displayedSection = this.state.categories.map((category, i) => (
      <Row key={i} className={activeIndex !== i ? "d-none" : ""}>
        <Col md="2">
          <p className="showcase-tag">
            <Link to={`/books/browse?keyword=${category}`}>{category}</Link>
          </p>
        </Col>
        <Col className="showcase">
          <BookRow 
            limit="12" 
            column="2" 
            rowstyle={rowstyle2} 
            styling="book-slide" 
            type="popular"
            keyword={category}
            />
        </Col>
      </Row>
    ))
        
    return(
      <div>
        <h4>Recommended Books</h4>
        {displayedSection}
      </div>
    )
  }
}

export default BookSlide