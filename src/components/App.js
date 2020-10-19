import React, { Component } from 'react';
import Loading from './Loading'
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3'
import './App.css';

class App extends Component {
  
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    //code...
  }

  async loadWeb3() {
    //code...
  }

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <div>
        <Navbar/>&nbsp;
        <Main/>
      </div>
    );
  }
}

export default App;