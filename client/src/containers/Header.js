import React, { Component } from 'react';
import {
  Navbar,
  Dropdown, DropdownToggle, DropdownMenu, 
  Row,
  NavItem } from 'reactstrap';
import { Link } from "react-router-dom";
import {setTokenHeader} from '../services'
import Cart from "../components/Cart"
import SearchBar from "../components/SearchBar"
import AuthForm from "../components/AuthForm"
import Waypoint from 'react-waypoint';



class Header extends Component {
  state = {search: "", suggestion:[], timeout: 0, loginOpen: false}
  
  logout = () => {
    localStorage.clear()
    setTokenHeader(false)
    this.props.stateUp()
  }
  
  toggle =() => {
    this.setState(prevState => ({
      loginOpen: !prevState.loginOpen
    }));
  }
  
  makeSolid = () => {
    this.setState({solid: true})
  }
  
  makeTrans = () => {
    this.setState({solid: false})
  }
  
  render() {
    let pathname = this.props.location.pathname
    let solid = this.state.solid
    
    let currentUser = this.props.currentUser
    
    return (
      <div>
        <Navbar className = {
          pathname === "/books" ? 
          (solid ? "header-solid" : "header-trans") : 
          "header-solid"}>
          <Row className="w-100 justify-content-between header">
            <Link className="navbar-brand" to = "/books">Bookos</Link>
            <SearchBar {...this.props}/>
            <Row >
              {currentUser.username ? (
              
              <NavItem className="auth-buttons">
                <Row>
                <Cart currentUser={currentUser}/>
                <button className="signup" onClick={this.logout.bind(this)}>Logout</button>
                </Row>
              </NavItem>
              ) : (
              <NavItem className="auth-buttons">
                <Row>
                  <Dropdown isOpen={this.state.loginOpen} toggle={this.toggle.bind(this)}>
                    <DropdownToggle className="login">
                      Login
                    </DropdownToggle>
                    <DropdownMenu className="login-drop">
                      <AuthForm stateUp={this.props.stateUp}/>
                    </DropdownMenu>
                  </Dropdown>
                  <Link to="/signup">
                    <button className="signup">Sign Up</button>
                  </Link>
                </Row>
              </NavItem>
              )}
             
            </Row>
          </Row>
        </Navbar>
        {!pathname.includes("/books/") &&
        <div className="header-waypoint">
          <Waypoint ref={this.header} onLeave={this.makeSolid.bind(this)} onEnter={this.makeTrans.bind(this)}/>
        </div>
        }
      </div>
    );
  }
}

export default Header