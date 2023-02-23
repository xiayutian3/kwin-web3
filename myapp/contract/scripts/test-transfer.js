// truffle提供 artifacts，会自动到 contracts/下查找 KerwinToken
const Contracts = artifacts.require("KerwinToken.sol")

// truffle提供环境 web3可以随便用
const fromWei = (bn)=> {
  return web3.utils.fromWei(bn);
}
const toWei = (number)=> {
  return web3.utils.toWei(number.toString(),"ether");
}


// callback执行完，脚本才结束( 执行 truffle exec .\scripts\test-transfer.js)
module.exports = async function (callback) {
  // console.log(123)
  const KerwinToken = await Contracts.deployed()
  let res = await KerwinToken.balanceOf("0x379a566A1607B86E3D7adE4DA8dC6F312F2a61E3")
  console.log('res: ', fromWei(res));

  // 转账测试
  await KerwinToken.transfer("0xf2C0B729c70073b420E58cd9D83027dc1087A4a5",toWei(10000),{
    from:"0x379a566A1607B86E3D7adE4DA8dC6F312F2a61E3"  //转钱的发起者
  })
  let res1 = await KerwinToken.balanceOf("0x379a566A1607B86E3D7adE4DA8dC6F312F2a61E3")
  console.log('res1: ', fromWei(res1));

  callback()
}