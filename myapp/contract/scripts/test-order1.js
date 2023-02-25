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
const wait = (seconds)=> {
  const millisseconds = seconds * 1000
  return new Promise((resolve) => setTimeout(resolve, millisseconds))
}


// callback执行完，脚本才结束( 执行 truffle exec .\scripts\test-order1.js)
module.exports = async function (callback) {
  try {
     // 实例化脚本合约对象
      const kerwinToken = await Contracts.deployed()
      // 实例化脚本合约对象（不需要传构造函数的参数值，因为我们已经部署在本地测试环境中了）
      const exchange = await Exchange.deployed()
      // 返回节点所控制的账户列表
      const accounts = await web3.eth.getAccounts()

      // 循环创建订单

      for (let i = 0; i < 5; i++) {
        await exchange.makeOrder(kerwinToken.address,toWei(1000+i),ETHER_ADDRESS,toWei(i/1000),{from:accounts[0]})
        await wait(1)
      }

      for (let i = 0; i < 5; i++) {
        await exchange.makeOrder(kerwinToken.address,toWei(1000+i),ETHER_ADDRESS,toWei(i/1000),{from:accounts[1]})
        await wait(1)
      }


    } catch (error) {
      console.log('error: ', error);
    }
 

  callback()
}