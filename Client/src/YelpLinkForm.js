import React, { Component } from "react";

class YelpLinkForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: "",
    };
  }

  onSubmit = e => {
    e.preventDefault();
    if (this.state.link) {
      this.props.onScan(this.state.link);
    }
  };

  onLinkChange = e => {
    this.setState({
      link: e.target.value
    });
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} id = "searchForm">
        <div className="form-group">
          <label htmlFor="restaurantLink">
            Enter the Yelp link for the restaurant you want to dine at...
          </label>
          <input
            type="text"
            value={this.state.link}
            onChange={this.onLinkChange}
            className="form-control"
            id="restaurantLink"
            aria-describedby="trackHelp"
            placeholder="Yelp Restaurant Link..."
          />
        </div>
        <button id = "searchbutton" type="submit" className="btn btn-primary">
          Go!
        </button>
      </form>
    );
  }
}

export default YelpLinkForm;
