import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Web3 from "web3"
import tokenjson from '../buildcontract/KerwinToken.json'
import exchangejson from '../buildcontract/Exchange.json'
import Balance from './Balance'
import Order from './Order'
import { loadBalanceData } from '../redux/slices/balanceSlice'
import { loadCancelOrderData } from '../redux/slices/orderSlice'
// console.log('tokenjson: ', tokenjson);

export default function Content() {
  const dispatch = useDispatch()

  useEffect(()=>{
    async function start() {
      // 1.获取连接后的合约
      const web = await initWeb()
      // console.log('web: ', web);
      window.web = web //设置成全局对象
      
      // 2.获取资产信息
      dispatch(loadBalanceData(web))
      // 3.获取订单信息
      dispatch(loadCancelOrderData(web))

    }
    start()
  },[dispatch])

  async function initWeb() {
    //链接区块链
    var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

    // 先授权
    const accounts = await web3.eth.requestAccounts()
    // console.log('account: ', accounts[0]);

     
    //  获取当前的网络id
    const networkId = await web3.eth.net.getId()

    // 连接智能合约程序(代币合约)
    const tokenabi = tokenjson.abi
    const tokenaddress = tokenjson.networks[networkId].address
    const token = await new web3.eth.Contract(tokenabi,tokenaddress)
    // console.log('token: ', token);

    // 连接智能合约程序(交易所合约)
    const exchangeabi = exchangejson.abi
    const exchangeaddress = exchangejson.networks[networkId].address
    const exchange = await new web3.eth.Contract(exchangeabi,exchangeaddress)
    // console.log('exchange: ', exchange);

    return {
      web3,  //web3对象
      account:accounts[0], //登录的账号
      token,  //代币合约
      exchange //交易所合约
    }
  }


  return (
    <div style={{padding: "10px"}}>
      <Balance></Balance>
      <Order></Order>
    </div>
  )
}
