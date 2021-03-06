import React, { Component } from 'react';
import {
  Container, 
  Col,
  Row } from 'reactstrap';
import queryString from 'query-string'
import axios from 'axios'
import {API} from '../config'
import Book from '../components/Book'
import Waypoint from 'react-waypoint'
import Spinner from '../components/Spinner'
import { Link } from "react-router-dom";
import Loader from "./Loader"



class Browser extends Component {
  state = {loading: true, books:[], offset: 0, 
    spinner: false,
    genActive: "",
    sortActive: "",
    title: "Browse Our Books", 
    limit: 20, end: false, genFixed: false}
  
  componentDidMount(){
      this.fetchBooks()
  }
  
  fetchBooks = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    let keyword = queryString.parse(this.props.location.search).keyword || ""
    let type = queryString.parse(this.props.location.search).type || "created_at"
    this.setState({sortActive: type, genActive: keyword})
    if(keyword){
      keyword = `&keyword=${keyword}`
    }
    type = `&type=${type}`
    
    axios.get(`${API}/books?limit=20&offset=0${keyword}${type}`)
      .then(res => {
        let books = res.data.data
        this.setState({books, loading:false, offset: 0, spinner: false})
      })
      .catch(()=>this.setState({spinner: false, loading: false}))
  }
  
  fetchMoreBooks = () => {
    if(this.state.books.length > 0 && !this.state.loading && !this.state.end){
      this.setState({loading: true})
      let limit = this.state.limit
      let offset = this.state.offset + limit
      let keyword = queryString.parse(this.props.location.search).keyword || ""
      let type = queryString.parse(this.props.location.search).type || "created_at"
      
      if(keyword){
        keyword = `&keyword=${keyword}`
      }
      type = `&type=${type}`
      
      axios.get(`${API}/books?limit=${limit}&offset=${offset}${keyword}${type}`)
        .then(res => {
          if(res.data.data.length === 0){
            return this.setState({end: true})
          } 
          offset = limit + offset
          let morebooks = res.data.data
          this.setState({books:[...this.state.books, ...morebooks], offset, loading: false})
        })
    }    
  }
  
  componentDidUpdate(prevProps){
    if(this.props.location.search !== prevProps.location.search){
         this.setState({spinner:true})
         this.fetchBooks()
      }
  }
  
  handleLink = e => {
    let query = queryString.parse(this.props.location.search)
    query[e.target.getAttribute('name')] = e.target.getAttribute('value')
    this.props.history.push("?" + queryString.stringify(query))
  }
  
  render(){
    let sortData = [ 
      {title: "New Books", type: "created_at"},
      {title: "Trending", type: "views"},
      {title: "Best Sellers", type:"sold"}]
    
    let sorts = sortData.map((sort, i) => (
      <li value={sort.type} onClick={this.handleLink} 
      className={sort.type.toUpperCase() === this.state.sortActive.toUpperCase() ? "sort-active" : ""} 
      name="type" key={i}>{sort.title}</li>
    ))  
    let genreData = ["Sci-Fi", "Comedy", "Fantasy", "Adventure", "War", "Action", "Romance", "Drama", "Mystery", "Horror", "Thriller", 
      
    ]
    
    let genres = genreData.map( (genre, i) => (
      <li value={genre} className={`${genre.toUpperCase() === this.state.genActive.toUpperCase() ? "sort-active " : ""}genres-list`}  
      
      onClick={this.handleLink} name="keyword" key={i}>{genre}</li>
    ))
    
    let title = "Browse Our Books"
    
    let books = this.state.books.map((book, i) => (
      <Book key={i} book_id={book.book_id} image_url={book.image_url} rating={book.rating} price={book.price}
      title={book.title} author={book.author} column="3" styling="book-browser"/>  
    ))
    
    return (
      <div>
        <Loader {...this.props} loading={this.state.loading}/>
      <Container>
        <div className="gen-waypoint">
          <Waypoint onLeave={() => this.setState({genFixed: true})} onEnter={() => this.setState({genFixed: false})}/>
        </div>
        <Row>
          <Col md="2">
            <ul className={this.state.genFixed ? "genres-fixed" : "genres"}>
              <h6>Genre</h6>
              <li className="genres-list"><Link to="/books/browse">All</Link></li>
              {genres}
            </ul>
          </Col>
          <Col md="10">
            <h5>{title}</h5>
            <div className='sortbutton'>
              {sorts}
              {this.state.spinner && (
                <Spinner/>
              )}
            </div>
            <hr/>
            <div className="browser">
              {!this.state.loading && !this.state.spinner && this.state.books.length === 0 && 
              <h6 className="text-center mx-auto py-4">Sorry, we dont have that books</h6>}
              {books}
            </div>
          </Col>
          <div className="load-waypoint">
            <Waypoint onEnter={()=>this.fetchMoreBooks()}/>
          </div>
        </Row>
        
      </Container>
        <div style={{height: "200px"}}>
        </div>
      </div>
    )
  }
}

export default Browser