import React, { Component } from "react";
import HighlightsContainer from "./HighlightsContainer";
import CommentsContainer from "./CommentsContainer";
import LoadingContainer from "./LoadingContainer";

import "./App.css";
import YelpLinkForm from "./YelpLinkForm";

const divStyle = {
  left: '200px',
  margin: '80px'
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: "",
      loading: false
      
    };
  }

  onScan = (link) => {
    this.setState({
      link: link,
      loading: true

    });
  };

  onLoadComplete = () => {
    this.setState({
      loading: false
    });
  }

  render() {
    return (
      <div className="App" >
        <div className="container">
          <div id="link" style={divStyle}>
            <YelpLinkForm onScan={this.onScan} />
          </div>
          <div id="loading">
            <LoadingContainer
              loading={this.state.loading}
            />
          </div>
          <div id="highlights">
            <HighlightsContainer
              link={this.state.link} onLoadComplete={this.onLoadComplete} loading={this.state.loading}
            />
          </div>
          <div id="comments">
            <CommentsContainer
              link={this.state.link} loading={this.state.loading}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
