import React, {Component} from 'react'
import {
  Form, Input } from 'reactstrap';
import axios from 'axios';
import {API} from '../config';
import Rating from 'react-rating';
import Spinner from './Spinner'

class ReviewForm extends Component{
    state = {text: "", value:0, closed: false, spinner: false}
    
    closeFrom = () => {
        this.setState({closed: true})
        setTimeout(()=>this.props.toggle(), 500)
    }
    
    handleSubmit = e => {
        if(this.state.text.length > 0){
            this.setState({spinner: true})
            let book_id = this.props.book_id
            let user_id = this.props.userId
            axios.post(`${API}/books/${book_id}/reviews/${user_id}`, this.state)
                .then(res => {
                    if(res.data.status === "success"){
                        this.props.loadNewReview(res.data.data)
                        this.props.fetchBook()
                        this.setState({spinner: false})
                        this.closeFrom(e)
                    }
                })
                .catch(() => this.setState({spinner: false}))
        }
    }
    
    render(){
        return(
            <Form onSubmit={e => e.preventDefault()}
                className={this.state.closed ? "revform-closed review-form" : "review-form"} >
                {this.state.spinner && <Spinner/>}               
                <div className="form-header">
                    <button onClick={this.closeFrom}>Cancel</button>
                    <Rating 
                        emptySymbol="far fa-star"
                        fullSymbol="fas fa-star"
                        onClick={(value)=> this.setState({value: value*10})}
                        initialRating={this.state.value/10}
                    />
                    <span style={{fontWeight:"bold", cursor: "pointer"}}
                        onClick={this.handleSubmit}>Submit</span>
                </div>    
                <div>    
                    <Input value={this.state.text} 
                        onChange={e => this.setState({text: e.target.value})}
                        type="textarea" rows="13" placeholder="How is the book?"/>
                </div>
                
            </Form>
        )
    }
}

export default ReviewForm
