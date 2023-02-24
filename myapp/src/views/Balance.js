import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTokenWallet } from "../redux/slices/balanceSlice";
// import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";

function convert(n) {
  // window.web
  if (!window.web) return;
  return window.web.web3.utils.fromWei(n);
}

export default function Balance() {
  const state = useSelector((state) => state.balance.TokenWallet);
  const dispatch = useDispatch();

  //获取redux中的数据
  const { TokenWallet, TokenExchange, EtherWallet, EtherExchange } =
    useSelector((state) => state.balance);
  return (
    // <div>
    //   Balance-{state}
    //   <button onClick={ () => dispatch(setTokenWallet("1000"))}>click</button>
    // </div>

    <div>
      <Row>
        <Col span={6}>
          <Card  hoverable={true}>
            <Statistic
              title="钱包中以太坊币："
              value={convert(EtherWallet)}
              precision={3}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card  hoverable={true}>
            <Statistic
              title="钱包中以KWT："
              value={convert(TokenWallet)}
              precision={3}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card  hoverable={true}>
            <Statistic
              title="交易所中以太坊币："
              value={convert(EtherExchange)}
              precision={3}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable={true}>
            <Statistic
              title="交易所中以KWT："
              value={convert(TokenExchange)}
              precision={3}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>
      {/* <h3>钱包中以太坊币：{convert(EtherWallet)}</h3>
      <h3>钱包中以KWT：{convert(TokenWallet)}</h3>
      <h3>交易所中以太坊币：{convert(EtherExchange)}</h3>
      <h3>交易所中以KWT：{convert(TokenExchange)}</h3> */}
    </div>
  );
}
