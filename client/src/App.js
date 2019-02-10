import React, {Component} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";

import Index from "./containers/Index.js"
import Browser from "./containers/Browser.js"
import AddBook from "./containers/AddBook.js"
import Checkout from "./containers/Checkout.js"
import Show from "./containers/Show.js"
import Header from "./containers/Header.js"
import Footer from "./containers/Footer.js"
import Authentication from "./containers/Authentication.js"
import jwtDecode from "jwt-decode"
import {setTokenHeader} from "./services"
import {StripeProvider} from 'react-stripe-elements';

class App extends Component{
  state = {currentUser: {}, render: false}
  
  componentDidMount(){
    this.setCurrentUser()
  }
  
  stateUp = () => {
    this.setCurrentUser()
  }
  
  setCurrentUser = () => {
    let token = localStorage.jwtToken
    if(token){
      setTokenHeader(token)
      let currentUser = jwtDecode(token)
      this.setState({currentUser, render: true})
    }
    else {
      this.setState({currentUser:{}, render: true})
    }
    
  }
  
  render(){
    return(
      <StripeProvider apiKey="pk_test_DpfDJqPU85kQpKKBqe7JlVSL">
        <Router>
          {this.state.render && 
          <div>
            <Route component={props => (<Header currentUser={this.state.currentUser} stateUp={this.stateUp.bind(this)}{...props}/>)}/>
            <Switch>
              <Route exact path='/' render={() => (<Redirect to="/books"/>)}/>
              <Route exact path='/books' render={props => (<Index {...props}/>)}/>
              <Route exact path='/books/browse' render={props => (<Browser {...props}/>)}/>
              <Route exact path='/books/new' render={AddBook}/>
              <Route exact path='/signin' render={props => (<Authentication {...props} stateUp={this.stateUp.bind(this)} currentUser={this.state.currentUser}/>)}/>
              <Route exact path='/signup' render={props => (<Authentication {...props} stateUp={this.stateUp.bind(this)} signup currentUser={this.state.currentUser}/>)}/>
              <Route exact path='/checkout' render={props => (<Checkout {...props} currentUser={this.state.currentUser}/>)}/>
              <Route exact path='/books/:book_id' render={props => (<Show {...props} currentUser={this.state.currentUser}/>)}/>)}/>
            </Switch>
            <Footer/>
          </div>
          }
        </Router>
      </StripeProvider>
    )
  }
}



















export default App;
