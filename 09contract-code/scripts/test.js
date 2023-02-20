// truffle提供 artifacts，会自动到 contracts/下查找 StudentStorage
const Contracts = artifacts.require("StudentStorage.sol")

// callback执行完，脚本才结束( 执行 truffle exec .\scripts\test.js)
module.exports = async function (callback) {
  // console.log(123)
  const studentStorage = await Contracts.deployed()
  await studentStorage.setData("dkk",100)
  let res = await studentStorage.getData()
  console.log('res: ', res);
  console.log(await studentStorage.name())
  console.log(await studentStorage.age())

  callback()
}