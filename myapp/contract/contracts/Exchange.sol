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
  // 订单事件
  event Order ( uint id,address user,address tokenGet,uint amountGet,address tokenGive,uint amountGive,uint timestamp);
  // 取消订单事件
  event Cancel ( uint id,address user,address tokenGet,uint amountGet,address tokenGive,uint amountGive,uint timestamp);
  // 完成订单事件
  event Trade ( uint id,address user,address tokenGet,uint amountGet,address tokenGive,uint amountGive,uint timestamp);


  // 收费账户地址(收小费用的，手续费)
  address public feeAccount;
  uint public feePercent; //费率
  address constant ETHER = address(0); //以太坊地址，用于记账，不用0，用1也行，只是为了记账

  // 代币的合约地址=》 用户的地址 =》 用户放在交易所的钱数
  mapping(address => mapping(address => uint)) public tokens;

  // 订单结构体
  struct _Order {
    uint id;
    address user; //订单创建者
    address tokenGet; //花费的代币地址
    uint amountGet; //花费的代币的数量

    address tokenGive; //要换成的代币的地址
    uint amountGive; //要换成的代币的数量

    uint timestamp; //时间戳
  }
  // 两种表示形式
  // [1,2,3]
  // {
  //   0:1,
  //   1:2,
  // }
  // _Order[] public orderlist;//也可以这种表示形式
  mapping(uint => _Order) public orders; //也可以这种表示形式
  mapping(uint => bool) public orderCancel; // 取消订单记录
  mapping(uint => bool) public orderFill; // 完成的订单记录
  // 订单总数
  uint public orderCount;


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

  // 查询余额某种代币余额
  function balanceOf(address _token, address _user) public view returns(uint) {
    return tokens[_token][_user];
  }



  // makeOrder创建交易订单 (假设  100KWT ==> 1ether)
  function makeOrder(address _tokenGet, uint _amountGet, address _tokenGive, uint _amountGive) public {
    require(balanceOf(_tokenGive, msg.sender) >= _amountGive, unicode"创建订单式余额不足"); //判断是否有足够的钱来交易

    orderCount = orderCount.add(1);
    orders[orderCount] = _Order(orderCount, msg.sender, _tokenGet,_amountGet,_tokenGive,_amountGive,block.timestamp);
    // 触发事件
    emit Order(orderCount, msg.sender, _tokenGet,_amountGet,_tokenGive,_amountGive,block.timestamp);
  }
  // cancel取消交易订单
  function cancelOrder(uint _id) public {
    _Order memory myorder = orders[_id];
    require(myorder.id == _id);
    orderCancel[_id] = true;

    // 触发取消事件
    emit Cancel(myorder.id, msg.sender,myorder.tokenGet,myorder.amountGet,myorder.tokenGive,myorder.amountGive,block.timestamp);
  }
  // fillOrder 下单或完成订单（购买人调用的）
  function fillOrder(uint _id) public {
    _Order memory myorder = orders[_id];
    require(myorder.id == _id);

    // 账户余额 互换 && 收取服务费
    /**
        订单流程：
          小明 -> makeorder
          100KWT ==> 1ether
          msg.sender -> fillOrder
        结果：
          小明少了1ether,多了100KWT
          msg.sender少了100KWT,多了1ether
     */
    //  小费，手续费 ((100x10)/100) -------- 假设是购买者支付
      uint feeAmount = myorder.amountGet.mul(feePercent).div(100);
      require(balanceOf( myorder.tokenGive, myorder.user) >= myorder.amountGive, unicode"创建者余额不足"); //判断订单创建者 是否有足够的钱来交易
      require(balanceOf( myorder.tokenGet, msg.sender) >= myorder.amountGet.add(feeAmount), unicode"交易者余额不足"); //判断交易者 是否有足够的钱来交易

      //  KWT
      tokens[myorder.tokenGet][msg.sender] = tokens[myorder.tokenGet][msg.sender].sub(myorder.amountGet.add(feeAmount));
      tokens[myorder.tokenGet][myorder.user] = tokens[myorder.tokenGet][myorder.user].add(myorder.amountGet);
      // 交易所的收钱账户 收钱-------- 假设是购买者支付
      tokens[myorder.tokenGet][feeAccount] = tokens[myorder.tokenGet][feeAccount].add(feeAmount);
      // ether
      tokens[myorder.tokenGive][msg.sender] = tokens[myorder.tokenGive][msg.sender].add(myorder.amountGive);
      tokens[myorder.tokenGive][myorder.user] = tokens[myorder.tokenGive][myorder.user].sub(myorder.amountGive);

    // 订单完成
    orderFill[_id] = true;
    // 触发交易完成事件
    emit Trade(myorder.id,myorder.user,myorder.tokenGet,myorder.amountGet,myorder.tokenGive,myorder.amountGive,block.timestamp);
  }


}