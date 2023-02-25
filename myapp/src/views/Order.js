import React from "react";
import { Card, Col, Row, Table ,Button} from "antd";
import { useSelector } from "react-redux";
import moment from "moment";

// 转化时间
function convertTime(time) {
  return moment(time*1000).format('YYYY-MM-DD')
}

// 转化单位
function convert(n) {
  // window.web
  if (!window.web || !n) return;
  return window.web.web3.utils.fromWei(n);
}

// 交易中的订单数据
function getRenderOrder(order,type) {
  if (!window.web ) return []
  // 1排除已经成成的，取消的
  let filterIds = [...order.CancelOrders,...order.FillOrders].map(item=>item.id);

  // 2当前账号的
  let pendingOrders = order.AllOrders.filter(item => !filterIds.includes(item.id))
  // console.log('pendingOrders: ', pendingOrders);
  let {account} = window.web
  if(type === 1){
    // 返回当前账户创建的交易中的订单
    return pendingOrders.filter(item=> item.user === account )
  }else{
    return pendingOrders.filter(item=> item.user !== account)
  }
}

export default function Order() {
  const order = useSelector(state => state.order)
  console.log('order: ', order);
  const dataSource = [
    {
      id: "1",
      name: "胡彦斌",
      age: 32,
      address: "西湖区湖底公园1号",
    },
    {
      id: "2",
      name: "胡彦祖",
      age: 42,
      address: "西湖区湖底公园1号",
    },
  ];

  const columns = [
    {
      title: "时间",
      dataIndex: "timestamp",
      key: "timestamp",
      render:(timestamp)=> convertTime(timestamp)
    },
    {
      title: "KWT",
      dataIndex: "amountGet",
      key: "amountGet",
      render:(amountGet)=> convert(amountGet)
    },
    {
      title: "ETH",
      dataIndex: "amountGive",
      key: "amountGive",
      render:(amountGive)=> convert(amountGive)
    },
  ];
  const columns1 = [
    ...columns,
    {
      title: "操作",
      render:(item)=> <Button type="primary" onClick={()=>{
        // console.log('item: ', item);
        const {account,exchange} = window.web
        //调用智能合约函数 取消订单 
        exchange.methods.cancelOrder(item.id).send({from: account})
      }}>取消</Button>
    },
  ]
  const columns2 = [
    ...columns,
    {
      title: "操作",
      render:(item)=> <Button type="primary" onClick={()=>{
        // console.log('item: ', item);
        const {account,exchange} = window.web
        //调用智能合约函数 买入订单 
        exchange.methods.fillOrder(item.id).send({from: account})
      }}>买入</Button>
    },
  ]
  return (
    <div style={{ marginTop: "10px" }}>
      <Row>
        <Col span={8}>
          <Card title="已完成交易" bordered={false} style={{ margin: 10 }}>
            <Table dataSource={order.FillOrders} columns={columns} rowKey={item => item.id} />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="交易中-我创建的订单"
            bordered={false}
            style={{ margin: 10 }}
          >
            <Table dataSource={getRenderOrder(order,1)} columns={columns1}  rowKey={item => item.id} />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="交易中-其他人的订单"
            bordered={false}
            style={{ margin: 10 }}
          >
            <Table dataSource={getRenderOrder(order)} columns={columns2}  rowKey={item => item.id} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
