"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { useSearchParams } from "next/navigation";

export default function PaymentCompletePage() {
  const { auth } = useAuth();
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const searchParams = useSearchParams();
  // const order_id = searchParams.get("order_id");
  const MerchantTradeNo = searchParams.get("MerchantTradeNo");

  useEffect(() => {
    if (!MerchantTradeNo) return;

    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(
          `http://localhost:3002/store/order?MerchantTradeNo=${MerchantTradeNo}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth?.token}`,
            },
          }
        );
        if (!res.ok) {
          console.error("API 回應錯誤:", res.status);
          return;
        }
        const data = await res.json();
        // console.log("前端獲取的訂單資料:", data);

        setOrderDetails({
          orderNumber: data.orderDetails.orderNumber,
          orderDate: data.orderDetails.orderDate,
          name: data.orderDetails.name,
          phone: data.orderDetails.phone,
          email: data.orderDetails.email,
          address: data.orderDetails.address,
          totalAmount: data.orderDetails.totalAmount,
          paymentMethod: data.orderDetails.paymentMethod,
          paymentStatus: data.orderDetails.paymentStatus,
          merchantTradeNo: data.orderDetails.MerchantTradeNo,
          items: data.orderItems.map((item) => ({
            product_id: item.product_id,
            product_name: item.product_name,
            amount: item.amount,
            unit_price: item.price,
            total_price: item.total_price,
            image_url: item.image_url,
          })),
        });
        setOrderItems(data.orderItems || []);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [MerchantTradeNo, auth?.token]);

  if (!orderDetails) {
    return <p className="text-center py-5">載入中...</p>;
  }

  return (
    <Container
      className="payment-complete-page py-4 d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <Card
        className="payment-complete-card shadow-lg"
        style={{ width: "90%", maxWidth: "800px" }}
      >
        <Card.Body className="text-center p-5">
          <p className="mb-3">感謝您的購買! 🎉</p>
          <h3 className="mb-4">我們已收到您的訂單</h3>

          {/* 訂單細節區 */}
          <Row className="mb-4 justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <div className="order-summary">
                <table className="table">
                  <tbody>
                    <tr>
                      <th>訂單編號：</th>
                      <td>{orderDetails.orderNumber}</td>
                    </tr>
                    <tr>
                      <th>訂單日期：</th>
                      <td>
                        {new Date(orderDetails.orderDate).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <th>收件人：</th>
                      <td>{orderDetails.name}</td>
                    </tr>
                    <tr>
                      <th>聯絡電話：</th>
                      <td>{orderDetails.phone}</td>
                    </tr>
                    <tr>
                      <th>Email：</th>
                      <td>{orderDetails.email}</td>
                    </tr>
                    <tr>
                      <th>配送地址：</th>
                      <td>{orderDetails.address}</td>
                    </tr>
                    <tr>
                      <th>訂單總額：</th>
                      <td>${orderDetails.totalAmount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>

                {/* 商品明細區 */}
                <div className="order-items mt-4">
                  <h5>商品明細</h5>
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>商品名稱</th>
                        <th>單價</th>
                        <th>數量</th>
                        <th>總價</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item) => (
                        <tr key={item.product_id}>
                          <td>{item.product_name}</td>
                          <td>${item.price.toLocaleString()}</td>
                          <td>{item.amount}</td>
                          <td>${item.total_price.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
          </Row>

          {/* 按鈕區 */}
          <div className="d-flex justify-content-center gap-3">
            <a href="/store/checkout/order" style={{ textDecoration: "none" }}>
              <Button
                variant="outline-secondary"
                className="rounded-pill w-auto"
              >
                購買記錄
              </Button>
            </a>
            <a href="/store" style={{ textDecoration: "none" }}>
              <Button variant="dark" className="rounded-pill w-auto">
                繼續逛逛
              </Button>
            </a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
