import React, { Component } from "react";
import Header from "../Header/";
import P5Wrapper from "../P5Wrapper/";

export default class App extends Component {
  // Constructor ---------------------------------------------------------------
  constructor() {
    super();

    this.state = {
      p5Props: {
        status: ""
      }
    };
  }

  onReady = () => this.setState({ status: "ready" });

  // Main renderer -------------------------------------------------------------
  render() {
    return (
      <div className="app">
        {/* Header --------------------------------------------------------- */}
        {/* <Header /> */}

        {/* Main content --------------------------------------------------- */}
        <div className="canvas-container" id="canvas-container">
          {/* p5.js sketch ------------------------------------------------- */}
          <P5Wrapper {...this.state.p5Props} onReady={this.onReady} />
        </div>
      </div>
    );
  }
}
