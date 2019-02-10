import React, {Component} from "react";
import AuthForm from "../components/AuthForm"
import {Container, Col} from "reactstrap"


class Authentication extends Component{
    render(){
        return (
            <Container>
                <Col md={{size: 5, offset: 3}} className="authentication">
                <AuthForm {...this.props} stateUp={this.props.stateUp} signup={this.props.signup} title={this.props.signup ? "Sign Up" : "Log In"}/>
                </Col>
            </Container>
        )
    }
}

export default Authentication