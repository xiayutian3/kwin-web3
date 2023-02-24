import React from "react";
import { Card, Col, Row, Table } from "antd";

export default function Order() {
  const dataSource = [
    {
      key: "1",
      name: "胡彦斌",
      age: 32,
      address: "西湖区湖底公园1号",
    },
    {
      key: "2",
      name: "胡彦祖",
      age: 42,
      address: "西湖区湖底公园1号",
    },
  ];

  const columns = [
    {
      title: "时间",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "KWT",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "ETH",
      dataIndex: "address",
      key: "address",
    },
  ];
  return (
    <div style={{ marginTop: "10px" }}>
      <Row>
        <Col span={8}>
          <Card title="已完成交易" bordered={false} style={{ margin: 10 }}>
            <Table dataSource={dataSource} columns={columns} />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="交易中-我创建的订单"
            bordered={false}
            style={{ margin: 10 }}
          >
            <Table dataSource={dataSource} columns={columns} />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="交易中-其他人的订单"
            bordered={false}
            style={{ margin: 10 }}
          >
            <Table dataSource={dataSource} columns={columns} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
