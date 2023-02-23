// truffle提供 artifacts，会自动到 contracts/下查找 StudentListStorage
const Contracts = artifacts.require("StudentListStorage.sol")

// callback执行完，脚本才结束( 执行 truffle exec .\scripts\test2.js)
module.exports = async function (callback) {
  // console.log(123)
  const StudentListStorage = await Contracts.deployed()
  await StudentListStorage.addList("dkk",100)
  let res = await StudentListStorage.getList()
  console.log('res: ', res);
  console.log(await StudentListStorage.studentList(0))

  callback()
}