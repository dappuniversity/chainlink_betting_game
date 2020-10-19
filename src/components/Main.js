import React, { Component } from 'react';
import dice from '../logos/dice.webp';
import eth from '../logos/eth.png';
import './App.css';

class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5 col-m-4" style={{ maxWidth: '550px' }}>
        <div className="col-sm">
          <main role="main" className="col-lg-12 text-monospace text-center">
            <div className="content mr-auto ml-auto">
              <div id="content" className="mt-3" >
                <h1>Edit App.js</h1>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;