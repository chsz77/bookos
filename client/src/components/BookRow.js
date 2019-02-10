import React, { Component } from 'react';
import axios from 'axios';
import {API} from '../config.js';
import { Button, Row } from 'reactstrap';
import Book from "./Book"
import Loader from "../containers/Loader"
import queryString from 'query-string'

class BookRow extends Component {
  state = {books:[], loading: true}
  
  componentDidMount(){
    this.fetchBooks()
  }
  
  componentDidUpdate(prevProps){
    if(this.props.location !== prevProps.location){
      this.fetchBooks()
    }
    if(this.props.book_filter !== prevProps.book_filter){
      this.fetchBooks()
    }
  }
  
  fetchBooks = () => {
    let limit = `&limit=${this.props.limit}`
    let type = this.props.type
    type ? type = `&type=${type}` : type = ""
    
    let keyword = this.props.keyword
    
    if(this.props.location && queryString.parse(this.props.location.search).keyword){
      keyword = queryString.parse(this.props.location.search).keyword
    }
    
    console.log(this.props.keyword)
    
    keyword ? (keyword = `&keyword=${keyword}`) : (keyword = "")
    
    this.setState({loading: true})
    axios.get(`${API}/books?offset=0${limit}${type}${keyword}`)
      .then(res => {
        let books = res.data.data
        if(this.props.book_filter){
          books = books.filter(book => book.book_id !== this.props.book_filter)
          if(books.length > 9){
            books.pop()
          } 
        }
        this.setState({books, loading: false}, this.props.statusUp)
      })
  }
  
  scrollBooks(direction){
    if(direction === "right"){
      this.refs.row.scrollLeft += 400
    } else {
      this.refs.row.scrollLeft -= 400
    }
  } 
  
  render(){
    const books = this.state.books.map(book => (
      <Book column={this.props.column} styling={this.props.styling} key={book.book_id} book_id={book.book_id} image_url={book.image_url} author={book.author} title={book.title} published_at={book.published_at}/>
    ))
    
    return(
      <div>
        <Loader loading={this.state.loading} {...this.props}/>
        <div key={this.props.type} className={this.state.loading ? 'd-none bookrows' : 'bookrows'} style={{minHeight: '300px'}}>
          
          <h5>{this.props.title}</h5>
          <div ref="row" className="row" style={this.props.rowstyle}>
            {books}
          </div>
          {this.props.styling === "book-scroll" && (
          <Row className="scroller">
            <div>
              <Button className="scroll-button" onClick={this.scrollBooks.bind(this, "left")}>&#8249;</Button>
            </div>
            <div>
              <Button className="scroll-button" onClick={this.scrollBooks.bind(this, "right")}>&#8250;</Button>
            </div>
          </Row>
          )}
        </div> 
      </div> 
    )
  }
}

export default BookRow
