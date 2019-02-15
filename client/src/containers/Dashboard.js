import React, {Component} from 'react'
import { Col, Row,
  Container, Table } from 'reactstrap';
import axios from 'axios';
import {API} from '../config'
import {Link} from 'react-router-dom'
import ReviewForm from '../components/ReviewForm'


class Dashboard extends Component {
    state = {transactions:[], transItems: [], reviews:[], 
        book_id: "", review_id: "", review_form: false,
        modal:false, loading: false, activeSection: "Transactions"}
    
    componentDidMount(){
        this.fetchTransactions()
        this.fetchReviews()
    }
    
    fetchTransactions = () => {
        let user_id = this.props.currentUser.user_id
        axios.get(`${API}/users/${user_id}/transactions`)
            .then(res => {
                let transactions = res.data.data
                this.setState({transactions})
            })
    }
    
    fetchTransItems = (pay_id) => {
        this.setState({modal: true, loading: true})
        let user_id = this.props.currentUser.user_id
        axios.get(`${API}/users/${user_id}/transactions/${pay_id}`)
            .then(res => {
                let transItems = res.data.data
                this.setState({transItems, loading: false})
            })
    }
    
    fetchReviews = () => {
        let user_id = this.props.currentUser.user_id
        axios.get(`${API}/reviews/users/${user_id}`)
            .then(res => {
                let reviews = res.data.data
                this.setState({reviews})
            })
    }
    
    toggleForm = e => {
        this.setState({showForm: !this.state.showForm})
      }
    
    
    deleteReview = (review_id) => {
        axios.delete(`${API}/reviews/${review_id}`)
            .then(res => {
                this.setState({reviews:this.state.reviews.filter(review => review.review_id !== review_id)})
            })
    }
    
    render(){
        const transactions = this.state.transactions.map((trans, i) => (
            <tr key={i}>
                <th scope="row">{i+1}</th>
                <td 
                    style={{cursor: "pointer", color: "#007bff"}}
                    onClick={this.fetchTransItems.bind(this, trans.pay_id)}>{trans.pay_id}</td>
                <td>${trans.ship_cost}</td>
                <td>${trans.cart_total}</td>
                <td>{trans.ship_address}</td>
                <td>{trans.created_at}</td>
            </tr>
        ))
        
        const transItems = this.state.transItems.map((item, i) => (
            <tr key={i}>
                <th scope="row">{i+1}</th>
                <td><img style={{height: "100px", width: "75px"}}src={item.image_url} alt={item.title}/></td>
                <td>{item.title}</td>
                <td>{"$" + item.price}</td>
            </tr>
        ))
        
        const transItemsList = this.state.modal && !this.state.loading &&
                    <div className="trans-info">
                    <span onClick={()=>this.setState({modal: false})}>&times;</span>
                    <Table>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Cover</th>
                            <th>Title</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                            {transItems}
                        </tbody>
                    </Table>
                    </div>
                
        
        const tranSection = this.state.activeSection === "Transactions" && 
                        <Col>
                            <h6>Your Transactions</h6>
                            <hr/>
                            <Table bordered>
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>Pay ID</th>
                                    <th>Shipping</th>
                                    <th>Total</th>
                                    <th>Address</th>
                                    <th>Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                    {transactions}
                                </tbody>
                            </Table>
                        </Col>
        
        const reviews = this.state.reviews.map((review, i) => (
            <tr key={i}>
                <th scope="row">{i+1}</th>
                <td><img style={{height: "100px", width: "75px"}}src={review.image_url} alt={review.title}/></td>
                <td>{review.text.length > 100 ? (review.text.substring(0,100)+"...") : review.text}</td>
                <td>{Number(review.rating)/10}</td>
                <td><Link to={`/books/${review.book_id}`}>{review.title}</Link></td>
                <td>{review.created_at}</td>
                <td>
                <span 
                style={{cursor: "pointer", color: "red"}}
                onClick={this.deleteReview.bind(this, review.review_id)}>
                Delete
                </span>
                <hr/>
                <span  
                style={{cursor: "pointer", color: "#007bff"}}
                onClick={()=>this.setState({book_id: review.book_id, 
                showForm: true,
                review_id: review.review_id})}>Edit</span></td>
            </tr>    
        ))
        
        const revSection = this.state.activeSection === "Reviews" &&
                        <Col> 
                            <h6>Reviews</h6>
                            <hr/>
                            <Table>
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>Cover</th>
                                    <th>Reviews</th>
                                    <th>Rating</th>
                                    <th>Book</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                    {reviews}
                                </tbody>
                            </Table>
                        </Col>
        
        let sections = ["Transactions", "Reviews", "Profile", "Admin"]
        
        let sectionsList = sections.map(section => (
          <li key={section} onClick={()=>this.setState({activeSection: section})} 
          className={section.toUpperCase() === this.state.activeSection.toUpperCase() ? 
          "sort-active genres-list" : "genres-list"}>
          {section}</li>
        ))
        
        if(!this.props.currentUser.user_id){
          this.props.history.push("/books")
        }
        
        return (
            <Container style={{fontSize: "0.8rem"}}>
                <Row>
                    <Col md="2">
                        <ul style={{fontSize: "0.9rem", marginTop: "30px", 
                            paddingRight: "30px",
                            borderRight: "solid 1px lightgrey"}}>
                        <p><strong>Section</strong></p>
                            {sectionsList}
                        </ul>
                    </Col>
                        {tranSection}
                        {revSection}
                </Row>
                {transItemsList}
                
                {this.state.showForm &&
                <ReviewForm edit 
                    userId={this.props.currentUser.user_id} review_id={this.state.review_id}
                    toggle={this.toggleForm.bind(this)}
                    book_id={this.state.book_id}
                    fetchReviews={this.fetchReviews.bind(this)}
                    />
                }
            </Container>
        )
    }
}

export default Dashboard