/** This example code is designed to quickly deploy an example contract using Remix.
 *  If you have never used Remix, try our example walkthrough: https://docs.chain.link/docs/example-walkthrough
 *  You will need testnet ETH and LINK.
 *     - Kovan ETH faucet: https://faucet.kovan.network/
 *     - Kovan LINK faucet: https://kovan.chain.link/
 */

pragma solidity 0.6.6;

import "https://raw.githubusercontent.com/smartcontractkit/chainlink/master/evm-contracts/src/v0.6/VRFConsumerBase.sol";

contract RandomNumberConsumer is VRFConsumerBase {
    
  uint256 internal fee;
  bytes32 internal keyHash;
  uint256 public randomResult;
  
  address constant VFTC = 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9;
  uint256 constant half = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
  
  uint public gameId;
  uint public lastGameId;
  address payable public admin;
  mapping(uint256 => Game) public games;

  struct Game{
    uint id;
    uint bet;
    uint amount;
    address payable player;
  }

  modifier onlyAdmin() {
    require(msg.sender == admin, 'caller is not the admin');
    _;
  }

  modifier onlyVTFC() {
    require(msg.sender == VFTC, 'only VFTC can call this function');
    _;
  }
  
  event Received(address indexed sender, uint256 amount);
  event Result(uint id, uint bet, uint amount, address player, uint winAmount);
  event Withdraw(address admin, uint256 amount);
  
  /**
   * Constructor inherits VRFConsumerBase
   * 
   * Network: Kovan
   * Chainlink VRF Coordinator address: 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9
   * LINK token address:                0xa36085F69e2889c224210F603D836748e7dC0088
   * Key Hash: 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4
   */
  constructor() 
    VRFConsumerBase(
      0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
      0xa36085F69e2889c224210F603D836748e7dC0088  // LINK Token
    ) public
  {
    keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
    fee = 0.1 * 10 ** 18; // 0.1 LINK
    admin = msg.sender;
  }
  
    /* Allows this contract to receive payments */
  receive() external payable {
    emit Received(msg.sender, msg.value);
  }
  
  /** 
   * Taking bets function
   * 
   * 0 = low (50% chance)
   * 1 = high (50% chance)
   */
   
  function game(uint256 bet) public payable returns (bool) {
    require(bet<=1, 'Error, accept only 0 and 1');
    require(msg.value!=0, 'Error, msg.value must be higher that 0');
    require(address(this).balance>=msg.value, 'Error insufficent vault balance');
    
    games[gameId] = Game(gameId, bet, msg.value, msg.sender);
    gameId = gameId+1;

    getRandomNumber(bet);
    return true;
  }
  
  /** 
   * Request for randomness
   */
  function getRandomNumber(uint256 userProvidedSeed) internal returns (bytes32 requestId) {
    require(LINK.balanceOf(address(this)) > fee, "Not enough LINK - fill contract with faucet");
    return requestRandomness(keyHash, fee, userProvidedSeed);
  }

  /**
   * Callback function used by VRF Coordinator
   */
  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    randomResult = randomness;
    verdict(randomResult);
  }
  
  /**
   * Send reward to the winers
   */
  function verdict(uint256 random) public payable onlyVTFC {
    for(uint i=lastGameId; i<gameId; i++){
      uint winAmount = 0;
      if((random>=half && games[i].bet==1) || (random<half && games[i].bet==0)){
        winAmount = games[i].amount*2;
        games[i].player.transfer(winAmount);
      }
      emit Result(games[i].id, games[i].bet, games[i].amount, games[i].player, winAmount);
    }
    lastGameId = gameId;
  }
  
  /**
   * Withdraw LINK from this contract (admin option)
   */
  function withdrawLink() external onlyAdmin {
    require(LINK.transfer(msg.sender, LINK.balanceOf(address(this))), "Unable to transfer");
  }
  
  /**
   * Withdraw Ether from this contract (admin option)
   */
  function withdrawEther(uint256 amount) external payable onlyAdmin {
    require(address(this).balance>=amount, 'Error, contract has insufficent balance');
    admin.transfer(amount);
    
    emit Withdraw(admin, amount);
  }
}