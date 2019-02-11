import React, { Component } from 'react';
import axios from 'axios';
import {API} from "../config"
import { Link } from "react-router-dom";

import {
  Dropdown, DropdownToggle, DropdownMenu, 
  ListGroup, 
  ListGroupItem,
  Button,
  Col, 
  Row} from 'reactstrap';
  
class Cart extends Component {
  state = {cart: [], dropdownOpen: false}
  
  componentDidMount(){
    this.fetchCart()
  }
  
  fetchCart = () => {
    let user_id = this.props.currentUser.user_id
    axios.get(`${API}/users/${user_id}/cart`)
      .then(res => {
        let cart = res.data.data.reverse()
        if(cart !== this.state.cart){
          this.setState({cart})
        }
      })
  }
  
  deleteCartItem = (cart_item_id) => {
    let user_id = this.props.currentUser.user_id
    axios.delete(`${API}/users/${user_id}/cart/${cart_item_id}`)
      .then(res => {
        if(res.data.status === "success"){
          this.setState({cart: this.state.cart.filter(item => item.cart_item_id !== cart_item_id)})
        }
      })
  }
  
  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }
  
  render(){
    let total = 0    
    let cartItems = this.state.cart.map((item, i) => {
      total += parseFloat(item.price)
      return(
          <ListGroupItem key={i}>
            <Row>
              <Col md="3" style={{padding: "7px"}}>
                <div style={{background: `url(${item.image_url}) no-repeat center`,  backgroundSize: "cover", height: '70px', width: '100%'} }/>
              </Col>
              <Col md="9">
                <span onClick={this.deleteCartItem.bind(this, item.cart_item_id)}className="float-right del-cartitem ">&times;</span>
                
                <div style={{height: "20px", overflow: "hidden", marginTop: "5px"}}>{item.title}</div>
                <small>{item.author}</small>
                <p className="text-right"><strong>${item.price}</strong></p>
              </Col>
            </Row>
          </ListGroupItem>
    )})
    
    return(
      <div>
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle.bind(this)}>
          <DropdownToggle className="cart-icon" onClick={this.fetchCart.bind(this)}>
            <i className="fas fa-shopping-cart"></i>
          </DropdownToggle>
          <DropdownMenu className="cart-drop">
            <ListGroup flush>
            {cartItems}
            </ListGroup>
            {total > 0 ? 
            <div className="text-center">
              <p style={{fontSize: "0.9rem"}}className="text-center pt-2"><strong>Total: ${total.toFixed(2)}</strong></p>
              <Link onClick={this.toggle.bind(this)} to="/checkout">
                <Button block style={{marginRight: '2px'}}className='button-browse'>Checkout</Button>
              </Link>
            </div> : 
            <p className="text-center pt-3">You have nothing</p>
            }
          </DropdownMenu>
        </Dropdown>
      </div>
    )
  }
}

export default Cart