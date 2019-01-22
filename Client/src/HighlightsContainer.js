import React, { Component } from "react";
import { getHighlights } from "./utility/highlightsApi"
import HighlightItemEntry from "./HighlightItemEntry"

const sortHighlights = (highlights) => {
  let top3Highlights = {};
  let bottom3Highlights = {};
  const items = Object.keys(highlights).map(highlight => {
    return [highlight, highlights[highlight]];
  });
  items.sort((first, second) => {
    return second[1] - first[1];
  });
  const top3Items = items.slice(0, 3);
  const bottom3Items = items.slice(-3);
  top3Items.forEach(item => {
    top3Highlights[item[0]] = highlights[item[0]];
  });
  bottom3Items.forEach(item => {
    bottom3Highlights[item[0]] = highlights[item[0]];
  });
  return { 'top3Highlights': top3Highlights, 'bottom3Highlights': bottom3Highlights };
}

class HighlightsContainer extends Component {
  constructor(props) {
    
    super(props);
    this.state = {
      top3Items: {},
      bottom3Items: {},
      selectedItem: undefined
    };
  }

  onHighlightItemSelect = (item, e) => {
    e.preventDefault();
    this.setState({ 
      selectedItem: item
    });
  };

  componentDidMount = async props => {
    if (this.props.link) {
      let highlights = await getHighlights(this.props.link, false);
      highlights = sortHighlights(highlights);
      if (highlights)
      this.props.onLoadComplete();
      this.setState({
        top3Items: highlights.top3Highlights,
        bottom3Items: highlights.bottom3Highlights,
        selectedItem: undefined
      });
    }
  };

  componentWillReceiveProps = async newProps => {
    if (newProps.link && newProps.link !== this.props.link) {
      let highlights = await getHighlights(newProps.link, false);
      highlights = sortHighlights(highlights);
      if (highlights)
      this.props.onLoadComplete();
      this.setState({
        top3Items: highlights.top3Highlights,
        bottom3Items: highlights.bottom3Highlights,
        selectedItem: undefined
      });
    }
  };

  render() {
    if (!this.props.link || this.props.loading) {
      return <div id="highlights">
      </div>
    } 
    return (
      <div id="highlightsList" className="card text-center ">
      <div class="grid-container">
      <div id = "goodcontainer" className="card-header text-black bg-success mb-3">
        Things that are good :)
        </div>
        <div class="col-12 col-md-9">
                <div class="row">
          {Object.keys(this.state.top3Items).map((item,i)  => {
            return <HighlightItemEntry onHighlightItemSelect={this.onHighlightItemSelect} link={this.props.link} highlightItem={{ 'name': item, 'index': i }} key={item} />;
          })}
        </div>
        </div>
        <div id = "badcontainer" className="card-header text-white bg-danger mb-3">
        Things that are bad :(
        </div>
        <div className="col-8 col-md-9">
                <div className="row">
          {Object.keys(this.state.bottom3Items).map((item, i) => {
            return <HighlightItemEntry onHighlightItemSelect={this.onHighlightItemSelect} link={this.props.link} highlightItem={{ 'name': item, 'index': i+3 }} key={item} />;
          })}
        </div>
        </div>
       <br></br>
       <br></br>
       <br></br>  
      </div>
      </div>
    );
  }
}

export default HighlightsContainer;
