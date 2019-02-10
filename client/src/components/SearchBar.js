import React, {Component} from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import {API} from '../config.js';
import queryString from 'query-string'
import {
  ListGroupItem,
  Button,
  Input, } from 'reactstrap';

class SearchBar extends Component {
  state = {search: "", suggestions: [], drop: false}
  
  timeout = null
  
  componentDidMount(){
    let keyword = queryString.parse(this.props.location.search).keyword
    if(keyword && keyword.length>0){
    this.setState({search: keyword})}
  }
  
  handleInputChange = (e) => {
    clearTimeout(this.timer)
    this.setState({search: e.target.value}) 
    this.timer = setTimeout(this.fetchSuggestion, 300)
    this.inputOnFocus()
  }
  
  fetchSuggestion = () => {
    let search = `keyword=${this.state.search}&limit=5&offset=0`
    if(this.state.search.length < 1){
      this.setState({suggestions: []})
    } else {
      axios.get(`${API}/books?${search}`)
        .then(res => {
          let suggestions = res.data.data
          this.setState({suggestions})
    })}
  }
  
  inputOnBlur = () =>{
    setTimeout(()=>this.setState({drop: false}), 300)
  }
    
  inputOnFocus = () =>{
    this.setState({drop:true})
  }
  
  handleSearch = (e) =>{
    e.preventDefault()
    let search = `keyword=${this.state.search}`
    this.props.history.push(`/books/browse?${search}`)
    this.inputOnBlur()
  }
  
  render(){
    let suggestions = this.state.suggestions.map((suggestion, i) => (
      <Link key={i} to={`/books/${suggestion.book_id}`}>
        <ListGroupItem >
          {suggestion.title} in <strong>{suggestion.genre.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, ", ")}</strong>
        </ListGroupItem>
      </Link>
    ))
    
    return(
      <form className="searchbar"
        onSubmit={this.handleSearch}>
        <div className="search-input">
          <Input
            onFocus={this.inputOnFocus}
            onBlur={this.inputOnBlur}
            placeholder="Search book title, author, genre, or isbn" value={this.state.search} onChange={this.handleInputChange}/>
          <Button className="searchbar-button"><i className="fas fa-search"></i></Button>
        </div>
        {this.state.drop && (
          <ul className="suggestion">
            {suggestions}
          </ul>
        )}
      </form>
    )
  }
}

export default SearchBar

