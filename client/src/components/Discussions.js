import React, { Component } from 'react';
import axios from 'axios';
import {API} from '../config.js';
import {
  ListGroup, 
  ListGroupItem } from 'reactstrap';
import Waypoint from 'react-waypoint';

class Discussions extends Component {
  state = {discussions:[], limit:5, offset:0}
  
  componentDidMount(){
    this.loadDiscussions(this.state.limit, this.state.offset)
  }
  
  loadMoreDiscussions = () => {
    let offset = this.state.offset + this.state.limit
    let limit = this.state.limit
    this.loadDiscussions(limit, offset)
    this.setState({offset})
  }
  
  loadDiscussions(limit, offset){
    let book_id = this.props.match.params.book_id
    axios.get(`${API}/discussions/${book_id}/${limit}/${offset}`)
      .then(res => {
        let discussions = res.data.data
        if(discussions.length === 0){
          this.refs.more.remove()
        }
        this.setState({discussions: [...this.state.discussions, ...discussions]})
      })
  }
  
  render(){
    const discussions = this.state.discussions.map(discussion => (
      <ListGroupItem key={discussion.discussion_id}>
        <p>{discussion.text}</p>
        <p>{discussion.created_at}</p>
      </ListGroupItem>
    ))
    
    return(
      <ListGroup flush>
        {discussions}
        <div className='text-center' ref='more'><Waypoint onEnter={this.loadMoreDiscussions}/><h6>Loading...</h6></div>
      </ListGroup>
    )
  }
}

export default Discussions