"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, Button, Table, Row, Col } from "react-bootstrap";
import List from "../../../members/_components/left_list";
import { useRouter } from "next/navigation";

export default function OrderSearchPage() {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/store");
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3002/store/orderall", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.token}`,
          },
        });
        if (!res.ok) {
          const errorData = await res.json();
          console.error("API 錯誤:", errorData);
          setError(errorData.error || "無法獲取訂單資料");
          return;
        }
        const data = await res.json();
        // console.log("獲取到的訂單資料:", data);

        // const ordersData = Array.isArray(data.orderDetails)
        //   ? data.orderDetails
        //   : [data.orderDetails];

        //   const ordersWithItems = ordersData.map((orderDetail) => {
        //     const items = (data.orderItems ?? []).filter(
        //       (item) => item.order_id === orderDetail.order_id
        //     );
        //   return { ...orderDetail, items };
        // });

        // setOrders(ordersWithItems || []);
        if (!Array.isArray(data.orders)) {
          setError("訂單資料格式錯誤");
          return;
        }

        setOrders(data.orders);
      } catch (err) {
        setError("發生錯誤: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) {
      fetchOrders();
    }
  }, [auth?.token]);

  if (loading) {
    return <div>載入中...</div>;
  }

  if (error) {
    return <div>發生錯誤: {error}</div>;
  }

  return (
    <>
      <div className="container pt-3">
        <div className="row">
          {/* 左側選單 */}
          <div className="col-3 left_list_fixed">
            <List />
          </div>

          {/* 右側內容 */}
          <div className="col-9 members_content">
            <div
              className="order-search-page py-4 d-flex justify-content-center align-items-center"
              style={{ minHeight: "10vh" }}
            >
              <Card
                className="order-search-card"
                style={{ width: "100%", maxWidth: "1000px" }}
              >
                <Card.Body className="p-5">
                  <h3 className="mb-4 text-center">訂單查詢</h3>

                  {/* 訂單列表區 */}
                  <Row className="mb-4">
                    <Col xs={12}>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>訂單編號</th>
                            <th>訂單日期</th>
                            {/* <th>商品名稱</th>
                            <th>商品數量</th> */}
                            <th>訂單總額</th>
                            <th>收件人</th>
                            <th>收件地址</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.length > 0 ? (
                            orders.map((order) => (
                              <tr key={order.orderNumber}>
                                <td>{order.orderNumber}</td>
                                <td>
                                  {order.orderDate
                                    ? new Date(
                                        order.orderDate
                                      ).toLocaleDateString()
                                    : "無日期"}
                                </td>
                                {/* <td>
                                  {order.items.map((item) => (
                                    <div key={item.order_detail_id}>
                                      {item.product_name}
                                    </div>
                                  ))}
                                </td>
                                <td>
                                  {order.items.map((item) => (
                                    <div key={item.order_detail_id}>
                                      {item.amount}
                                    </div>
                                  ))}
                                </td> */}
                                <td>
                                  $
                                  {order.total_price
                                    ? order.total_price.toLocaleString()
                                    : "無資料"}
                                </td>
                                <td>{order.recipient_name}</td>
                                <td>{order.shipping_address}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center">
                                沒有找到訂單資料
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>

                  {/* 回上一頁按鈕 */}
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="outline-secondary"
                      className="rounded-pill"
                      onClick={handleGoBack}
                    >
                      繼續逛逛
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
