import React, { Component } from 'react';
import axios from 'axios';
import {API} from '../config.js';
import {
  ListGroup, 
  ListGroupItem, Input } from 'reactstrap';
// import Waypoint from 'react-waypoint';
import Spinner from './Spinner'
import Moment from "react-moment";
import Waypoint from 'react-waypoint';

class Discussions extends Component {
  state = {discussions:[], limit:5, offset:0, form:{text: "", minRows:2, maxRows: 10, rows:2}, spinner: false}
  
  componentDidMount(){
    this.loadDiscussions(this.state.limit, this.state.offset)
  }
  
  loadMoreDiscussions = () => {
    if(this.state.discussions.length > 0){
      let book_id = this.props.match.params.book_id
      let offset = this.state.offset + this.state.limit
      let limit = this.state.limit
      axios.get(`${API}/discussions/${book_id}?limit=${limit}&offset=${offset}`)
        .then(res => {
          let discussions = res.data.data
          if(discussions.length === 0){
            this.refs.more.style.display = 'none'
          }
          this.setState({discussions: [...this.state.discussions, ...discussions], offset})
        })
    }
  }
  
  componentDidUpdate(prevProps, prevState){
      if(this.props.match){
        let book_id = this.props.match.params.book_id
        let prevBook_id = prevProps.match.params.book_id
        if(book_id !== prevBook_id){
          this.loadDiscussions(5, 0);
        }
      }
    }
  
  loadDiscussions(limit, offset){
    
    let book_id = this.props.match.params.book_id
    axios.get(`${API}/discussions/${book_id}?limit=${limit}&offset=${offset}`)
      .then(res => {
        let discussions = res.data.data
          this.setState({discussions: discussions})
      })
  }
  
  handleSubmit = e => {
    e.preventDefault()
    let book_id = this.props.match.params.book_id
    let user_id = this.props.currentUser.user_id
    if(!user_id){
      this.props.history.push("/signup")
    }
    else if(this.state.form.text.length > 0){
      
      this.setState({spinner: true})
      axios.post(`${API}/discussions/${book_id}/${user_id}`, this.state.form)
        .then(res => {
          if(res.data.status === "success"){
            let newDisc = res.data.data
            console.log(newDisc)
            this.setState({discussions: [newDisc,...this.state.discussions]})
            //need more elegant
            // this.loadDiscussions(5, 0)
            this.setState({form: {text: "", rows: 2}, spinner: false})
          }
        })
        .catch(()=> this.setState({spinner: false}))
    }
  }
  
  handleDelete = (discussion_id) => {
    this.setState({delSpinner: discussion_id})
    axios.delete(`${API}/discussions/${discussion_id}`)
      .then(res => {
        discussion_id = Number(res.data.data)
        this.setState({discussions: this.state.discussions.filter(disc => disc.discussion_id !== discussion_id)})
        this.setState({delSpinner: discussion_id})
      })
  }
  
  handleChange = (e) => {
		let textareaLineHeight = 24;
		let { minRows, maxRows } = this.state.form;
		
		let previousRows = e.target.rows;
  	e.target.rows = minRows;
		
		let currentRows = ~~(e.target.scrollHeight / textareaLineHeight);
    
    if (currentRows === previousRows) {
    	e.target.rows = currentRows
    }
		
		if (currentRows >= maxRows) {
			e.target.rows = maxRows;
			e.target.scrollTop = e.target.scrollHeight;
		}
    
  	this.setState({form:{
  	  ...this.state.form,
  	  text: e.target.value,
      rows: currentRows < maxRows ? currentRows : maxRows,
    }});
	};
	
  
  
  render(){
    const discussions = this.state.discussions.map(discussion => (
      <ListGroupItem key={discussion.discussion_id} className="disc-item">
        {this.props.currentUser.user_id === discussion.user_id &&
        <span className="quest-delete">
          <span 
            style={{cursor: "pointer"}}
            onClick={this.handleDelete.bind(this, discussion.discussion_id)}>&times;</span>
          {this.state.delSpinner === discussion.discussion_id &&
            <Spinner/>
          }
        </span>
        }
        <div style={{fontSize: "0.9rem"}}><strong>{discussion.username || "user-placeholder"} &middot; </strong><span><Moment fromNow>{discussion.created_at}</Moment></span></div>
        <div style={{fontSize: "0.95rem"}} className="pt-2">{discussion.text}</div>
        <span onClick={()=>alert("Under Construction")}className="text-muted pt-2" style={{cursor: "pointer", fontSize: "0.75rem"}}>reply</span>
      </ListGroupItem>
    ))
    
    return(
      <div>
        <form className="discussion-form" onSubmit={this.handleSubmit}>
          <Input type='textarea'
            rows={this.state.form.rows}
            value={this.state.form.text}
            onChange={this.handleChange}
            placeholder="Have any questions?"/>
          <div>
            <button className="discform-submit">Submit</button>
          </div>
          {this.state.spinner && 
            <Spinner/>
          }
        </form>
        <ListGroup flush>
          {discussions}
        </ListGroup>
        {this.state.discussions.length !== 0 && (
        <div className='text-center pt-4'ref='more'>
          <Waypoint onEnter={this.loadMoreDiscussions.bind(this)}/>
            <h6>Loading...</h6>
        </div>
        )}
      </div>  
    )
  }
}

export default Discussions