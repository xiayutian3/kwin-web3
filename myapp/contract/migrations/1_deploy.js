
// truffle提供 artifacts，会自动到 contracts/下查找 StudentStorage
const Contracts = artifacts.require("StudentStorage.sol")

// 脚本执行，truffle自动注入 deployer对象，完成部署工作
// 注意：部署文件 以数字开头
module.exports = function (deployer) {
  deployer.deploy(Contracts)
}


// 快速测试合约

// truffle compile  编译合约
// truffle migrate  编译合约 + 部署合约 (去除缓存，重新部署truffle migrate --reset)
// truffle console  进入truffle的控制台
// const obj = await StudentStorage.deployed() 快速部署合约进行测试（前提一定要经过truffle migrate ）
// obj.setData("hello",100) 调用合约方法
// obj.getData()调用合约方法

