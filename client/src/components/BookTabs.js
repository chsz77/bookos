import React, { Component } from 'react';
import Reviews from "./Reviews"
import Discussions from "./Discussions"

import {
  TabContent,
  TabPane,
  Col, 
  Row,
  Nav,
  NavItem,
  NavLink} from 'reactstrap';

class BookTabs extends Component {
  state = {activeTab: '1'}
  
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  render(){
    let style = {paddingLeft: '70px'}
    return(
      <Row className="book-tab">
        <Col style={style} >
          <Nav tabs>
            <NavItem>
              <NavLink className={this.state.activeTab === '2' ? "" : "active"} onClick={this.toggle.bind(this, '1')}>
                Reviews
              </NavLink>  
            </NavItem>
            <NavItem>
              <NavLink className={this.state.activeTab === '1' ? "" : "active"} onClick={this.toggle.bind(this, '2')}>
                Questions
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col sm="12">
                  <Reviews {...this.props}/>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="12">
                  <Discussions {...this.props}/>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    )
  }
}

export default BookTabs