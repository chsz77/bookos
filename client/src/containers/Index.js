import React, { Component } from 'react';
import { Container, Button } from 'reactstrap';
import { Link } from "react-router-dom";
import BookRow from "../components/BookRow"
import BookSlide from "../components/BookSlide"

class Index extends Component {
  state = {loading: true}
  
  statusUp(){
    this.setState({loading: false})
  }
  
  rowsData = 
    [{type: "sold", title:"Top Sellers"}, 
      {type: "created_at", title: "New Arrivals"}, 
      {type: "popular", title: "Popular Books"}]


  render() {
    let rowstyle = {overflowX: 'scroll', scrollBehavior: "smooth", display: 'flex', flexWrap:'nowrap'}
    
    let {loading} = this.state
    
    let bookRows = this.rowsData.map( row => (
        <div key={row.title} >
        <Link to={`/books/browse?type=${row.type}`}><h4>{row.title}</h4></Link>
        <BookRow limit="12" column="2" scrollLeft 
        key={row.title}
        rowstyle={rowstyle} 
        styling="book-scroll" 
        statusUp={this.statusUp.bind(this)}
        type={row.type}/>
        </div>

    ))
    
    return (
      <div>
        <div  className="bg-image"/>
        <div className="bg-overlay" />
        <div className="welcome"/>
        <Container>
          <div className={loading ? 'd-none' : ''}>
          {bookRows}
          <BookSlide />
          <div className="text-center py-4">
          <Link to="/books/browse"><Button className="button-browse">Browse Our Collection</Button></Link>
          </div>
          </div>
        </Container>
      </div>
    );
  }
}

export default Index
