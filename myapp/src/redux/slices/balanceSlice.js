import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000" // 0x 后面40个0

const balanceSlice = createSlice({
  name: 'balance', // type: balance/get..
  initialState:{
    TokenWallet: "0",   //钱包中代币kwt的余额（同一个账号）  // wei转化，需要字符串，不是数字0
    TokenExchange: "0", //交易所中代币kwt的余额（同一个账号）
    EtherWallet: "0", //钱包中ether的余额（同一个账号）
    EtherExchange: "0" //交易所中ether的余额（同一个账号）
  },
  reducers:{
    setTokenWallet(state, action){
      state.TokenWallet = action.payload
    },
    setTokenExchange(state, action){
      state.TokenExchange = action.payload
    },
    setEtherWallet(state, action){
      state.EtherWallet = action.payload
    },
    setEtherExchange(state, action){
      state.EtherExchange = action.payload
    },
  }

})

export const {setTokenWallet,setTokenExchange,setEtherWallet,setEtherExchange} = balanceSlice.actions
export default balanceSlice.reducer
// balanceSlice.actions

//异步函数
export const loadBalanceData = createAsyncThunk(
  "balance/fetchBalanceData",
  async (data, {dispatch}) => {
    // console.log(data)
    const {web3,account,token,exchange} = data

    // 获取钱包的token   call() 用于读取链上数据 不消耗gas ，send（）写入数据，消耗gas
    const TokenWallet = await token.methods.balanceOf(account).call()
    // console.log('TokenWallet: ', TokenWallet);
    dispatch(setTokenWallet(TokenWallet))

    // 获取交易所的token
    const TokenExchange = await exchange.methods.balanceOf(token.options.address, account).call()
    // console.log('TokenExchange: ', TokenExchange);
    dispatch(setTokenExchange(TokenExchange))

    // 获取钱包ether
    const EtherWallet = await web3.eth.getBalance(account)
    // console.log('EtherWallet: ', EtherWallet);
    dispatch(setEtherWallet(EtherWallet))

    // 获取交易所ether
    const EtherExchange = await exchange.methods.balanceOf(ETHER_ADDRESS,account).call()
    // console.log('EtherExchange: ', EtherExchange);
    dispatch(setEtherExchange(EtherExchange))

  }
)