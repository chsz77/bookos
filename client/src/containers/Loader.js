import React, { Component } from 'react';

class Loader extends Component {
  state = {progress: 0}
  
  componentDidUpdate(prevProps){
    if(this.props.location !== prevProps.location){
        this.setState({progress: 0});
        this.refs.progress.style.display = 'block'
    }
  }
  
  render(){
    if(this.props.loading === true && this.state.progress < 80)
    {
      setTimeout(()=>this.setState({progress: this.state.progress + 5}), 10)
    } else if (this.props.loading === false && this.state.progress < 100){
      setTimeout(()=>this.setState({progress: this.state.progress + 5}), 10)
    } else if(this.state.progress === 100){
      this.refs.progress.style.display = 'none'
    }
    
    return(
      <div>
        <div className="loader" ref='progress' style={{background: 'red', width: `${this.state.progress}vw`, height: '2px'}}/>
      </div>
    )
  }
}

export default Loader