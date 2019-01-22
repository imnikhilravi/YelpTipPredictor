import React, { Component } from "react";



class LoadingContainer extends Component {
    render() {
        if (this.props.loading) {
            return <div id="loading">
                Researching... (This may take a while)
      </div>
        }
        return (
            <div id="loaded" >
            </div>
        );
    }
}

export default LoadingContainer;
