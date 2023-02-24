import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000" // 0x 后面40个0

const orderSlice = createSlice({
  name: 'order', // type: order/get..
  initialState:{
    CancelOrders:[], //取消的订单
    FillOrders:[], //完成的订单
    AllOrders:[], //所有的订单
  },
  reducers:{
    setCancelOrders(state, action){
      state.CancelOrders = action.payload
    },
    setFillOrders(state, action){
      state.FillOrders = action.payload
    },
    setAllOrders(state, action){
      state.AllOrders = action.payload
    },
  }

})

export const {setCancelOrders,setFillOrders,setAllOrders} = orderSlice.actions
export default orderSlice.reducer

//异步函数
export const loadCancelOrderData = createAsyncThunk(
  "order/fetchCancelOrderData",
  async (data, {dispatch}) => {
    const {web3,account,token,exchange} = data
    // console.log('exchange: ', await exchange.methods.orders(1).call());
    const res = await exchange.getPastEvents("Cancel",{
      fromBlock:0,
      toBlock:"latest"
    })
    console.log('Cancel: ', res);

  }
)