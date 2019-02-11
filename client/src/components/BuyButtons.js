import React, {Component} from 'react';
import {Button} from 'reactstrap';
import Spinner from "./Spinner";
import axios from 'axios';
import {API} from '../config.js';

class BuyButtons extends Component{
  state = {spinAdd: false, spinBuy: false,  cartAdded: false}
  
  addToCart = (book_id, buy) => {
    if(buy === "buy"){
      this.setState({spinBuy: true})
    } else {
      this.setState({spinAdd: true})
    }
    
    let user_id = this.props.currentUser.user_id
    if(user_id){
      axios.post(`${API}/users/${user_id}/cart/${book_id}`)
        .then(res => {
          let status = res.data.status
          if(status === "success"){
            if(buy === "buy"){
              this.props.history.push("/checkout")
            } else {
            this.setState({cartAdded: true, spinAdd: false})}
            setTimeout(() => this.dismissNotif(), 7000)
          }
        })
        .catch(()=> this.setState({spinAdd: false, spinBuy: false}))
      } else {
        this.props.history.push("/signup")
      }
      
  }
  
  dismissNotif = () => {
    this.setState({cartAdded: false})
  }
  
  render(){
    let {price, book_id} = this.props
  
    return (
      <div>
        <h2 className="display-4 text-center pb-2">${price}</h2>
        <Button 
          onClick={this.addToCart.bind(this, book_id, "buy")}
          className="button-browse" block>
          {this.state.spinBuy && 
            <Spinner/>
          }
          Buy Now</Button>
        <div className="text-center">or</div>
        <Button onClick={this.addToCart.bind(this, book_id)} className="button-browse"block>
          {this.state.spinAdd && 
            <Spinner/>
          }
          Add to Cart</Button>
          {this.state.cartAdded && (
            <div className="add-cart"><p>Added to Cart <span onClick={this.dismissNotif.bind(this)}>&times;</span></p></div>
          )}
      </div>
    )  
  }
  
}

export default BuyButtons