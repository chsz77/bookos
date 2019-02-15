import React, {Component} from 'react'
import {
  Form, Input } from 'reactstrap';
import axios from 'axios';
import {API} from '../config';
import Rating from 'react-rating';
import Spinner from './Spinner'

class ReviewForm extends Component{
    state = {text: "", value:0, closed: false, spinner: false,}
    
    closeFrom = () => {
        this.setState({closed: true})
        setTimeout(()=>this.props.toggle(), 500)
    }
    
    componentDidMount(){
        if(this.props.edit){
            let book_id = this.props.book_id
            let user_id = this.props.userId
            axios.get(`${API}/reviews/users/${user_id}?book=${book_id}`)
                .then(res => {
                    let text = res.data.data[0].text
                    let value = res.data.data[0].rating
                    this.setState({text, value})
                })
        } 
    }
    
    handleSubmit = e => {
        if(this.state.text.length > 0){
            this.setState({spinner: true})
            let book_id = this.props.book_id
            let user_id = this.props.userId

            if(this.props.edit){
                let review_id = this.props.review_id
                axios.put(`${API}/reviews/${review_id}`, this.state)
                    .then(res => {
                        if(res.data.status === "success"){
                            this.setState({spinner: false})
                            this.props.fetchReviews()
                            this.closeFrom(e)
                        }
                    })
                    .catch(() => this.setState({spinner: false}))
                } else
            axios.post(`${API}/reviews/${book_id}/${user_id}`, this.state)
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
                    <span>
                    <span style={{fontWeight:"bold", cursor: "pointer", color: "red"}} onClick={this.props.deleteReview}>Delete</span>
                    {" | "}<span style={{fontWeight:"bold", cursor: "pointer"}}
                        onClick={this.handleSubmit}>Submit</span>
                    </span>    
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
