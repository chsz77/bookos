import React from 'react';
import BookRow from "./BookRow"

const BookRecommendation = (props) => {
  let rowstyle = {display: 'flex', flexWrap:'wrap'}
  let style = { width: '100%'}
  
  return(
    <div style={style}>
      <h5>You may also like</h5>
      <BookRow 
        limit="10" 
        rowstyle={rowstyle} 
        column="4" 
        styling="book-reco" 
        type="popular"
        book_filter={props.book_filter}
        tooltip="tooltip"
        keyword={props.keyword && props.keyword.replace(/[|]/g, " ")}/>
    </div>
    
  )   
}

export default BookRecommendation