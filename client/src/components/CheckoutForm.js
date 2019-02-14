import React, { Component } from 'react';
import axios from 'axios';
import {API} from '../config.js';
import {
  FormGroup, Label, Input, ListGroup, Form,
  ListGroupItem,
  Col,
  Button,
  Modal, 
  Row } from 'reactstrap';
import Spinner from "./Spinner"  
import {injectStripe, CardElement} from 'react-stripe-elements';
import Paid from '../containers/Paid'

class CheckoutForm extends Component {
  state = {
    cart: [],
    success: false,
    error: false,
    hasProfile: false,
    spinConf: false,
    profileModified: false,
    profile: {name: "", address:"", phone:"", email:""}, 
    modal: false,}
  
  componentDidMount(){
    let user_id = this.props.currentUser.user_id
    
    this.fetchCart(user_id)
    this.fetchProfile(user_id)
  }
  
  fetchCart = (user_id) => {
    axios.get(`${API}/users/${user_id}/cart`)
      .then(res => {
        let cart = res.data.data
        if(cart.length < 1){
          return this.props.history.push('/books')
        }
        this.setState({cart})
      })
  }
  
  deleteCartItem = (cart_item_id) => {
    let user_id = this.props.currentUser.user_id
    axios.delete(`${API}/users/${user_id}/cart/${cart_item_id}`)
      .then(res => {
        if(res.data.status === "success"){
          this.setState({cart: this.state.cart.filter(item => item.cart_item_id !== cart_item_id)})
        }
        if(this.state.cart.length < 1){
          return this.props.history.push('/books')
        }
      })
  }
  
  fetchProfile = (user_id) => {
    axios.get(`${API}/users/${user_id}/profile`)
      .then(res => {
        let profile = res.data.data
        this.setState({profile, hasProfile: true})
      })
  }
  
  //needd better
  handlePayment = (shipcost) => {
    this.setState({spinConf: true})
    let user_id = this.props.currentUser.user_id
    
    if(this.state.profileModified){
        this.updateProfile(user_id)
    }
    
    this.props.stripe.createToken({name: this.state.profile.name})
      .then(({token}) => {
        let data = {
          user_id: user_id, ship_cost: shipcost, 
          ship_address: this.state.profile.address, 
          token: token.id}
          
        axios.post(`${API}/users/${user_id}/checkout`, data)
          .then(res => {
            if(res.data.status === "success"){
            this.setState({success: true})
            }
          })
          .catch(()=> this.setState({spinConf: false, error: true}))
      })
      .catch(()=> this.setState({spinConf: false, error: true}))
  }
  
  //edit or createProfile
  updateProfile = (user_id) => {
    let method = "post"
    if(this.state.hasProfile){
      method = "put"
    }
    
    axios({
      method: method,
      url: `${API}/users/${user_id}/profile`,
      data: this.state.profile})
      .then(res => {
          let profile = res.data.data
          this.setState({profile, form: true})
      })
  }
  
  toggle = () =>{
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    if(this.state.error){
      setTimeout(()=>this.setState({error: false}), 500)
    }
  }
  
  handleChange = e => {
      this.setState({
          profile: {...this.state.profile, [e.target.name]: e.target.value}, profileModified:true
      })
    }
  
  render(){
    let shipcost = 5
    let total = 0
    let cartItems = this.state.cart.map((item, i) => {
      total += parseFloat(item.price)
      return(
        <ListGroupItem key={i}>
          <Row>
          <Col md="2" style={{background: `url(${item.image_url}) no-repeat center`,  backgroundSize: "cover", height: '75px', width: '100%'} }>
          </Col>
          <Col md="10">
          <span onClick={this.deleteCartItem.bind(this, item.cart_item_id)}className="del-cartitem">&times;</span>
          <span className="float-right"><strong>${item.price}</strong></span>
          <div>{item.title}</div>
          <small>{item.author}</small>
          </Col>
          </Row>
        </ListGroupItem>
    )})
    
    let {name, address, phone, email} = this.state.profile
    
    if(this.state.success){
      return <Paid />
    }
    
    if(!this.props.currentUser.user_id){
      this.props.history.push("/books")
    }
    
    return(
          <Form>
            <Row>
              <Col md={{size: 6, offset: 1}} className="checkout-form">
                <h4>Payment</h4>
                <hr />
                <FormGroup>
                  <Label for="title">Name</Label>
                  <Input type="text" name="name" value={name} onChange={this.handleChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                  <Label for="title">Phone Number</Label>
                  <Input type="text" name="phone" value={phone} onChange={this.handleChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                  <Label for="title">E-mail</Label>
                  <Input type="text" name="email" value={email} onChange={this.handleChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                  <Label for="author">Shipping Address</Label>
                  <Input type="textarea" name="address" value={address} onChange={this.handleChange.bind(this)}/>
                </FormGroup>
              </Col>
              <Col md="4" className="payment-details">
                <ListGroup flush>
                {cartItems}
                </ListGroup>
                <div className="text-right pt-3 payment-total">
                  <p>Shipping: ${shipcost}</p>
                  <p><strong>Total: ${(total + shipcost).toFixed(2)}</strong></p>
                </div>
                <div className="creditcard-form">
                    <label>Card details</label>
                    <CardElement/>
                </div>
                <Button className="button-browse" onClick={this.toggle} block>Checkout</Button>
                <Modal backdrop={false} isOpen={this.state.modal} toggle={this.toggle} className="checkout-modal">
                  {this.state.error ? (
                    <h6>Payment Error</h6>
                    ) :
                    (this.state.spinConf ? <h6 className="checkout-wait"><Spinner/><span>Please Wait</span></h6> : 
                    <h6>Confirm Payment</h6>)}
                  <div className="checkout-buttons">
                    <button onClick={this.handlePayment.bind(this, shipcost)}>Confirm</button>{' '}
                    <button onClick={this.toggle}>Cancel</button>
                  </div>
                </Modal>
              </Col>
            </Row>
          </Form>
    )
  }
}

export default injectStripe(CheckoutForm)