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
    const web3 = window.web3
    const networkId = await web3.eth.net.getId()

    if(networkId!==4){
      window.alert('Please switch network to the Rinkeby and refresh the page')
    }
  
    const contract_abi = [{"inputs": [],"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "sender","type": "address"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "Received","type": "event"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "uint256","name": "id","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "bet","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "randomSeed","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"},{"indexed": false,"internalType": "address","name": "player","type": "address"},{"indexed": false,"internalType": "uint256","name": "winAmount","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "randomResult","type": "uint256"},{"indexed": false,"internalType": "uint256","name": "time","type": "uint256"}],"name": "Result","type": "event"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "address","name": "admin","type": "address"},{"indexed": false,"internalType": "uint256","name": "amount","type": "uint256"}],"name": "Withdraw","type": "event"},{"inputs": [],"name": "admin","outputs": [{"internalType": "address payable","name": "","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "bet","type": "uint256"},{"internalType": "uint256","name": "seed","type": "uint256"}],"name": "game","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "payable","type": "function"},{"inputs": [],"name": "gameId","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "games","outputs": [{"internalType": "uint256","name": "id","type": "uint256"},{"internalType": "uint256","name": "bet","type": "uint256"},{"internalType": "uint256","name": "seed","type": "uint256"},{"internalType": "uint256","name": "amount","type": "uint256"},{"internalType": "address payable","name": "player","type": "address"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "lastGameId","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "bytes32","name": "","type": "bytes32"}],"name": "nonces","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [],"name": "randomResult","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "bytes32","name": "requestId","type": "bytes32"},{"internalType": "uint256","name": "randomness","type": "uint256"}],"name": "rawFulfillRandomness","outputs": [],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "bytes32","name": "_keyHash","type": "bytes32"},{"internalType": "uint256","name": "_fee","type": "uint256"},{"internalType": "uint256","name": "_seed","type": "uint256"}],"name": "requestRandomness","outputs": [{"internalType": "bytes32","name": "requestId","type": "bytes32"}],"stateMutability": "nonpayable","type": "function"},{"inputs": [{"internalType": "uint256","name": "random","type": "uint256"}],"name": "verdict","outputs": [],"stateMutability": "payable","type": "function"},{"inputs": [{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "withdrawEther","outputs": [],"stateMutability": "payable","type": "function"},{"inputs": [{"internalType": "uint256","name": "amount","type": "uint256"}],"name": "withdrawLink","outputs": [],"stateMutability": "nonpayable","type": "function"},{"stateMutability": "payable","type": "receive"}]
    const contract_address = '0xCf638b0B6A6F1a483792025d2349E77C33c04E7C' //rinkeby
    
    const contract = new web3.eth.Contract(contract_abi, contract_address);
    this.setState({ contract: contract })

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const balance = await web3.eth.getBalance(this.state.account)
    this.setState({ balance: balance })

    const maxBet = await web3.eth.getBalance(contract_address)
    this.setState({ maxBet: maxBet })
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

  makeBet(bet, amount) {
    //randomSeed will be component of which final random value will be generated
    var randomSeed = Math.floor(Math.random() * Math.floor(1e9))
    this.state.contract.methods.game(bet, randomSeed).send({from: this.state.account, value: amount}).on('transactionHash', (hash) => {
      this.setState({ loading: true })
      this.state.contract.events.Result({}, (error, event) => {
        const verdict = event.returnValues.winAmount
        if(verdict === '0') {
          window.alert('lose :(')
        } else {
          window.alert('WIN!')
        }
        this.setState({ loading: false })
        window.location.reload();
      })
    }).on('error', (error) => {
      window.alert('Error')
    })
  }

  onChange(value) {
    this.setState({'amount': value});
  }

  constructor(props) {
    super(props)
    this.state = {
      account: null,
      amount: null,
      balance: null,
      contract: null,
      event: null,
      loading: false,
      maxBet: 0
    }

    this.makeBet = this.makeBet.bind(this)
    this.setState = this.setState.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>&nbsp;
        { this.state.loading 
          ? <Loading
              balance={this.state.balance}
              maxBet={this.state.maxBet}
            />
          : <Main
              amount={this.state.amount}
              balance={this.state.balance}
              makeBet={this.makeBet}
              onChange={this.onChange}
              maxBet={this.state.maxBet}
              loading={this.state.loading}
            />
        }
      </div>
    );
  }
}

export default App;