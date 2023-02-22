// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import  "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./KerwinToken.sol";

// 交易所合约实现

contract Exchange {
  using SafeMath for uint; //为uint类型添加 sub（减）  add（增）方法

  // 事件
  // 存款事件
  event Deposit(address token, address user, uint amount, uint balance);
  // 提款事件
  event WithDraw(address token, address user, uint amount, uint balance);

  // 收费账户地址(收小费用的，手续费)
  address public feeAccount;
  uint public feePercent; //费率
  address constant ETHER = address(0); //以太坊地址，用于记账，不用0，用1也行，只是为了记账

  // 代币的合约地址=》 用户的地址 =》 用户放在交易所的钱数
  mapping(address => mapping(address => uint)) public tokens;

  constructor(address _feeAccount, uint _feePercent){
    feeAccount = _feeAccount;
    feePercent = _feePercent;
  }

  //存款方法
  // 存以太币 (发送到合约地址)
  function depositEther() public payable {
    // msg.sender
    // msg.value
    tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
    // 触发存款事件
    emit Deposit(address(0), msg.sender, msg.value, tokens[ETHER][msg.sender]);
  }

  // 存其他货币
  function depositToken(address _token, uint _amount) public {
    require(_token != ETHER); //不等于以太币地址

    //调用某个方法强行从你的账户往当前交易所账户转钱(前提是账户授权了该交易所)
    require(KerwinToken(_token).transferFrom(msg.sender, address(this), _amount));
    // 开始记录
    tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
    // 触发存款事件
    emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);

  }


  // 提取以太币
  function withdrawEther(uint _amount) public {
    require(tokens[ETHER][msg.sender] >= _amount);
    tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
    //payable
    payable(msg.sender).transfer(_amount);
    // 触发事件
    emit WithDraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
  }


  // 提取其他代币
  function withdrawToken(address _token, uint _amount) public {
    require(_token != ETHER); //不等于以太币地址，或判断地址有效
    require(tokens[_token][msg.sender] >= _amount);

    tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
    //开始转账  KerwinToken(_token).transfer 的调用是 交易所合约调用的，所以transfer方法里边的msg.sender是交易所合约地址
    require(KerwinToken(_token).transfer(msg.sender, _amount)); //这个msg.sender是提款的第三方账号
    //触发转账事件
    emit WithDraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);

  }


}