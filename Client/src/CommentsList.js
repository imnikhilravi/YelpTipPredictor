import React, { Component } from "react";
import CommentEntry from "./CommentEntry";

class CommentsList extends Component {
  render() {
    return (
      <div id="commentsList" className="card"> 
        <div id="comments" className="card-header text-white bg-dark mb-3">
          {this.props.commentsList.length} Comments
          </div>
        <ul class = "listofcomments" className="list-group list-group-flush">
          {this.props.commentsList.reverse().map(comment => {
            return <CommentEntry comment={comment} key={comment._id} />;
          })}
        </ul>
      </div>
    );
  }
}

export default CommentsList;