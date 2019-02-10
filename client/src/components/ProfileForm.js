import React, {Component} from "react"
import {FormGroup, Input, Label} from "reactstrap"


class ProfileForm extends Component{
    state = {name: "", phone: "", email: "", address:""}
    
    componentDidMount(){
        if(this.props.profile.name){
            let {profile} = this.props
            this.setState({
                name: profile.name,
                phone: profile.phone,
                email: profile.email,
                address: profile.address
            })
        }
    }
    
    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value}, ()=>this.props.stateUp(this.state))
    }
    
    render(){
        let {name, phone, email, address} = this.state
        
        return(
            <div>
                <FormGroup>
                  <Label for="title">Name</Label>
                  <Input 
                    type="text" name="name" value={name} 
                    onChange={this.handleChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                  <Label for="title">Phone Number</Label>
                  <Input type="text" name="phone" value={phone} 
                  onChange={this.handleChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                  <Label for="title">E-mail</Label>
                  <Input type="text" name="email" value={email} 
                  onChange={this.handleChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                  <Label for="author">Shipping Address</Label>
                  <Input type="textarea" name="address" value={address} 
                  onChange={this.handleChange.bind(this)}/>
                </FormGroup>
            </div>
        
        )
    }
}


export default ProfileForm