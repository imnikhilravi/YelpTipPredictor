import React from "react";



function CommentEntry({ comment }) {
  return <li class ="list-group-item"> 
  <div class = "commentData" >
    <p id = "commentdate" >{comment.date.replace('T',' ').substring(0,comment.date.lastIndexOf('.'))}</p>
      <p>{comment.text}</p>
  </div>
  </li>
}

export default CommentEntry;
