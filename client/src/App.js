import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse1: "", apiResponse2: "", formData: "" };
  }
  
  callAPI() {
    fetch("http://ec2-3-17-134-90.us-east-2.compute.amazonaws.com:9000/testDB")
      .then(res => res.text())
      .then(res => this.setState({ apiResponse1: res }))
      .catch(err => err);
  }

  componentDidMount() {
      this.callAPI();
  }

  
  render() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
	<p className="API-test">API test response: {this.state.apiResponse1}</p>
        <form action="http://ec2-3-17-134-90.us-east-2.compute.amazonaws.com:9000/schedule" method="POST" target="hidden">
           <input type="text" name="schedule" placeholder="data goes here" />
           <input type="submit" value="Submit" />
	</form> 
      </header>
    <iframe name="hidden" width="0" height="0" border="0" />
    </div>
  );
  }
}

export default App;
