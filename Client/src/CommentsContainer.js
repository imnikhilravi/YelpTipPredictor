import React, { Component } from "react";
import { getComments, comment } from "./utility/highlightsApi";
import CommentsList from "./CommentsList";

class CommentsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newComment: undefined,
      comments: []
    };
  }

  componentDidMount = async props => {
    if (this.props.link) {
      const commentsForRestaurant = await getComments(this.props.link);
      this.setState({
        comments: commentsForRestaurant
      });
    }
  };

  componentWillReceiveProps = async newProps => {
    if (newProps.link && newProps.link !== this.props.link) {
      const commentsForRestaurant = await getComments(newProps.link);
      this.setState({
        comments: commentsForRestaurant
      });
    }
  };

  onSubmit = async e => {
    e.preventDefault();
    if (this.state.newComment) {
      const userComment = await comment(this.state.newComment, this.props.link);
      this.setState({
        comments: [...this.state.comments, userComment]
        
      });
    }
  };

  onCommentChange = e => {
    this.setState({
      newComment: e.target.value
    });
  };

  render() {
    if (!this.props.link || this.props.loading) {
      return <div id="comments">
      </div>
    }
    const comments = [...this.state.comments];
    return <div id = "commentContainer">
      <form onSubmit={this.onSubmit}>
      <label htmlFor="userComment">
        Enter the comments...!
      </label>
        <div className="form-group" >
          <input
            type="text"
            value={this.state.newComment}
            onChange={this.onCommentChange}
            className="form-control"
            id="userComment"
            aria-describedby="trackHelp"
            placeholder="Type your comment here..."
          />
        </div>
        <button id = "commentsbutton" type="submit" className="btn btn-primary">
          Submit
        </button>
        
      </form>
      <br></br>
      <CommentsList commentsList={comments} /></div>;
  }
}

export default CommentsContainer;
