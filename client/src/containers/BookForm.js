import React, { Component } from 'react';
import {
  Form, FormGroup, Label, Input, 
  Button,
  Col,
  Container } from 'reactstrap';
import axios from 'axios';
import {API} from '../config'


class BookForm extends Component {
  state = {title:"", isbn:"", author:"", stock: "", price: "", 
    published_at:"", synopsis: "", genre: "", image_url:""}
  
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }
  
  handleSubmit = (e) => {
    e.preventDefault()
    axios.post(`${API}/books`, this.state)
      .then(res => {
        if(res.data.status === "success"){
          this.setState({success: true, title:"", isbn:"", author:"", 
            stock: "", price: "", published_at:"", synopsis: "", 
            genre: "", image_url:""})
          setTimeout(()=>this.setState({success: false}), 3000)
        }
      })
  }
  
  render(){
    let {title, isbn, author, stock, price, published_at, synopsis, genre, image_url, success} = this.state
    
    return(
      <Container className="py-4">
        <Col md={{size:"8", offset: "1"}}>
          <h3>Add a New Book</h3>
          {success && 
            <div className="alert alert-success" role="alert">
              Added new book
            </div>}
          <hr/>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <div className="form-row">
                <div className="col-md-7 mb-2">
                  <Label for="title">Title</Label>
                  <Input onChange={this.handleChange} type="text" 
                    name="title" 
                    value={title}
                    placeholder="Collapsing Empire, The Lord of The Ring..." />
                </div>
                <div className="col-md-5">
                  <Label for="author">Author</Label>
                  <Input onChange={this.handleChange} type="text" name="author" 
                    value={author}
                    placeholder="John Scalzi, JRR Tolkien..." />
                </div>
              </div>
            </FormGroup>
            <FormGroup>
              <div className="form-row">
                <div className="col-md-6">
                  <Label for="isbn">ISBN</Label>
                  <Input onChange={this.handleChange} type="text" name="isbn" 
                    value={isbn}
                    placeholder="978-3-16-148410-0"/>
                </div>
                <div className="col-md-3">
                  <Label for="publishedDate">Published Date</Label>
                  <Input onChange={this.handleChange} type="date" 
                    value={published_at}
                    name="published_at"/>
                </div>
                <div className="col-md-3">
                  <Label for="price">Price</Label>
                  <div className="input-group">  
                    <div className="input-group-prepend">
                      <div className="input-group-text">$</div>
                    </div>
                    <Input onChange={this.handleChange} type="number" name="price" 
                      value={price}
                      placeholder="200.00" className="form-control"/>
                  </div>
                </div>
              </div>
            </FormGroup>
            <FormGroup>
              <div className="form-row">
                <div className="col">
                  <Label>Genre</Label>
                  <Input onChange={this.handleChange} type="text" 
                    name="genre"
                    value={genre}
                    placeholder="Action|Romance|Comedy"/>
                </div>
                <div className="col-md-2">
                  <Label for="stock">Stock</Label>
                  <Input onChange={this.handleChange} type="number" name="stock" 
                    value={stock}
                    placeholder="1235" />
                </div>
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="synopsis">Image URL</Label>
              <Input onChange={this.handleChange} type="text" name="image_url" 
                value={image_url}
                placeholder="http://images.com/...jpg"/>
            </FormGroup>
            <FormGroup>
              <Label for="synopsis">Synopsis</Label>
              <Input onChange={this.handleChange} type="textarea" rows="5" name="synopsis" 
                value={synopsis}
                placeholder="Text goes here..."/>
            </FormGroup>
            <Button>Submit</Button>
          </Form>
        </Col>
      </Container>
    )
  }
}

export default BookForm
