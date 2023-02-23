// 同时部署token合约 ，交易所合约

// truffle提供 artifacts，会自动到 contracts/下查找 KerwinToken
const Contracts = artifacts.require("KerwinToken.sol")
const Exchange = artifacts.require("Exchange.sol")


// 脚本执行，truffle自动注入 deployer对象，完成部署工作
// 注意：部署文件 以数字开头
module.exports = async function (deployer) {
  // truffle提供环境 web3可以随便用
  // 返回节点所控制的账户列表
  const acounts = await web3.eth.getAccounts()

  await deployer.deploy(Contracts)
  // 后面接的是部署交易所的构造函数的参数
  await deployer.deploy(Exchange,acounts[2], 10)
}


// 快速测试合约

// truffle compile  编译合约
// truffle migrate  编译合约 + 部署合约 (去除缓存，重新部署truffle migrate --reset)
// truffle console  进入truffle的控制台
// const obj = await KerwinToken.deployed() 快速部署合约进行测试（前提一定要经过truffle migrate ）

// obj.xxxx()调用合约方法

