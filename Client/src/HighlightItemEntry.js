import React, { Component } from "react";
import { vote } from "./utility/highlightsApi";

class HighlightItemEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: "",
      upVotes: 0,
      downVotes: 0,
      indexDict: {
        "0": "Best",
        "1": "Better",
        "2": "Good",
        "3": "Worst",
        "4": "Worse",
        "5": "Bad"
      },
      imagesDict: {
        "0": require("./Best.png"),
        "1": require("./Better.png"),
        "2": require("./Good.png"),
        "3": require("./Worst.png"),
        "4": require("./Worse.png"),
        "5": require("./Bad.png")
      }
    };
  }

  componentDidMount = async props => {
    if (this.props.link && this.props.highlightItem) {
      let votes = {};
      votes.upVotes = 0;
      votes.downVotes = 0;
      this.setState({
        item: this.props.highlightItem,
        upVotes: votes.upVotes,
        downVotes: votes.downVotes
      });
    }
  };

  componentWillReceiveProps = async newProps => {
    if (newProps.link && newProps.link !== this.props.link && newProps.highlightItem !== this.props.highlightItem) {
      let votes = {};
      votes.upVotes = 0;
      votes.downVotes = 0;
      this.setState({
        item: newProps.highlightItem,
        upVotes: votes.upVotes,
        downVotes: votes.downVotes
      });
    }
  };

  onVote = async (value, e) => {
    e.preventDefault();
    const votes = await vote(value, this.props.link, this.state.item);
    console.log(votes);
    this.setState({
      upVotes: votes.upVotes,
      downVotes: votes.downVotes
    })
  }

  render() {
    return (<div id = "items" className="col-sm-12 col-md-6 col-lg-4">
      <div className="card text-center" onClick={(e) => { this.props.onHighlightItemSelect(this.state.item, e) }}>
        <div className="card-header text-white bg-dark mb-3" >
          {this.state.indexDict[this.state.item.index]}
        </div>
        <img className="card-img-top" src={this.state.imagesDict[this.state.item.index]} alt={this.state.indexDict[this.state.item.index]}></img>
        <br></br>
        <div className="card-body text-center bg-dark text-white" style = {{"fontSize": "15px"}}>
          <p className="card-text">
            {this.state.item.name}
          </p>
        </div>
        <br></br>
      </div>
    </div>
    );
  }
}

export default HighlightItemEntry;
