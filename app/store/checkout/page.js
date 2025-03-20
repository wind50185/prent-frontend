"use client";

import React, { useState, useEffect, useReducer } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { Row, Col, Form, Card, Button, Container } from "react-bootstrap";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialContactInfo = {
  recipient_name: "",
  recipient_phone: "",
  recipient_email: "",
  shipping_address: "",
};

const contactInfoReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
};

const validateEmail = (email) => {
  // 檢查email是否符合格式
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// 檢查電話是否為09開頭的十碼數字
const validatePhone = (recipient_phone) => {
  const re = /^09[0-9]{8}$/;
  return re.test(recipient_phone);
};

export default function StoreCheckout() {
  const { auth } = useAuth();
  // console.log(auth);
  const token = auth?.token;
  const memberId = auth?.member_id;
  const { cartItems, setCartItems } = useCart();
  const [currentStep, setCurrentStep] = useState(2);
  const steps = ["購物車", "填寫資料", "訂單完成"];
  const [contactInfo, dispatchContactInfo] = useReducer(
    contactInfoReducer,
    initialContactInfo
  );
  useEffect(() => {
    // 從後端獲取購物車資料
    const fetchCartItems = async () => {
      try {
        const res = await fetch("http://localhost:3002/store/cart", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.cartItems) {
          setCartItems(data.cartItems);
        }
      } catch (error) {
        toast.error("獲取購物車資料時發生錯誤: " + error.message);
      }
    };

    if (token) {
      fetchCartItems();
    }
  }, [token]);

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product_price * item.amount,
      0
    );
  };

  const handleChangeContactInfo = (e) => {
    const { name, value } = e.target;
    dispatchContactInfo({ type: "UPDATE_FIELD", field: name, value });
  };

  const handlePhoneBlur = () => {
    const phone = contactInfo.recipient_phone;
    if (phone.length > 0 && phone.length < 10) {
      toast.error("請輸入完整的十碼電話號碼");
    } else if (phone.length === 10 && !validatePhone(phone)) {
      toast.error("請輸入以 09 開頭的十碼電話號碼");
    }
  };

  const handleEmailBlur = () => {
    const email = contactInfo.email;
    if (email && !validateEmail(email)) {
      toast.error("請輸入有效的電子郵件地址");
    }
  };
  // 生成訂單編號的函數
  const generateOrderNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ""); // 取得年月日格式：YYYYMMDD
    const randomNumber = ("00" + Math.floor(Math.random() * 1000)).slice(-3); // 產生隨機的 3 位數
    return dateStr + randomNumber;
  };

  const handlePayment = async () => {
    try {
      const orderData = {
        member_id: auth.member_id,
        recipient_name: contactInfo.recipient_name,
        recipient_phone: contactInfo.recipient_phone,
        recipient_email: contactInfo.recipient_email,
        shipping_address: contactInfo.shipping_address,
        total_price: calculateTotal(),
        payment_status: 1,
        order_status: 1,
        MerchantTradeDate: new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        MerchantTradeNo: generateOrderNumber(),
        order_id: Date.now(),
        items: JSON.stringify(
          cartItems.map((item) => ({
            product_id: item.product_id,
            amount: item.amount,
            unit_price: item.product_price,
            total_price: item.product_price * item.amount,
          }))
        ),
      };

      const queryString = new URLSearchParams(orderData).toString();
      const paymentUrl = `http://localhost:3002/ecpay?${queryString}`;

      // console.log("跳轉的 URL:", paymentUrl);

      window.location.href = paymentUrl;
    } catch (error) {
      toast.error("訂單建立失敗: " + error.message);
      console.error(error);
    }
  };

  return (
    <Container className="checkout-page py-4">
      <ToastContainer />
      <h3 className="text-center mb-4">結帳頁</h3>

      {/* 步驟導航條 */}
      <div className="stepWrapper d-flex justify-content-center mb-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`stepItem ${currentStep === index + 1 ? "active" : ""}`}
            onClick={() => setCurrentStep(index + 1)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setCurrentStep(index + 1);
              }
            }}
          >
            <div className="stepContainer">
              <div className="stepNumber">{index + 1}</div>
              <span className="stepLabel">{step}</span>
            </div>
          </div>
        ))}
      </div>

      <Row>
        {/* 左側 2/3 填寫資料區域 */}
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body className="p-4">
              {/* 聯絡資訊區域 */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">聯絡資訊</h5>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  style={{
                    color: "#D3D3D3",
                    borderColor: "#D3D3D3",
                    backgroundColor: "transparent",
                  }}
                  onClick={() => {
                    dispatchContactInfo({
                      type: "UPDATE_FIELD",
                      field: "recipient_name",
                      value: "陳美女",
                    });
                    dispatchContactInfo({
                      type: "UPDATE_FIELD",
                      field: "recipient_phone",
                      value: "0911222333",
                    });
                    dispatchContactInfo({
                      type: "UPDATE_FIELD",
                      field: "recipient_email",
                      value: "test32@gmail.com",
                    });
                    dispatchContactInfo({
                      type: "UPDATE_FIELD",
                      field: "shipping_address",
                      value: "台北市大安區復興南路一段390號2樓",
                    });
                  }}
                >
                  快速填入資料
                </Button>
              </div>
              <Form>
                <Form.Group controlId="formName">
                  <Form.Label>收件人姓名</Form.Label>
                  <Form.Control
                    type="text"
                    name="recipient_name"
                    value={contactInfo.recipient_name}
                    onChange={handleChangeContactInfo}
                    placeholder="請輸入收件人姓名"
                    className="mb-3"
                  />
                </Form.Group>

                <Form.Group controlId="formPhone">
                  <Form.Label>電話</Form.Label>
                  <Form.Control
                    type="text"
                    name="recipient_phone"
                    value={contactInfo.recipient_phone}
                    onChange={handleChangeContactInfo}
                    onBlur={handlePhoneBlur}
                    placeholder="請輸入聯絡電話"
                    className="mb-3"
                  />
                </Form.Group>

                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="recipient_email"
                    value={contactInfo.recipient_email}
                    onChange={handleChangeContactInfo}
                    onBlur={handleEmailBlur}
                    placeholder="請輸入電子郵件"
                    className="mb-3"
                  />
                </Form.Group>

                <Form.Group controlId="formAddress">
                  <Form.Label>配送地址</Form.Label>
                  <Form.Control
                    type="text"
                    name="shipping_address"
                    value={contactInfo.shipping_address}
                    onChange={handleChangeContactInfo}
                    rows={3}
                    placeholder="請輸入配送地址"
                    className="mb-3"
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* 右側 1/3 訂單總覽區域 */}
        <Col md={4}>
          <Card>
            <Card.Body className="p-4">
              <h5 className="mb-3">訂單總覽</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ color: "#6C7275", fontWeight: 100 }}>商品</th>
                    <th
                      style={{
                        color: "#6C7275",
                        fontWeight: 100,
                        whiteSpace: "nowrap",
                      }}
                    >
                      數量
                    </th>
                    <th style={{ color: "#6C7275", fontWeight: 100 }}>小計</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.cart_id}>
                      <td style={{ verticalAlign: "middle" }}>
                        {/* 使用 flexbox 包裹圖片和商品名稱 */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Image
                            src={`http://localhost:3002/uploads/store_images/${item.image_url
                              .split("/")
                              .pop()}`}
                            alt={item.product_name}
                            width={50}
                            height={50}
                            objectFit="cover"
                            style={{ marginRight: "10px" }} // 控制圖片與名稱之間的距離
                          />
                          {/* <span style={{ whiteSpace: "nowrap" }}> */}
                          <span>{item.product_name}</span>
                        </div>
                      </td>
                      <td style={{ verticalAlign: "middle" }}>{item.amount}</td>
                      <td style={{ verticalAlign: "middle" }}>
                        ${(item.product_price * item.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="d-flex justify-content-between">
                <span>總金額</span>
                <span>${calculateTotal().toLocaleString()}</span>
              </div>

              <Button
                variant="dark"
                className="w-100 mt-4"
                onClick={handlePayment}
              >
                確認付款
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// 跳轉到綠界付款頁面
// window.location.href = http://localhost:3002/ecpay-test-only?amount=${calculateTotal()}&itemName=${cartItems};
