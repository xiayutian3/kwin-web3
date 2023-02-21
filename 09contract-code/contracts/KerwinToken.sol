// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
import  "openzeppelin-solidity/contracts/math/SafeMath.sol";

// erc20合约实现

contract KerwinToken {
  using SafeMath for uint; //为uint类型添加 sub（减）  add（增）方法

  // 事件
  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);


  string public name = "KerwinToken";
  string public symbol = "KWT";
  uint public decimals = 18; //精度， 1KerwinToken = 10**decimals，1kwt = 1eth
  uint public totalSupply;
  mapping(address => uint) public balanceOf;
  mapping(address => mapping(address => uint)) public allowance; //授权的额度

  constructor(){
    totalSupply = 1000000*(10**decimals); //发行100万 KWT
    // 部署者
    balanceOf[msg.sender] = totalSupply;

  }

  // 转账
  function transfer(address _to, uint256 _value) public returns (bool success){
    require(_to != address(0));
    _transfer(msg.sender, _to, _value);
    return true;
  }

  function _transfer(address _from, address _to, uint256 _value) internal {
    require(balanceOf[_from] >= _value); 
    // 从哪个账号发起的调用者 msg.sender
    balanceOf[_from] = balanceOf[_from].sub(_value);
    balanceOf[_to] = balanceOf[_to].add(_value);

    // 触发事件
    emit Transfer(_from, _to, _value);
  }

  // 被授权的交易所调用
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
    // _from 某个放款账号
    // _to 收款账户
    // msg.sender 交易所账户地址
    require(balanceOf[_from] >= _value);
    require(allowance[_from][msg.sender] >= _value);

    allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);
    _transfer(_from, _to, _value);
    return true;
  }

  // 授权第三方交易机构额度
  function approve(address _spender, uint256 _value) public returns (bool success){
    // msg.sender 当前网页登录的账号
    // _spender 第三方交易所的账号地址
    // _value  授权的钱数
    require(_spender != address(0));
    allowance[msg.sender][_spender] = _value;
    // 触发事件
    emit Approval(msg.sender,_spender,_value);
    return true;
  }


}