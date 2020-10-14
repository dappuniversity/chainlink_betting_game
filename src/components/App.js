import React, { Component } from 'react';
import logo from '../logo.png';
import eth from '../eth.png';
import dice from '../dice.png';
import dice_rolling from '../dice_rolling.gif';
import './App.css';
import Web3 from 'web3'

/**
 [x] Add View from defi_tutorial
 [x] call game:
    [x] approve to spend ether
 [x] add balance
 [x] read amount from heading
 [x] make loading
*/

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
  
    const contract_abi = [{"inputs": [],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "sender","type": "address"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "Received","type": "event"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "uint256","name": "id","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "bet","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"},{"indexed": false,"internalType": "address","name": "player","type": "address"},{"indexed": false,"internalType": "uint256","name": "winAmount","type": "uint256"}],"name": "Result","type": "event"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "address","name": "admin","type": "address"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "Withdraw","type": "event"},{"inputs": [],"name": "admin","outputs": [{"internalType": "address payable","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "bet","type": "uint256"}],"name": "game","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "payable","type": "function"},{"inputs": [],"name": "gameId","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "games","outputs": [{"internalType": "uint256","name": "id","type": "uint256"},{"internalType": "uint256","name": "bet","type": "uint256"},{"internalType": "uint256","name": "amount","type": "uint256"},{"internalType": "address payable","name": "player","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "lastGameId","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "bytes32","name": "","type": "bytes32"}],"name": "nonces","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "randomResult","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "bytes32","name": "requestId","type": "bytes32"},{"internalType": "uint256","name": "randomness","type": "uint256"}],"name": "rawFulfillRandomness","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "bytes32","name": "_keyHash","type": "bytes32"},{"internalType": "uint256","name": "_fee","type": "uint256"},{"internalType": "uint256","name": "_seed","type": "uint256"}],"name": "requestRandomness","outputs": [{"internalType": "bytes32","name": "requestId","type": "bytes32"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "random","type": "uint256"}],"name": "verdict","outputs": [],"stateMutability": "payable","type": "function"},{"inputs": [{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "withdrawEther","outputs": [],"stateMutability": "payable","type": "function"},{"inputs": [],"name": "withdrawLink","outputs": [],"stateMutability": "nonpayable","type": "function"},{"stateMutability": "payable","type": "receive"}]
    const contract_address = '0x52440F212c6d54eCa7623e28219329f399af18F7' //kovan
    const contract = new web3.eth.Contract(contract_abi, contract_address);

    const balance = await web3.eth.getBalance(this.state.account)
    this.setState({ balance: balance })
    this.setState({ contract: contract })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  makeBet(bet, amount){
    this.state.contract.methods.game(bet).send({from: this.state.account, value: amount}).on('transactionHash', (hash) => {
      this.setState({ loading: true })
      this.state.contract.events.Result({}, (error, event) => {
        const verdict = event.returnValues.winAmount
        if(verdict == '0') {
          window.alert('lose :(')
        } else {
          window.alert('WIN!')
        }
        this.setState({ loading: false })
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      balance: 0,
      contract: null,
      amount: 0,
      event: null,
      loading: false
    }
  }

  render() {
    console.log('xxxx: ', this.state.event)
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow text-monospace">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dapp University
          </a>
        </nav>
        { this.state.loading 
          ? <div id="loader" className="text-center mt-5">
              <a
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={dice_rolling} className="App-logo" alt="logo" />
              </a>            
            </div>
          : <div className="container-fluid mt-5">
              <div className="row">
                <main role="main" className="col-lg-12 d-flex text-monospace text-center">
                  <div className="content mr-auto ml-auto">
                    <div id="content" className="mt-3">
                      <div className="card mb-4" >
                        <div className="card-body">
                        <div>
                          <a
                              href="http://www.dappuniversity.com/bootcamp"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                            <img src={dice} height='128' alt="logo" />
                          </a>
                        </div>
                          <div>
                            <label className="float-left"><b>Bet Amount</b></label>
                          </div>
                          <div className="input-group mb-4">
                            <input
                              type="text"
                              className="form-control form-control-lg"
                              placeholder="0"
                              onChange={(e) => this.setState({amount: window.web3.utils.toWei(e.target.value)})}
                              required
                            />
                            <div className="input-group-append">
                              <div className="input-group-text">
                                <img src={eth} height='32' alt=""/>ETH
                              </div>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="btn btn-danger btn-lg"
                            onClick={(event) => {
                              event.preventDefault()
                              this.makeBet(0, 7)
                            }}>
                              Low
                          </button>
                          &nbsp;&nbsp;&nbsp;
                          <button
                            type="submit"
                            className="btn btn-success btn-lg"
                            onClick={(event) => {
                              event.preventDefault()
                              this.makeBet(1, this.state.amount)
                            }}>
                              High
                          </button>
                        </div>
                        <div>
                          <span className="float-right text-muted">
                            Balance: {Number(window.web3.utils.fromWei((this.state.balance).toString())).toFixed(5)} ETH &nbsp;&nbsp;
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
        }
      </div>
    );
  }
}

export default App;
