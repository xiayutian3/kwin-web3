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


// callback执行完，脚本才结束( 执行 truffle exec .\scripts\test-order.js)
module.exports = async function (callback) {
  try {
     // 实例化脚本合约对象
      const kerwinToken = await Contracts.deployed()
      // 实例化脚本合约对象（不需要传构造函数的参数值，因为我们已经部署在本地测试环境中了）
      const exchange = await Exchange.deployed()
      // 返回节点所控制的账户列表
      const accounts = await web3.eth.getAccounts()



      //第一步 account0 --》 account1 10w
      await kerwinToken.transfer(accounts[1],toWei(100000),{
        from: accounts[0]
      })
      // 第二步 account0 --》交易所存入 10以太币
      await exchange.depositEther({
        from: accounts[0],
        value:toWei(10)
      })
      let res1 = await exchange.tokens(ETHER_ADDRESS,accounts[0])
      console.log('accounts[0]在交易所的以太币: ', fromWei(res1));

      // 第二步account0 ---》 交易所存入 10 0000KWT
      await kerwinToken.approve(exchange.address,toWei(100000),{
        from:accounts[0]
      })
      await exchange.depositToken(kerwinToken.address, toWei(100000),{
        from:accounts[0]
      })
      let res2 = await exchange.tokens(kerwinToken.address,accounts[0])
      console.log('accounts[0]在交易所的KWT币:: ', fromWei(res2));


      // 第三步account1 --》 交易所存入  5以太币
      await exchange.depositEther({
        from:accounts[1],
        value:toWei(5)
      })
      let res3 = await exchange.tokens(ETHER_ADDRESS,accounts[1])
      console.log('accounts[1]在交易所的以太币: ', fromWei(res3));

      // 第三步account1 -->交易所存入   50000KWT
      await kerwinToken.approve(exchange.address,toWei(50000),{
        from:accounts[1]
      })
      await exchange.depositToken(kerwinToken.address, toWei(50000),{
        from:accounts[1]
      })
      let res4 = await exchange.tokens(kerwinToken.address,accounts[1])
      console.log('accounts[1]在交易所的KWT币:: ', fromWei(res4));


      let orderId= 0
      let res

      // 创建订单
      res = await exchange.makeOrder(kerwinToken.address,toWei(1000),ETHER_ADDRESS,toWei(0.1),{from:accounts[0]})
      orderId = res.logs[0].args.id
      console.log("创建第一个订单")
      await wait(1)
      //取消订单
      res = await exchange.makeOrder(kerwinToken.address,toWei(2000),ETHER_ADDRESS,toWei(0.2),{from:accounts[0]})
      orderId = res.logs[0].args.id
      await exchange.cancelOrder(orderId,{from:accounts[0]})
      console.log("取消一个订单")
      await wait(1)
      // 完成订单
      res = await exchange.makeOrder(kerwinToken.address,toWei(3000),ETHER_ADDRESS,toWei(0.3),{from:accounts[0]})
      orderId = res.logs[0].args.id
      await exchange.fillOrder(orderId,{from:accounts[1]})
      console.log("完成一个订单")

      console.log("account[0]在交易所的KWT",fromWei(await exchange.tokens(kerwinToken.address,accounts[0])))
      console.log("account[0]在交易所的以太币",fromWei(await exchange.tokens(ETHER_ADDRESS,accounts[0])))

      console.log("account[1]在交易所的KWT",fromWei(await exchange.tokens(kerwinToken.address,accounts[1])))
      console.log("account[1]在交易所的以太币",fromWei(await exchange.tokens(ETHER_ADDRESS,accounts[1])))

      // 收小费的账号
      console.log("account[2]在交易所的KWT",fromWei(await exchange.tokens(kerwinToken.address,accounts[2])))

    } catch (error) {
      console.log('error: ', error);
    }
 

  callback()
}