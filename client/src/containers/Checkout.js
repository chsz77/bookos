import React, { Component } from 'react';
import {
  Container, 
  } from 'reactstrap';
import {Elements} from 'react-stripe-elements';

import CheckoutForm from "../components/CheckoutForm"

class Checkout extends Component {
  componentDidMount(){
    window.scrollTo(0,0)
  }
  
  render(){
    return(
      <Container>
          <Elements>
            <CheckoutForm {...this.props} currentUser={this.props.currentUser}/>
          </Elements>
      </Container>
    )
  }
}

export default Checkout