import React, { Component } from 'react';
import {
  Form, FormGroup, Label, Input, 
  Button,
  Col,
  Container } from 'reactstrap';


class AddBook extends Component {
  render(){
    return(
      <Container className="py-4">
      <Col md={{size:"8", offset: "1"}}>
      <h3>Add a New Book</h3>
      <hr/>
      <Form>
        <FormGroup>
          <div className="form-row">
            <div className="col-md-7 mb-2">
              <Label for="title">Title</Label>
              <Input type="text" name="title" placeholder="Collapsing Empire, The Lord of The Ring..." />
            </div>
            <div className="col-md-5">
              <Label for="author">Author</Label>
              <Input type="text" name="author" placeholder="John Scalzi, JRR Tolkien..." />
            </div>
          </div>
        </FormGroup>
        <FormGroup>
          <div className="form-row">
            <div className="col">
              <Label for="publishedDate">Published Date</Label>
              <Input type="date" name="publishedDate"/>
            </div>
            <div className="col">
              <Label for="publishedDate">Price</Label>
              <div className="input-group">  
                <div className="input-group-prepend">
                  <div className="input-group-text">$</div>
                </div>
                <input type="number" name="price" placeholder="200.00-" className="form-control"/>
              </div>
            </div>
            <div className="col">
              <Label for="publishedDate">Stock</Label>
              <Input type="number" name="stock" placeholder="1235" />
            </div>
          </div>
        </FormGroup>
        <FormGroup>
          <Label>Genre</Label><br/>
          <div className="form-check form-check-inline">
            <Input type="checkbox" />
            Action <br/>
            <Input type="checkbox" />
            Fantasy <br/>
            <Input type="checkbox" />
            Science Fiction
          </div>
        </FormGroup>
        <FormGroup>
          <Label for="synopsis">Synopsis</Label>
          <Input type="textarea" rows="5" name="synopsis" placeholder="Text goes here..."/>
        </FormGroup>
        <Button>Submit</Button>
      </Form>
      </Col>
      </Container>
    )
  }
}

export default AddBook
