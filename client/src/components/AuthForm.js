import React, {Component} from "react";
import {Form, Input, Button } from "reactstrap"
import axios from 'axios';
import {API} from '../config.js';
import Spinner from './Spinner'

class AuthForm extends Component{
  state = {username: "", password: "", confirmPassword: "", error: false, 
    spinner: false,
    validation:{
      username: {
        status: false,
        message: ""}, 
      password:{
        status: false,
        message: "",
        confmessage: ""
      } 
    }}
  
  componentDidMount(){
    if(this.props.signup && this.props.currentUser && this.props.currentUser.user_id){
      
      this.props.history.push("/books")
    }
    if(this.props.signup){
      window.scrollTo(0,0)}
  }
  
  componentDidUpdate(){
    if(this.props.signup && this.props.currentUser && this.props.currentUser.user_id){
      
      this.props.history.push("/books")
    }
  }
  
  handleSubmit = (e) =>{
    e.preventDefault()
    if(!this.state.spinner){
      let type = "signin"
      if(this.props.signup){
        let validusername = this.state.validation.username.status
        let validpassword = this.state.validation.password.status
        type = "signup"
        if(!(validusername && validpassword)){
          this.setState({spinner: false})
          this.validateUsername()
          this.validatePassword()
          this.validateConfPassword()
          return false
        }
      }
      
      this.setState({spinner: true})
      
      
      axios.post(`${API}/auth/${type}`, {username: this.state.username, password: this.state.password})
        .then(res => {
            let token = res.data.data
            if(token){
              localStorage.setItem("jwtToken", token);
              localStorage.setItem("expired", Math.floor(Date.now() / 60000));
              setTimeout(() => this.props.stateUp(), 300)
            }
            if(type==="signup"){
              this.props.history.push("/books")
            } else {
              this.setState({spinner: false})
            }
          })
        .catch(err => {
          this.setState({error:{status: true}, spinner: false})
        })
    }
  }
  
  validateUsername = () => {
    let {username} = this.state
    if(username.length < 3){
      this.setState({validation:{...this.state.validation, username:{status:false, message: "username must be at least 3 characters long"}}})
    } else if(username.match(/[^0-9a-z]/i)){
      this.setState({validation:{...this.state.validation, username:{state:false, message: "you can't use that characters"}}})
    }
    else {
      this.setState({validation:{...this.state.validation, username:{status:true, message:""}}})
    }
  }
  
  validatePassword = () => {
    let {password} = this.state
    if(password.length < 6){
      this.setState({validation:{...this.state.validation, password:{...this.state.validation.password, status: false, message: "short password is not good"}}})
    }
    else {
      this.setState({validation:{...this.state.validation, password: {status: true, message:""}}})
      if(this.state.confirmPassword.length > 0){
        this.validateConfPassword()
      }
    }
  }
  
  validateConfPassword = (call) => {
    let {password, confirmPassword} = this.state
    if(confirmPassword !== password ){
      this.setState({validation:{...this.state.validation, password:{...this.state.validation.password, status:false, confmessage: "do you remember your password?"}}})
    }
    else {
      this.setState({validation:{...this.state.validation, password:{status:true, message:"", confmessage: ""}}})
    }
  }
  
  
  render(){
    return(
      <Form onSubmit={this.handleSubmit} className="auth-form">
        {this.props.signup &&
          <div>
          <h4>{this.props.title}</h4>
          <hr/>
        </div>
        }
        <Input 
          onBlur={this.props.signup && this.validateUsername}
          type="text" 
          placeholder="Username" 
          onChange={e => this.setState({username: e.target.value})}
          />
        <div className="valid-auth">{this.state.validation.username.message}</div>
        <br/>
        <Input
          onBlur={this.props.signup && this.validatePassword}
          type="password" 
          placeholder="Password"
          onChange={e => this.setState({password: e.target.value})}
          />
        <div className="valid-auth">{this.state.validation.password.message}</div>
        <br/>  
        {this.props.signup && (
        <div>  
          <Input
          onBlur={this.validatePassword}
          type="password" 
          placeholder="Confirm Password"
          onChange={e => this.setState({confirmPassword: e.target.value}, () => this.validateConfPassword())}
          />
          <div className="valid-auth">{this.state.validation.password.confmessage}</div>
          <br/>
        </div>  
        )}
        <Button block style={{margin: 0}} className="button-browse">
        {this.state.spinner && <Spinner />}
        {this.props.signup ? "Signup" : "Login"}</Button>
        {this.state.error && <h6 style={{color: 'gray', fontSize: "0.8rem"}}className="text-center pt-2">Wrong Username/Password</h6>}
      </Form>
    )
  }
}

export default AuthForm