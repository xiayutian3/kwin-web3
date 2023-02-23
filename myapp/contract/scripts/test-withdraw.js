// truffle提供 artifacts，会自动到 contracts/下查找 KerwinToken
const Contracts = artifacts.require("KerwinToken.sol")
const Exchange = artifacts.require("Exchange.sol")
const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000" // 0x 后面40个0

// truffle提供环境 web3可以随便用
const fromWei = (bn)=> {
  return web3.utils.fromWei(bn);
}
const toWei = (number)=> {
  return web3.utils.toWei(number.toString(),"ether");
}


// callback执行完，脚本才结束( 执行 truffle exec .\scripts\test-withdraw.js)
module.exports = async function (callback) {
  // console.log(123)
  // 实例化脚本合约对象
  const kerwinToken = await Contracts.deployed()
  // 实例化脚本合约对象（不需要传构造函数的参数值，因为我们已经部署在本地测试环境中了）
  const exchange = await Exchange.deployed()
  // 返回节点所控制的账户列表
  const accounts = await web3.eth.getAccounts()

  //测试以太币-提取
  // await exchange.withdrawEther(toWei(5),{
  //   from:accounts[0], //提取到的地址
  // })
  // let res1 = await exchange.tokens(ETHER_ADDRESS,accounts[0]) 
  // console.log(fromWei(res1))

  

  // // 测试其他币-提取
  // // 转账存款,存到交易所
  await exchange.withdrawToken(kerwinToken.address, toWei(50000),{
    from:accounts[0] //那个账户发起操作
  })
  let res = await exchange.tokens(kerwinToken.address,accounts[0]) 
  console.log(fromWei(res))




  callback()
}