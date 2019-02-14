import React, {Component} from 'react'
import { Col, Row,
  Container } from 'reactstrap';
// import axios from 'axios';
// import {API} from '../config'


class Dashboard extends Component {
    
    render(){
        return (
            <Container>
                <Row>
                    <Col md="2">
                        <ul>
                        <p>Section</p>
                            <li>Transactions</li>
                            <li>Book Reviewed</li>
                            <li>Profile</li>
                            <li>Admin Panel</li>
                        </ul>
                    </Col>
                    <Col>
                        <div>
                            Hello World
                        </div>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Dashboard